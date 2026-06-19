/** GET /api/v1/automations/schedules — time-based automation schedules (migration 006). */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listSchedules } from "@/lib/data/smarthome";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { schedules: [] } });
    return NextResponse.json({ apiVersion: API_VERSION, data: { schedules: await listSchedules(property.id) } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
