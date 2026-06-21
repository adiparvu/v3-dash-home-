/** GET /api/v1/privacy/retention — documented data-retention schedule. */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const SCHEDULE = [
  { category: "Account & identity", period: "Until account deletion" },
  { category: "Estate records & documents", period: "Until deleted by owner; ownership-transfer records preserved" },
  { category: "Audit logs", period: "7 years (compliance)" },
  { category: "Analytics", period: "14 months" },
  { category: "AI conversations", period: "12 months unless deleted" },
];

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ apiVersion: API_VERSION, data: { retention: SCHEDULE } });
}
