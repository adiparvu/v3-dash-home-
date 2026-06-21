/**
 * GET /api/v1/maintenance — maintenance records for the owner's property.
 *
 * `maintenance_records` has no status column, so status is derived: a record
 * with a `next_due_at` in the past is "overdue", otherwise "scheduled". The
 * asset name is resolved from the property's assets.
 */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties, listAssets } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listMaintenance } from "@/lib/data/operations";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { maintenance: [] } });

    const [records, assets] = await Promise.all([
      listMaintenance(property.id),
      listAssets(property.id),
    ]);
    const assetName = new Map(assets.map((a) => [a.id, a.name]));
    const now = Date.now();

    const maintenance = records.map((m) => {
      const overdue = m.next_due_at != null && new Date(m.next_due_at).getTime() < now;
      const dueRaw = m.next_due_at ?? m.performed_at;
      return {
        id: m.id,
        title: m.title,
        asset: m.asset_id ? assetName.get(m.asset_id) ?? null : null,
        due: dueRaw ? dueRaw.slice(0, 10) : null,
        status: overdue ? "overdue" : "scheduled",
      };
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { maintenance } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
