/**
 * Web Push subscription data-access layer (migration 008).
 *
 * Stores the browser PushSubscription per device so the push-notify edge function
 * can deliver notifications. RLS-scoped to the owning user.
 */
import { createClient } from "../supabase/server";
import type { PushSubscriptionRow, TablesInsert } from "../types/database.types";

export async function savePushSubscription(
  input: TablesInsert<"push_subscriptions">,
): Promise<PushSubscriptionRow> {
  const supabase = await createClient();
  // Upsert on the unique endpoint so re-subscribing the same browser is a no-op.
  const { data, error } = await supabase
    .from("push_subscriptions")
    .upsert(input, { onConflict: "endpoint" })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deletePushSubscription(userId: string, endpoint: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("endpoint", endpoint);
  if (error) throw new Error(error.message);
}

export async function listPushSubscriptions(userId: string): Promise<PushSubscriptionRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("push_subscriptions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}
