/**
 * POST /api/v1/twin/live-activities — register an APNs push token for an
 * in-progress Live Activity, so the backend can push ContentState updates.
 *
 * RLS-scoped to the authenticated owner.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { registerLiveActivity } from "@/lib/data/liveActivities";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

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

  const activityId = typeof body.activityId === "string" ? body.activityId.trim() : "";
  const pushToken = typeof body.pushToken === "string" ? body.pushToken.trim() : "";
  if (!activityId || !pushToken) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "activity_and_token_required" }, { status: 400 });
  }
  const kind = typeof body.kind === "string" ? body.kind.slice(0, 40) : "Maintenance";
  const jobTitle = typeof body.jobTitle === "string" ? body.jobTitle.slice(0, 120) : null;
  const propertyId = typeof body.propertyId === "string" ? body.propertyId : null;

  try {
    const record = await registerLiveActivity({
      user_id: userId,
      activity_id: activityId,
      push_token: pushToken,
      kind,
      job_title: jobTitle,
      property_id: propertyId,
    });
    await writeAudit({
      user_id: userId,
      property_id: propertyId ?? undefined,
      action: "live_activity.register",
      resource: "live_activities",
      detail: `${kind}: ${activityId}`,
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { id: record.id } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
