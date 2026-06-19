/**
 * POST /api/v1/ai/summarize — backend-brokered document understanding.
 *
 * The server-side orchestrator for document summarization (spec: AI Layer →
 * document understanding). Document fields are treated as untrusted input; the
 * grounded, schema-validated summary is produced under the same guardrails as
 * the on-device path, and every run is audited. Auth + Supabase gated; the
 * Documents UI falls back to the on-device summarizer when unconfigured.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { summarizeDocument, type DocInput } from "@/app/lib/ai/documents";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";
const str = (v: unknown, max = 160): string => (typeof v === "string" ? v.slice(0, max) : "");

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "ai_unconfigured" }, { status: 503 });
  }
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

  const doc: DocInput = {
    name: str(body.name),
    category: str(body.category, 40),
    type: str(body.type, 40),
    zone: str(body.zone, 60),
    date: str(body.date, 40),
  };
  if (!doc.name) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "name_required" }, { status: 400 });
  }

  try {
    const summary = summarizeDocument(doc);
    const property = (await listProperties())[0];
    await writeAudit({
      user_id: userId,
      property_id: property?.id ?? null,
      action: "ai.summarize",
      resource: "documents",
      detail: doc.name.slice(0, 120),
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { summary } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
