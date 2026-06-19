/**
 * POST /api/v1/twin/energy — publish a live energy reading.
 * GET  /api/v1/twin/energy — a freshly simulated reading (for pollers / testing).
 *
 * The POST broadcasts an `EnergyState` on the `prvio-energy` Supabase Realtime
 * channel; the /twin/energy Live diagram subscribes to it (falling back to the
 * on-device simulation when no realtime data flows). This is the server side of
 * the energy event bus — in the platform it is driven by the backend / Home
 * Assistant gateway; the body may carry a full reading or be derived here.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { initialEnergyState, simulate, SCENARIOS, type EnergyState } from "@/app/lib/twin/energy";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);

/** Merge an allowlisted partial reading over a base, deriving the rest. */
function buildReading(body: Record<string, unknown>): { state: EnergyState; carPct?: number } {
  const base = simulate(initialEnergyState, SCENARIOS[0], "self_powered", 20);
  const state: EnergyState = {
    solar: num(body.solar) ?? base.solar,
    home: num(body.home) ?? base.home,
    vehicle: num(body.vehicle) ?? base.vehicle,
    battery: num(body.battery) ?? base.battery,
    grid: num(body.grid) ?? base.grid,
    batteryPct: num(body.batteryPct) ?? base.batteryPct,
  };
  return { state, carPct: num(body.carPct) };
}

/** Broadcast a payload on a Realtime channel over HTTP (no socket needed). */
async function broadcast(topic: string, event: string, payload: unknown): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  const res = await fetch(`${url}/realtime/v1/api/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
    body: JSON.stringify({ messages: [{ topic, event, payload }] }),
  });
  return res.ok;
}

export async function GET() {
  const reading = buildReading({});
  return NextResponse.json({ apiVersion: API_VERSION, data: { ...reading.state, carPct: 69 } });
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "realtime_unconfigured" }, { status: 503 });
  }
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    const raw = await request.text();
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const { state, carPct } = buildReading(body);
  const payload = carPct !== undefined ? { ...state, carPct } : state;

  try {
    const ok = await broadcast("prvio-energy", "state", payload);
    if (!ok) {
      return NextResponse.json({ apiVersion: API_VERSION, error: "broadcast_failed" }, { status: 502 });
    }
    const properties = await listProperties();
    const property = properties[0];
    await writeAudit({
      user_id: userId,
      property_id: property?.id ?? null,
      action: "twin.energy.publish",
      resource: "prvio-energy",
      detail: `solar ${state.solar} · home ${state.home} · batt ${state.battery} (${Math.round(state.batteryPct)}%) · grid ${state.grid}`,
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { published: payload } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
