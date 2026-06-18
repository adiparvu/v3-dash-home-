/**
 * Digital Twin event data-access layer.
 *
 * Durable state-change events (migration 004) — the system-of-record behind the
 * twin's live event feed. RLS-scoped to the property owner; published over
 * Supabase Realtime for live state sync.
 */
import { createClient } from "../supabase/server";
import type { TwinEvent, TablesInsert } from "../types/database.types";

export async function listTwinEvents(propertyId: string, limit = 20): Promise<TwinEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("twin_events")
    .select("*")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function appendTwinEvent(input: TablesInsert<"twin_events">): Promise<TwinEvent> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("twin_events").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}
