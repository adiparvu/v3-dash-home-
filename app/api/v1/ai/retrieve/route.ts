/**
 * POST /api/v1/ai/retrieve — backend-authorized retrieval over the estate
 * knowledge store. Body: { query: string, scopes?: string[] }.
 *
 * Deny-by-default and RLS-scoped: only the owner's chunks for the requested
 * scopes are returned, and every retrieval is audited.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { searchKnowledge } from "@/lib/data/ai";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";
const ALLOWED_SCOPES = ["zones", "assets", "tasks", "maintenance", "sensors", "overview"];

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

  const query = typeof body.query === "string" ? body.query.slice(0, 500) : "";
  if (!query.trim()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "query_required" }, { status: 400 });
  }
  // Intersect requested scopes with the allowlist (deny-by-default).
  const requested = Array.isArray(body.scopes) ? body.scopes.filter((s): s is string => typeof s === "string") : ALLOWED_SCOPES;
  const scopes = requested.filter((s) => ALLOWED_SCOPES.includes(s));

  try {
    const properties = await listProperties();
    const property = properties[0];
    if (!property) {
      return NextResponse.json({ apiVersion: API_VERSION, data: { chunks: [] } });
    }
    const chunks = await searchKnowledge(property.id, query, scopes, 5);
    await writeAudit({ user_id: userId, property_id: property.id, action: "ai.retrieve", resource: "knowledge_chunks", detail: query.slice(0, 120) });
    return NextResponse.json({ apiVersion: API_VERSION, data: { chunks } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
