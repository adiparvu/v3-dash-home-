/**
 * GET  /api/v1/properties/[id]/valuations — valuation history for a property.
 * POST /api/v1/properties/[id]/valuations — record a new valuation mark.
 *
 * RLS-scoped to the owner via owns_property; adding a mark also updates the
 * property's denormalized current_value. Mutations are audited.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listValuations, addValuation } from "@/lib/data/estate";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const valuations = await listValuations(params.id);
    return NextResponse.json({ apiVersion: API_VERSION, data: { valuations } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const value = typeof body.value === "number" ? body.value : Number(body.value);
  if (!Number.isFinite(value)) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "value_required" }, { status: 400 });
  }
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 280) || null : null;

  try {
    const valuation = await addValuation(params.id, value, note);
    await writeAudit({ user_id: userId, property_id: params.id, action: "property.valuation.add", resource: "property_valuations", detail: String(value) });
    return NextResponse.json({ apiVersion: API_VERSION, data: { valuation } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
