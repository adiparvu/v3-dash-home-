/**
 * GET /api/v1/twin/sensors?zone=<zone_type> — sensors + latest values for a zone.
 *
 * The read side of the Zone-Monitoring framework: resolves the owner's property,
 * (optionally) the zone by its type, and returns each active sensor with its
 * freshest telemetry value. RLS-scoped; 503 when Supabase is unconfigured so the
 * monitoring UI falls back to its on-device demo metrics.
 */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties, listZones } from "@/lib/data/estate";
import { listSensors, latestTelemetry } from "@/lib/data/sensors";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  }
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  const zoneType = new URL(request.url).searchParams.get("zone");
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { sensors: [] } });

    let zoneId: string | undefined;
    if (zoneType) {
      const zones = await listZones(property.id);
      zoneId = zones.find((z) => z.type === zoneType)?.id;
      // A zone was requested but doesn't exist yet → nothing to show (demo fallback).
      if (!zoneId) return NextResponse.json({ apiVersion: API_VERSION, data: { sensors: [] } });
    }

    const [sensors, latest] = await Promise.all([
      listSensors(property.id, zoneId),
      latestTelemetry(property.id),
    ]);

    const out = sensors.map((s) => ({
      id: s.id,
      name: s.name,
      type: s.type,
      unit: s.unit,
      value: latest[s.id]?.value ?? null,
      recorded_at: latest[s.id]?.recorded_at ?? null,
    }));
    return NextResponse.json({ apiVersion: API_VERSION, data: { sensors: out } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
