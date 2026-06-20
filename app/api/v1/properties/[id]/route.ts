/**
 * GET   /api/v1/properties/[id] — a single property the user owns.
 * PATCH /api/v1/properties/[id] — update editable property fields.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { getProperty, updateProperty } from "@/lib/data/estate";
import type { TablesUpdate } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const EDITABLE = ["name", "description", "address", "city", "country", "total_area_sqm", "currency", "is_active"] as const;

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  const property = await getProperty(id);
  if (!property) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "not_found" }, { status: 404 });
  }
  return NextResponse.json({ apiVersion: API_VERSION, data: { property } });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const patch: TablesUpdate<"properties"> = {};
  for (const key of EDITABLE) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (key in body) (patch as any)[key] = body[key];
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "no_editable_fields" }, { status: 400 });
  }

  try {
    const property = await updateProperty(id, patch);
    await writeAudit({ user_id: userId, property_id: id, action: "property.update", resource: "properties", detail: Object.keys(patch).join(", ") });
    return NextResponse.json({ apiVersion: API_VERSION, data: { property } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
