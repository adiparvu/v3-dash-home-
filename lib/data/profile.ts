/**
 * Account & Identity data-access layer.
 *
 * Thin, typed repository over Supabase for the Phase 1 Account & Identity feature.
 * All access goes through the RLS-enabled server client, so callers only ever see
 * the authenticated user's own rows — authorization is enforced by the backend,
 * never by the client (see docs/PRODUCT_SPEC.md §9).
 */
import { createClient, createServiceClient } from "../supabase/server";
import { isSupabaseConfigured } from "../supabase/middleware";
import type {
  Profile,
  ProfileSocialLink,
  TrustedPerson,
  UserSession,
  AuditLogEntry,
  TablesInsert,
  TablesUpdate,
} from "../types/database.types";

/** Resolve the authenticated user id, or null when there is no session. */
export async function currentUserId(): Promise<string | null> {
  // No backend configured (localStorage prototype mode) → no session. Avoids the
  // Supabase client throwing on missing env vars so routes degrade to 401, not 500.
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(
  userId: string,
  patch: TablesUpdate<"profiles">
): Promise<Profile> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", userId)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function listSocialLinks(userId: string): Promise<ProfileSocialLink[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_social_links")
    .select("*")
    .eq("profile_id", userId)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addSocialLink(
  link: TablesInsert<"profile_social_links">
): Promise<ProfileSocialLink> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profile_social_links")
    .insert(link)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeSocialLink(userId: string, id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("profile_social_links")
    .delete()
    .eq("id", id)
    .eq("profile_id", userId);
  if (error) throw new Error(error.message);
}

export async function listTrustedPersons(userId: string): Promise<TrustedPerson[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trusted_persons")
    .select("*")
    .eq("profile_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function addTrustedPerson(
  person: TablesInsert<"trusted_persons">
): Promise<TrustedPerson> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("trusted_persons")
    .insert(person)
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function removeTrustedPerson(userId: string, id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("trusted_persons")
    .delete()
    .eq("id", id)
    .eq("profile_id", userId);
  if (error) throw new Error(error.message);
}

export async function listSessions(userId: string): Promise<UserSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_sessions")
    .select("*")
    .eq("user_id", userId)
    .is("revoked_at", null)
    .order("last_active_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function revokeSession(userId: string, id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

/** Mark a session/device as trusted (or untrusted). */
export async function setSessionTrust(userId: string, id: string, trusted: boolean): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_sessions")
    .update({ is_trusted: trusted })
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
}

/** Revoke every session except the one marked current. */
export async function revokeOtherSessions(userId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("user_sessions")
    .update({ revoked_at: new Date().toISOString() })
    .eq("user_id", userId)
    .eq("is_current", false)
    .is("revoked_at", null);
  if (error) throw new Error(error.message);
}

export async function listAuditLog(userId: string, limit = 25): Promise<AuditLogEntry[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_log")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Append an immutable audit-log entry. Uses the service-role client because the
 * `audit_log` table intentionally exposes no end-user INSERT policy — only
 * backend services may write, which keeps the log tamper-resistant.
 */
export async function writeAudit(
  entry: TablesInsert<"audit_log">
): Promise<void> {
  const supabase = await createServiceClient();
  const { error } = await supabase.from("audit_log").insert(entry);
  if (error) throw new Error(error.message);
}
