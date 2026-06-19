/**
 * GET /api/v1/twin/devices — devices brokered by the Home Assistant gateway.
 *
 * Backend system-of-record for the gateway device list (migration 006), with
 * protocol + local/cloud + online state. RLS-scoped to the property owner; the
 * gateway screen falls back to its demo list when Supabase is unconfigured.
 */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listDevices } from "@/lib/data/smarthome";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  }
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { devices: [] } });
    const devices = await listDevices(property.id);
    return NextResponse.json({ apiVersion: API_VERSION, data: { devices } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
