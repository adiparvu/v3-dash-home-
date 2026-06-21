/**
 * GET /api/v1/privacy/consents — the user's consent state.
 * PUT /api/v1/privacy/consents — set one consent { key, granted }.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listConsents, setConsent } from "@/lib/data/privacy";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const KEYS = ["analytics", "crash_reports", "personalization", "marketing", "ai_processing"];

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ apiVersion: API_VERSION, data: { consents: await listConsents(userId) } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 }); }

  const key = typeof body.key === "string" ? body.key : "";
  if (!KEYS.includes(key) || typeof body.granted !== "boolean") {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_input" }, { status: 400 });
  }
  try {
    const consent = await setConsent(userId, key, body.granted);
    await writeAudit({ user_id: userId, action: "privacy.consent.set", resource: "consents", detail: `${key}:${body.granted}` });
    return NextResponse.json({ apiVersion: API_VERSION, data: { consent } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
