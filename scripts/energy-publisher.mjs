#!/usr/bin/env node
/**
 * PRVIO — energy event-bus test publisher (gateway simulator).
 *
 * Broadcasts a live `EnergyState` on the `prvio-energy` Supabase Realtime channel
 * every few seconds, exactly like the backend / Home Assistant gateway would.
 * The /twin/energy Live diagram subscribes to this channel (useEnergyLive) and
 * flips to the green "Live" badge while readings flow.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
 *     node scripts/energy-publisher.mjs [intervalSeconds]
 *
 * Talks straight to Supabase Realtime over HTTP (no app auth needed) — a
 * stand-in for a real gateway. Stop with Ctrl-C.
 */

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const INTERVAL = Math.max(1, Number(process.argv[2]) || 2) * 1000;

if (!URL_ || !KEY) {
  console.error("✗ Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.");
  process.exit(1);
}

// ── minimal power-balance simulation (mirrors app/lib/twin/energy.ts) ──────────
const PEAK_SOLAR = 6.8;
const MAX_BATTERY = 5.0;
const SOLAR_FACTOR = 0.72;
const HOME_BIAS = 0.85;
const r1 = (v) => Math.round(v * 10) / 10;
const jitter = (v, f) => v * (1 + (Math.random() - 0.5) * f);

let state = { solar: 4.9, home: 0.8, vehicle: 0.8, battery: 3.3, grid: 0, batteryPct: 89 };
let carPct = 69;

function step() {
  const solar = Math.max(0, r1(jitter(PEAK_SOLAR * SOLAR_FACTOR, 0.18)));
  const home = Math.max(0.2, r1(jitter(0.9 * HOME_BIAS, 0.25)));
  const vehicle = state.batteryPct > 40 ? r1(jitter(1.4, 0.2)) : 0;
  const consumption = home + vehicle;
  const net = solar - consumption;
  let battery = 0;
  let pct = state.batteryPct;
  if (net > 0) {
    const c = pct < 100 ? Math.min(net, MAX_BATTERY) : 0;
    battery = c; pct = Math.min(100, pct + c * 0.12);
  } else if (net < 0) {
    const d = pct > 20 ? Math.min(-net, MAX_BATTERY) : 0;
    battery = -d; pct = Math.max(0, pct - d * 0.12);
  }
  const grid = r1(consumption - solar + battery);
  state = { solar, home, vehicle, battery: r1(battery), grid, batteryPct: Math.round(pct * 10) / 10 };
  carPct = Math.min(100, Math.round((carPct + 0.4) * 10) / 10);
  return { ...state, carPct };
}

async function publish(payload) {
  const res = await fetch(`${URL_}/realtime/v1/api/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: KEY, Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ messages: [{ topic: "prvio-energy", event: "state", payload }] }),
  });
  return res.ok;
}

console.log(`▶ Publishing to prvio-energy every ${INTERVAL / 1000}s — Ctrl-C to stop.`);
async function tick() {
  const payload = step();
  try {
    const ok = await publish(payload);
    const t = new Date().toLocaleTimeString();
    console.log(`${ok ? "✓" : "✗"} ${t}  solar ${payload.solar} · home ${payload.home} · batt ${payload.battery} (${payload.batteryPct}%) · grid ${payload.grid} · car ${payload.carPct}%`);
  } catch (err) {
    console.error("✗ publish failed:", err.message);
  }
}
tick();
setInterval(tick, INTERVAL);
