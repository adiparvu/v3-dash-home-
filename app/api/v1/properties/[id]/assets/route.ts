/**
 * GET  /api/v1/properties/[id]/assets — assets within a property.
 * POST /api/v1/properties/[id]/assets — create an asset.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listAssets, createAsset } from "@/lib/data/estate";
import type { AssetCategory } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const CATEGORIES: AssetCategory[] = [
  "device", "plant", "equipment", "vehicle", "furniture", "structure", "other",
];

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const assets = await listAssets(params.id);
    return NextResponse.json({ apiVersion: API_VERSION, data: { assets } });
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
  const category = (CATEGORIES.includes(body.category as AssetCategory) ? body.category : "other") as AssetCategory;

  try {
    const asset = await createAsset({
      property_id: params.id,
      name,
      category,
      zone_id: typeof body.zone_id === "string" ? body.zone_id : null,
      location_description: typeof body.location_description === "string" ? body.location_description : null,
    });
    await writeAudit({ user_id: userId, property_id: params.id, action: "asset.create", resource: "assets", detail: name });
    return NextResponse.json({ apiVersion: API_VERSION, data: { asset } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
