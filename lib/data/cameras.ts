/**
 * Cameras & AI-detection data-access layer (migration 010).
 *
 * The camera registry and object-detection event stream brokered by a Frigate /
 * Scrypted NVR through the Home Assistant gateway. RLS-scoped to the property
 * owner; clients never talk to the NVR directly.
 */
import { createClient } from "../supabase/server";
import type { Camera, CameraEvent } from "../types/database.types";

export async function listCameras(propertyId: string, zone?: string): Promise<Camera[]> {
  const supabase = await createClient();
  let q = supabase.from("cameras").select("*").eq("property_id", propertyId);
  if (zone) q = q.eq("zone", zone);
  const { data, error } = await q.order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listCameraEvents(propertyId: string, limit = 30): Promise<CameraEvent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("camera_events")
    .select("*")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
