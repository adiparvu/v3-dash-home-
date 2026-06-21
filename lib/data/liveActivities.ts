/**
 * Live Activity push-token data-access layer (migration 011).
 *
 * Stores the per-activity APNs token reported by the iOS app so the backend can
 * push ContentState updates. RLS-scoped to the owning user via the server client.
 */
import { createClient } from "../supabase/server";
import type { LiveActivityRow, TablesInsert } from "../types/database.types";

export async function registerLiveActivity(
  input: TablesInsert<"live_activities">
): Promise<LiveActivityRow> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("live_activities")
    .upsert(input, { onConflict: "user_id,activity_id" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/** Active (not ended) tokens for an activity owned by the caller (RLS-scoped). */
export async function listLiveActivityTokens(activityId: string): Promise<LiveActivityRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("live_activities")
    .select("*")
    .eq("activity_id", activityId)
    .eq("ended", false);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function markLiveActivityEnded(activityId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("live_activities")
    .update({ ended: true })
    .eq("activity_id", activityId);
  if (error) throw new Error(error.message);
}
