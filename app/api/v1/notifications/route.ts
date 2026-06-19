/** GET /api/v1/notifications — durable notification history (migration 007). */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listNotifications } from "@/lib/data/smarthome";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { notifications: [] } });
    return NextResponse.json({ apiVersion: API_VERSION, data: { notifications: await listNotifications(property.id) } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
