/**
 * GET  /api/v1/properties — list the authenticated owner's properties.
 * POST /api/v1/properties — create a property.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listProperties, createProperty } from "@/lib/data/estate";
import type { TablesInsert } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const properties = await listProperties();
    return NextResponse.json({ apiVersion: API_VERSION, data: { properties } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

  // Allowlist of creatable columns.
  const allowed = ["description", "address", "city", "country", "total_area_sqm", "currency"] as const;
  const input: Omit<TablesInsert<"properties">, "owner_id"> = { name };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const key of allowed) if (key in body) (input as any)[key] = body[key];

  try {
    const property = await createProperty(userId, input);
    await writeAudit({ user_id: userId, property_id: property.id, action: "property.create", resource: "properties", detail: name });
    return NextResponse.json({ apiVersion: API_VERSION, data: { property } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
