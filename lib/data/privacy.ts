/**
 * Privacy & compliance data-access layer (spec: Data Privacy, Ownership &
 * Compliance). Per-user consent state, data-subject requests, and a structured,
 * machine-readable export of the user's data. All RLS-scoped to the caller.
 */
import { createClient } from "../supabase/server";
import type { Consent, PrivacyRequest, TablesInsert } from "../types/database.types";
import { getProfile, listSocialLinks, listTrustedPersons, listSessions, listAuditLog } from "./profile";
import { listProperties, listZones, listAssets, listValuations } from "./estate";
import { listTasks, listMaintenance, listDocuments, listContractors } from "./operations";

export async function listConsents(userId: string): Promise<Consent[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("consents").select("*").eq("user_id", userId);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function setConsent(userId: string, key: string, granted: boolean): Promise<Consent> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("consents")
    .upsert(
      { user_id: userId, consent_key: key, granted, updated_at: new Date().toISOString() },
      { onConflict: "user_id,consent_key" }
    )
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listPrivacyRequests(userId: string): Promise<PrivacyRequest[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("privacy_requests")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addPrivacyRequest(req: TablesInsert<"privacy_requests">): Promise<PrivacyRequest> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("privacy_requests").insert(req).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

/** A structured, machine-readable export of everything the user owns. */
export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [profile, socialLinks, trustedPersons, sessions, audit, properties, consents, requests] =
    await Promise.all([
      getProfile(userId),
      listSocialLinks(userId),
      listTrustedPersons(userId),
      listSessions(userId),
      listAuditLog(userId, 100),
      listProperties(),
      listConsents(userId),
      listPrivacyRequests(userId),
    ]);

  const property = properties[0];
  const estate = property
    ? {
        zones: await listZones(property.id),
        assets: await listAssets(property.id),
        tasks: await listTasks(property.id),
        maintenance: await listMaintenance(property.id),
        documents: await listDocuments(property.id),
        contractors: await listContractors(property.id),
        valuations: await listValuations(property.id),
      }
    : null;

  return {
    exportedAt: new Date().toISOString(),
    schemaVersion: "1.0.0",
    profile,
    socialLinks,
    trustedPersons,
    sessions,
    auditLog: audit,
    consents,
    privacyRequests: requests,
    properties,
    estate,
  };
}
