/** GET /api/v1/privacy/export — structured, machine-readable export of the user's data. */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { exportUserData } from "@/lib/data/privacy";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const data = await exportUserData(userId);
    await writeAudit({ user_id: userId, action: "privacy.export", resource: "profiles" });
    return NextResponse.json({ apiVersion: API_VERSION, data: { export: data } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
