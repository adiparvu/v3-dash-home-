/**
 * GET    /api/v1/profile/sessions — list the user's active sessions.
 * DELETE /api/v1/profile/sessions — revoke all sessions except the current one.
 */
import { NextResponse } from "next/server";
import { currentUserId, listSessions, revokeOtherSessions, writeAudit } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const sessions = await listSessions(userId);
    return NextResponse.json({ apiVersion: API_VERSION, data: { sessions } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function DELETE() {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    await revokeOtherSessions(userId);
    await writeAudit({ user_id: userId, action: "session.revoke_all", resource: "user_sessions" });
    return NextResponse.json({ apiVersion: API_VERSION, data: { revoked: "others" } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
