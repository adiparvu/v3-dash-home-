/** GET /api/v1/tasks — work items for the owner's property (migration 001). */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listTasks } from "@/lib/data/operations";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { tasks: [] } });
    const tasks = (await listTasks(property.id)).map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      due: t.due_date ? t.due_date.slice(0, 10) : null,
      priority: t.priority,
    }));
    return NextResponse.json({ apiVersion: API_VERSION, data: { tasks } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
