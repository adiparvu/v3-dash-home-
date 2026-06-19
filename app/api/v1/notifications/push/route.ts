/**
 * Web Push subscription management.
 *
 *   POST   /api/v1/notifications/push — save the caller's PushSubscription
 *   DELETE /api/v1/notifications/push — remove a subscription by endpoint
 *
 * The actual delivery is performed server-side by the `push-notify` edge
 * function (which signs + encrypts payloads with VAPID). Auth-gated; 503 when
 * Supabase is unconfigured so the UI degrades to in-app alerts only.
 */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { savePushSubscription, deletePushSubscription } from "@/lib/data/push";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

type IncomingSub = { endpoint?: string; keys?: { p256dh?: string; auth?: string } };

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  }
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let sub: IncomingSub = {};
  try {
    sub = JSON.parse(await request.text());
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }
  if (!sub.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_subscription" }, { status: 400 });
  }

  try {
    const saved = await savePushSubscription({
      user_id: userId,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      user_agent: request.headers.get("user-agent"),
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { id: saved.id } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  }
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  const endpoint = new URL(request.url).searchParams.get("endpoint");
  if (!endpoint) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "missing_endpoint" }, { status: 400 });
  }
  try {
    await deletePushSubscription(userId, endpoint);
    return NextResponse.json({ apiVersion: API_VERSION, data: { removed: true } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
