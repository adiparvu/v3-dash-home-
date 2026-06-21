/**
 * Operations data-access layer — tasks, maintenance, documents and contractors.
 *
 * Typed repository over the RLS-enabled Supabase server client, mirroring
 * `lib/data/estate.ts`. Every list is scoped to a property the authenticated
 * owner controls; Row Level Security enforces tenancy via the `owns_property`
 * policy, so callers never see another owner's rows.
 */
import { createClient } from "../supabase/server";
import type {
  Task,
  MaintenanceRecord,
  Document,
  Contractor,
} from "../types/database.types";

export async function listTasks(propertyId: string): Promise<Task[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("property_id", propertyId)
    .order("due_date", { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listMaintenance(propertyId: string): Promise<MaintenanceRecord[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("maintenance_records")
    .select("*")
    .eq("property_id", propertyId)
    .order("performed_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listDocuments(propertyId: string): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("property_id", propertyId)
    .eq("is_archived", false)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listContractors(propertyId: string): Promise<Contractor[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contractors")
    .select("*")
    .eq("property_id", propertyId)
    .eq("is_active", true)
    .order("is_preferred", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
