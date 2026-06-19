/**
 * DELETE /api/v1/profile/sessions/[id] — revoke a single session/device.
 * PATCH  /api/v1/profile/sessions/[id] — set device trust ({ trusted: boolean }).
 */
import { NextResponse } from "next/server";
import { currentUserId, revokeSession, setSessionTrust, writeAudit } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
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
  if (typeof body.trusted !== "boolean") {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_trusted" }, { status: 400 });
  }
  try {
    await setSessionTrust(userId, params.id, body.trusted);
    await writeAudit({ user_id: userId, action: "session.trust", resource: "user_sessions", detail: `${params.id}:${body.trusted}` });
    return NextResponse.json({ apiVersion: API_VERSION, data: { id: params.id, trusted: body.trusted } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    await revokeSession(userId, params.id);
    await writeAudit({ user_id: userId, action: "session.revoke", resource: "user_sessions", detail: params.id });
    return NextResponse.json({ apiVersion: API_VERSION, data: { id: params.id } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
