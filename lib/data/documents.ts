/**
 * Documents data-access layer — asset documents stored in the private
 * `documents` Storage bucket with metadata rows in public.documents. All access
 * goes through the RLS-enabled server client, so callers only ever touch rows /
 * objects for properties they own.
 */
import { createClient } from "../supabase/server";
import type { Document, TablesInsert } from "../types/database.types";

const BUCKET = "documents";

export async function listAssetDocuments(assetId: string): Promise<Document[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("asset_id", assetId)
    .eq("is_archived", false)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

/** Resolve the asset's property (also confirms the caller owns it via RLS). */
export async function getAssetPropertyId(assetId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("assets")
    .select("property_id")
    .eq("id", assetId)
    .single();
  if (error) return null;
  return data.property_id;
}

/** Upload a file to Storage and record its metadata row. */
export async function uploadAssetDocument(opts: {
  propertyId: string;
  assetId: string;
  uploadedBy: string;
  file: File;
}): Promise<Document> {
  const supabase = await createClient();
  const safeName = opts.file.name.replace(/[^\w.\-]+/g, "_").slice(0, 120) || "file";
  const path = `${opts.propertyId}/${opts.assetId}/${crypto.randomUUID()}-${safeName}`;
  const bytes = new Uint8Array(await opts.file.arrayBuffer());

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, bytes, {
    contentType: opts.file.type || "application/octet-stream",
    upsert: false,
  });
  if (upErr) throw new Error(upErr.message);

  const insert: TablesInsert<"documents"> = {
    property_id: opts.propertyId,
    asset_id: opts.assetId,
    uploaded_by: opts.uploadedBy,
    name: opts.file.name,
    file_url: path,
    file_name: opts.file.name,
    file_size_bytes: opts.file.size,
    mime_type: opts.file.type || null,
  };
  const { data, error } = await supabase.from("documents").insert(insert).select("*").single();
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]); // best-effort cleanup
    throw new Error(error.message);
  }
  return data;
}

export async function deleteAssetDocument(id: string): Promise<void> {
  const supabase = await createClient();
  const { data: doc } = await supabase.from("documents").select("file_url").eq("id", id).single();
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) throw new Error(error.message);
  if (doc?.file_url) await supabase.storage.from(BUCKET).remove([doc.file_url]);
}

/** Short-lived signed URL for downloading a private object. */
export async function signedDocumentUrl(path: string, expiresIn = 3600): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}
