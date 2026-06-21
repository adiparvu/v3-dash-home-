/**
 * POST /api/v1/properties/[id]/transfer — initiate an ownership-transfer request.
 *
 * High-risk action (spec: Property & Estate Management → Property Transfer;
 * Security & AI Guardrails → High-Risk Action Controls). This records an
 * auditable, immutable transfer request (ownership verification + legal
 * confirmation record) after multi-step client confirmation. It does NOT flip
 * `owner_id`: the actual reassignment requires recipient acceptance and legal
 * completion, handled as a separate, explicitly-authorized workflow.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { getProperty } from "@/lib/data/estate";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const str = (v: unknown, max = 160): string => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const recipientName = str(body.recipientName, 120);
  const recipientEmail = str(body.recipientEmail, 160);
  const jurisdiction = str(body.jurisdiction, 80);
  const effectiveDate = str(body.effectiveDate, 40);
  if (!recipientName || !recipientEmail) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "recipient_required" }, { status: 400 });
  }

  // Ownership verification: the property must belong to the caller (RLS-scoped).
  const property = await getProperty(params.id);
  if (!property) return NextResponse.json({ apiVersion: API_VERSION, error: "not_found" }, { status: 404 });

  try {
    const detail = `to ${recipientName} <${recipientEmail}> · ${jurisdiction || "n/a"} · effective ${effectiveDate || "n/a"}`;
    await writeAudit({
      user_id: userId,
      property_id: params.id,
      action: "property.transfer.request",
      resource: "properties",
      detail,
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { status: "pending", property: property.name } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
