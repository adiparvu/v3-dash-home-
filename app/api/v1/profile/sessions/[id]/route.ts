/** DELETE /api/v1/profile/sessions/[id] — revoke a single session/device. */
import { NextResponse } from "next/server";
import { currentUserId, revokeSession, writeAudit } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

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
