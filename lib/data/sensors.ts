/**
 * Sensors & telemetry data-access layer.
 *
 * The generic monitoring substrate behind the Zone-Monitoring framework: any
 * module (heleșteu, greenhouse, pool…) reads its live metrics from `sensors` +
 * `telemetry`. RLS-scoped to the property owner; every reading is brokered by the
 * backend / Home Assistant gateway, never by the client.
 */
import { createClient } from "../supabase/server";
import type { Sensor, Telemetry } from "../types/database.types";

/** Sensors for a property, optionally narrowed to a single zone. */
export async function listSensors(propertyId: string, zoneId?: string): Promise<Sensor[]> {
  const supabase = await createClient();
  let q = supabase.from("sensors").select("*").eq("property_id", propertyId).eq("is_active", true);
  if (zoneId) q = q.eq("zone_id", zoneId);
  const { data, error } = await q.order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** A descending time-series for one sensor (newest first). */
export async function listTelemetryForSensor(sensorId: string, limit = 96): Promise<Telemetry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("telemetry")
    .select("*")
    .eq("sensor_id", sensorId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Latest value per sensor for a property — one recent telemetry sweep reduced to
 * the freshest reading per sensor_id (avoids an N-query fan-out).
 */
export async function latestTelemetry(
  propertyId: string,
  scanLimit = 500,
): Promise<Record<string, { value: number; recorded_at: string }>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("telemetry")
    .select("sensor_id, value, recorded_at")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false })
    .limit(scanLimit);
  if (error) throw new Error(error.message);
  const out: Record<string, { value: number; recorded_at: string }> = {};
  for (const r of data ?? []) {
    if (!out[r.sensor_id]) out[r.sensor_id] = { value: Number(r.value), recorded_at: r.recorded_at };
  }
  return out;
}
