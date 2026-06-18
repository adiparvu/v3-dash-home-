/**
 * AI knowledge retrieval data-access layer.
 *
 * Backend-brokered access to the pgvector knowledge store (migration 004). All
 * queries run through the RLS-enabled server client, so a caller only ever
 * retrieves chunks for properties they own — authorization is enforced by the
 * backend, never the client (deny-by-default, mirrors app/lib/ai/retrieval.ts).
 */
import { createClient } from "../supabase/server";

export type KnowledgeMatch = { id: string; scope: string; title: string; content: string };

/**
 * Text-based retrieval over the knowledge store, scoped by RLS to the owner and
 * filtered to the authorized scopes. Used until the embedding service is wired;
 * the `match_knowledge` RPC provides vector similarity once embeddings exist.
 */
export async function searchKnowledge(
  propertyId: string,
  query: string,
  scopes: string[],
  limit = 5
): Promise<KnowledgeMatch[]> {
  const supabase = await createClient();
  let q = supabase
    .from("knowledge_chunks")
    .select("id, scope, title, content")
    .eq("property_id", propertyId);
  if (scopes.length) q = q.in("scope", scopes);
  const trimmed = query.trim();
  if (trimmed) q = q.ilike("content", `%${trimmed}%`);
  const { data, error } = await q.limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Vector similarity retrieval via the backend-authorized `match_knowledge` RPC.
 * Requires a query embedding produced by the backend AI service.
 */
export async function matchKnowledge(
  propertyId: string,
  queryEmbedding: number[],
  scopes: string[],
  limit = 5
): Promise<KnowledgeMatch[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("match_knowledge", {
    prop_id: propertyId,
    query_embedding: JSON.stringify(queryEmbedding),
    match_scopes: scopes,
    match_count: limit,
  });
  if (error) throw new Error(error.message);
  return (data ?? []).map((r) => ({ id: r.id, scope: r.scope, title: r.title, content: r.content }));
}
