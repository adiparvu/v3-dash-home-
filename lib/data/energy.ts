/**
 * Energy readings data-access layer.
 *
 * Durable time-series (migration 005) behind the Energy module — every reading
 * published on the `prvio-energy` event bus is appended here, feeding the
 * Energie / Impact history. RLS-scoped to the property owner.
 */
import { createClient } from "../supabase/server";
import type { EnergyReading, TablesInsert } from "../types/database.types";

export async function appendEnergyReading(input: TablesInsert<"energy_readings">): Promise<EnergyReading> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("energy_readings").insert(input).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listEnergyReadings(propertyId: string, limit = 96): Promise<EnergyReading[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("energy_readings")
    .select("*")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
