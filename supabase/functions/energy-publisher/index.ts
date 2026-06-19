// =============================================================================
// Edge Function: energy-publisher
// =============================================================================
// Server-side replacement for scripts/energy-publisher.mjs. On each invocation it
// advances a power-balance simulation, broadcasts the reading on the
// `prvio-energy` Supabase Realtime channel (what useEnergyLive subscribes to),
// and — when a property_id is supplied — persists it to `energy_readings` via the
// service-role key so the Energie / Impact history fills up.
//
// Designed to be scheduled with pg_cron + pg_net, e.g. every minute:
//   select cron.schedule('energy-tick', '* * * * *', $$
//     select net.http_post(
//       url     := '<project>.functions.supabase.co/energy-publisher',
//       headers := jsonb_build_object('Authorization', 'Bearer <service-role-key>',
//                                     'Content-Type', 'application/json'),
//       body    := jsonb_build_object('property_id', '<uuid>')
//     ); $$);
//
// verify_jwt is enabled: the caller must present a valid JWT (the service-role key
// works), so this is never anonymously invocable.
// =============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// ── power-balance simulation (mirrors app/lib/twin/energy.ts) ─────────────────
const PEAK_SOLAR = 6.8;
const MAX_BATTERY = 5.0;
const SOLAR_FACTOR = 0.72;
const HOME_BIAS = 0.85;
const r1 = (v: number) => Math.round(v * 10) / 10;
const jitter = (v: number, f: number) => v * (1 + (Math.random() - 0.5) * f);

// Sun curve: 0 at night, peak near solar noon — keeps overnight readings honest.
function solarNow(): number {
  const h = new Date().getUTCHours() + new Date().getUTCMinutes() / 60;
  const day = Math.cos(((h - 13) / 12) * Math.PI); // peak ~13:00 UTC
  const factor = Math.max(0, day);
  return Math.max(0, r1(jitter(PEAK_SOLAR * SOLAR_FACTOR * factor, 0.18)));
}

function step(prevPct: number, prevCar: number) {
  const solar = solarNow();
  const home = Math.max(0.2, r1(jitter(0.9 * HOME_BIAS, 0.25)));
  const vehicle = prevPct > 40 && prevCar < 100 ? r1(jitter(1.4, 0.2)) : 0;
  const consumption = home + vehicle;
  const net = solar - consumption;
  let battery = 0;
  let pct = prevPct;
  if (net > 0) {
    const c = pct < 100 ? Math.min(net, MAX_BATTERY) : 0;
    battery = c;
    pct = Math.min(100, pct + c * 0.12);
  } else if (net < 0) {
    const d = pct > 20 ? Math.min(-net, MAX_BATTERY) : 0;
    battery = -d;
    pct = Math.max(0, pct - d * 0.12);
  }
  const grid = r1(consumption - solar + battery);
  const carPct = Math.min(100, r1(prevCar + 0.4));
  return { solar, home, vehicle, battery: r1(battery), grid, batteryPct: r1(pct), carPct };
}

Deno.serve(async (req: Request) => {
  let propertyId: string | null = null;
  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    propertyId = body?.property_id ?? new URL(req.url).searchParams.get("property_id");
  } catch {
    propertyId = null;
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

  // Seed the simulation from the last persisted reading (continuity across ticks).
  let prevPct = 89;
  let prevCar = 69;
  if (propertyId) {
    const { data } = await supabase
      .from("energy_readings")
      .select("battery_pct, car_pct")
      .eq("property_id", propertyId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (data) {
      prevPct = Number(data.battery_pct) || prevPct;
      prevCar = Number(data.car_pct) || prevCar;
    }
  }

  const reading = step(prevPct, prevCar);

  // 1) Broadcast on the live channel (efemeral — drives the Live diagram badge).
  const channel = supabase.channel("prvio-energy");
  await new Promise<void>((resolve) => {
    channel.subscribe((status: string) => {
      if (status === "SUBSCRIBED") resolve();
    });
    setTimeout(resolve, 1500); // don't hang if Realtime is unavailable
  });
  await channel.send({ type: "broadcast", event: "state", payload: reading });
  await supabase.removeChannel(channel);

  // 2) Persist (only when a property is targeted).
  let persisted = false;
  if (propertyId) {
    const { error } = await supabase.from("energy_readings").insert({
      property_id: propertyId,
      solar: reading.solar,
      home: reading.home,
      vehicle: reading.vehicle,
      battery: reading.battery,
      grid: reading.grid,
      battery_pct: reading.batteryPct,
      car_pct: reading.carPct,
    });
    persisted = !error;
  }

  return new Response(JSON.stringify({ ok: true, persisted, reading }), {
    headers: { "Content-Type": "application/json" },
  });
});
