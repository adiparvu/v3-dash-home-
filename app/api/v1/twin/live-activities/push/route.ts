/**
 * POST /api/v1/twin/live-activities/push — push a ContentState update (or end)
 * to the caller's in-progress Live Activity over APNs.
 *
 * Returns 503 when APNs is not configured (no credentials), mirroring the app's
 * graceful-degradation pattern. RLS-scoped: a user can only push their own
 * activities.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listLiveActivityTokens, markLiveActivityEnded } from "@/lib/data/liveActivities";
import { apnsConfig, buildApnsJWT, buildLiveActivityPayload, sendLiveActivityPush } from "@/lib/apns";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  const config = apnsConfig();
  if (!config) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "apns_not_configured" }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const activityId = typeof body.activityId === "string" ? body.activityId.trim() : "";
  const stateInput = (body.state ?? {}) as Record<string, unknown>;
  const status = typeof stateInput.status === "string" ? stateInput.status.slice(0, 60) : "";
  const progress = typeof stateInput.progress === "number" ? Math.min(Math.max(stateInput.progress, 0), 1) : NaN;
  const etaMinutes = typeof stateInput.etaMinutes === "number" ? stateInput.etaMinutes : null;
  const event = body.event === "end" ? "end" : "update";

  if (!activityId || !status || Number.isNaN(progress)) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_state" }, { status: 400 });
  }

  try {
    const tokens = await listLiveActivityTokens(activityId);
    if (tokens.length === 0) {
      return NextResponse.json({ apiVersion: API_VERSION, error: "activity_not_found" }, { status: 404 });
    }

    const payload = buildLiveActivityPayload(
      { status, progress, etaMinutes },
      { event, staleDate: Math.floor(Date.now() / 1000) + 3600 }
    );
    const jwt = buildApnsJWT(config); // one token reused across recipients

    const results = await Promise.all(
      tokens.map(async (t) => {
        try {
          const r = await sendLiveActivityPush(config, t.push_token, payload, jwt);
          return { ok: r.status === 200, status: r.status, reason: r.reason };
        } catch (err) {
          return { ok: false, status: 0, reason: err instanceof Error ? err.message : "send_failed" };
        }
      })
    );

    if (event === "end") await markLiveActivityEnded(activityId);

    const sent = results.filter((r) => r.ok).length;
    await writeAudit({
      user_id: userId,
      action: event === "end" ? "live_activity.end" : "live_activity.push",
      resource: "live_activities",
      detail: `${activityId} → ${sent}/${tokens.length}`,
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { sent, total: tokens.length, results } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
