/**
 * Smart-home data-access layer (migration 006).
 *
 * Devices brokered by the Home Assistant gateway — the system-of-record behind
 * the gateway device list. RLS-scoped to the property owner. (Presence and
 * automation schedules from the same migration are wired similarly.)
 */
import { createClient } from "../supabase/server";
import type { DeviceRegistryRow } from "../types/database.types";

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
