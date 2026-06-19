/** GET /api/v1/audit — recent immutable audit-log entries for the current user. */
import { NextResponse } from "next/server";
import { currentUserId, listAuditLog } from "@/lib/data/profile";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function GET(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 25, 1), 100);
  try {
    const entries = await listAuditLog(userId, limit);
    return NextResponse.json({ apiVersion: API_VERSION, data: { entries } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
