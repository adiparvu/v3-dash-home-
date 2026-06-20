/**
 * GET  /api/v1/assets/[id]/documents — list an asset's documents (with signed
 *      download URLs).
 * POST /api/v1/assets/[id]/documents — upload a document (multipart form-data,
 *      field "file") to Storage and record its metadata.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import {
  listAssetDocuments,
  getAssetPropertyId,
  uploadAssetDocument,
  signedDocumentUrl,
} from "@/lib/data/documents";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";
const MAX_BYTES = 25 * 1024 * 1024; // 25 MB upload cap

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    const rows = await listAssetDocuments(id);
    const documents = await Promise.all(
      rows.map(async (d) => ({
        id: d.id,
        name: d.name,
        file_name: d.file_name,
        file_size_bytes: d.file_size_bytes,
        mime_type: d.mime_type,
        created_at: d.created_at,
        download_url: await signedDocumentUrl(d.file_url),
      })),
    );
    return NextResponse.json({ apiVersion: API_VERSION, data: { documents } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_form" }, { status: 400 });
  }
  if (!file) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "file_required" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "file_too_large" }, { status: 413 });
  }

  const propertyId = await getAssetPropertyId(id);
  if (!propertyId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "asset_not_found" }, { status: 404 });
  }

  try {
    const doc = await uploadAssetDocument({ propertyId, assetId: id, uploadedBy: userId, file });
    await writeAudit({ user_id: userId, property_id: propertyId, action: "document.upload", resource: "documents", detail: doc.name });
    return NextResponse.json({ apiVersion: API_VERSION, data: { document: { id: doc.id, name: doc.name } } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
