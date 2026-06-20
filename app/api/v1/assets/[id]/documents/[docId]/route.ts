/**
 * DELETE /api/v1/assets/[id]/documents/[docId] — remove a document (Storage
 * object + metadata row). RLS scopes the delete to the property owner.
 */
import { NextResponse } from "next/server";
import { currentUserId, writeAudit } from "@/lib/data/profile";
import { getAssetPropertyId, deleteAssetDocument } from "@/lib/data/documents";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string; docId: string }> }) {
  const { id, docId } = await params;
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }
  try {
    await deleteAssetDocument(docId);
    const propertyId = await getAssetPropertyId(id);
    await writeAudit({ user_id: userId, property_id: propertyId ?? undefined, action: "document.delete", resource: "documents", detail: docId });
    return NextResponse.json({ apiVersion: API_VERSION, data: { ok: true } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
