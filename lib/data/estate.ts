/**
 * Estate data-access layer — properties, zones and assets.
 *
 * Typed repository over the RLS-enabled Supabase server client. Every query is
 * scoped to the authenticated owner by Row Level Security; inserts set the
 * ownership columns explicitly and are validated by the `owns_property` policy.
 */
import { createClient } from "../supabase/server";
import type {
  Property,
  Zone,
  Asset,
  PropertyValuation,
  TablesInsert,
  TablesUpdate,
} from "../types/database.types";

export async function listProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

export async function createProperty(
  ownerId: string,
  input: Omit<TablesInsert<"properties">, "owner_id">
): Promise<Property> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .insert({ ...input, owner_id: ownerId })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProperty(
  id: string,
  patch: TablesUpdate<"properties">
): Promise<Property> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listZones(propertyId: string): Promise<Zone[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("zones")
    .select("*")
    .eq("property_id", propertyId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createZone(zone: TablesInsert<"zones">): Promise<Zone> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("zones").insert(zone).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listAssets(propertyId: string): Promise<Asset[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createAsset(asset: TablesInsert<"assets">): Promise<Asset> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("assets").insert(asset).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listValuations(propertyId: string): Promise<PropertyValuation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_valuations")
    .select("*")
    .eq("property_id", propertyId)
    .order("recorded_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addValuation(
  propertyId: string,
  value: number,
  note: string | null
): Promise<PropertyValuation> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("property_valuations")
    .insert({ property_id: propertyId, value, note })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  // Keep the property's denormalized current_value in sync with the latest mark.
  await supabase.from("properties").update({ current_value: value }).eq("id", propertyId);
  return data;
}
