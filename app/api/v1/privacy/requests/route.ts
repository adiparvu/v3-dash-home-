/**
 * GET  /api/v1/privacy/requests — the user's data-subject (GDPR/CCPA) requests.
 * POST /api/v1/privacy/requests — file a request { type, regulation?, note? }.
 *
 * Erasure and other high-risk requests are recorded as pending and audited;
 * fulfilment is handled out-of-band (never an immediate destructive action).
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listPrivacyRequests, addPrivacyRequest } from "@/lib/data/privacy";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const TYPES = ["access", "export", "erasure", "rectification", "restriction", "objection"];
const REGULATIONS = ["gdpr", "ccpa"];

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ apiVersion: API_VERSION, data: { requests: await listPrivacyRequests(userId) } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 }); }

  const type = typeof body.type === "string" ? body.type : "";
  if (!TYPES.includes(type)) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_type" }, { status: 400 });
  }
  const regulation = REGULATIONS.includes(body.regulation as string) ? (body.regulation as string) : null;
  const note = typeof body.note === "string" ? body.note.trim().slice(0, 500) || null : null;

  try {
    const req = await addPrivacyRequest({ user_id: userId, type, regulation, note, status: "pending" });
    await writeAudit({ user_id: userId, action: "privacy.request.file", resource: "privacy_requests", detail: `${type}${regulation ? "/" + regulation : ""}` });
    return NextResponse.json({ apiVersion: API_VERSION, data: { request: req } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
