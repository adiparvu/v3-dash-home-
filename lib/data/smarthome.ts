/**
 * Smart-home data-access layer (migration 006).
 *
 * Devices brokered by the Home Assistant gateway — the system-of-record behind
 * the gateway device list. RLS-scoped to the property owner. (Presence and
 * automation schedules from the same migration are wired similarly.)
 */
import { createClient } from "../supabase/server";
import type { DeviceRegistryRow, PresenceEventRow, AutomationScheduleRow, NotificationRow } from "../types/database.types";

export async function listDevices(propertyId: string): Promise<DeviceRegistryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("device_registry")
    .select("*")
    .eq("property_id", propertyId)
    .order("last_seen_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Latest presence state per person (most recent event wins). */
export async function listPresence(propertyId: string, limit = 100): Promise<PresenceEventRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("presence_events")
    .select("*")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listSchedules(propertyId: string): Promise<AutomationScheduleRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("automation_schedules")
    .select("*")
    .eq("property_id", propertyId)
    .order("at_time", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listNotifications(propertyId: string, limit = 50): Promise<NotificationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("property_id", propertyId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
