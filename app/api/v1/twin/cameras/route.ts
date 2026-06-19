/**
 * GET /api/v1/twin/cameras?zone=<zone> — cameras + recent AI detections.
 *
 * Read side of the camera capability: resolves the owner's property and returns
 * the camera registry (optionally for one zone) plus the most recent
 * object-detection events. RLS-scoped; 503 when Supabase is unconfigured so the
 * camera wall falls back to its demo feed.
 */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { listCameras, listCameraEvents } from "@/lib/data/cameras";
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

  const zone = new URL(request.url).searchParams.get("zone") ?? undefined;
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { cameras: [], events: [] } });
    const [cameras, events] = await Promise.all([
      listCameras(property.id, zone),
      listCameraEvents(property.id),
    ]);
    return NextResponse.json({ apiVersion: API_VERSION, data: { cameras, events } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
