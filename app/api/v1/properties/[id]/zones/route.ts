/**
 * GET  /api/v1/properties/[id]/zones — zones within a property.
 * POST /api/v1/properties/[id]/zones — create a zone.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listZones, createZone } from "@/lib/data/estate";
import type { ZoneType } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const ZONE_TYPES: ZoneType[] = [
  "forest", "greenhouse", "orchard", "lake", "garden", "house", "driveway", "smart_home", "custom",
];

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const zones = await listZones(params.id);
    return NextResponse.json({ apiVersion: API_VERSION, data: { zones } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "name_required" }, { status: 400 });
  }
  const type = (ZONE_TYPES.includes(body.type as ZoneType) ? body.type : "custom") as ZoneType;

  try {
    const zone = await createZone({
      property_id: params.id,
      name,
      type,
      description: typeof body.description === "string" ? body.description : null,
    });
    await writeAudit({ user_id: userId, property_id: params.id, action: "zone.create", resource: "zones", detail: name });
    return NextResponse.json({ apiVersion: API_VERSION, data: { zone } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
