/**
 * GET  /api/v1/twin/events — recent live state events for the owner.
 * POST /api/v1/twin/events — append a state-change event (system-of-record).
 *
 * RLS-scoped to the property owner; events are published over Supabase Realtime
 * for live state sync.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { listTwinEvents, appendTwinEvent } from "@/lib/data/twin";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";
const STATUSES = ["ok", "warn", "alert"];

export async function GET(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 20, 1), 100);
  try {
    const properties = await listProperties();
    const property = properties[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { events: [] } });
    const events = await listTwinEvents(property.id, limit);
    return NextResponse.json({ apiVersion: API_VERSION, data: { events } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

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

  const sensorExternalId = typeof body.sensorExternalId === "string" ? body.sensorExternalId : "";
  const label = typeof body.label === "string" ? body.label : "";
  const message = typeof body.message === "string" ? body.message.slice(0, 300) : "";
  const status = typeof body.status === "string" && STATUSES.includes(body.status) ? body.status : "";
  if (!sensorExternalId || !label || !message || !status) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_event" }, { status: 400 });
  }

  try {
    const properties = await listProperties();
    const property = properties[0];
    if (!property) {
      return NextResponse.json({ apiVersion: API_VERSION, error: "no_property" }, { status: 400 });
    }
    const event = await appendTwinEvent({
      property_id: property.id,
      sensor_external_id: sensorExternalId,
      label,
      message,
      status,
    });
    await writeAudit({ user_id: userId, property_id: property.id, action: "twin.event", resource: "twin_events", detail: message.slice(0, 120) });
    return NextResponse.json({ apiVersion: API_VERSION, data: { event } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
