/** GET /api/v1/documents — document library for the owner's property (migration 001). */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listDocuments } from "@/lib/data/operations";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

/** Render a byte count as a short human-readable size, e.g. "2.1 MB". */
function humanSize(bytes: number | null): string | null {
  if (bytes == null) return null;
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { documents: [] } });
    const documents = (await listDocuments(property.id)).map((d) => ({
      id: d.id,
      name: d.name,
      kind: d.category,
      size: humanSize(d.file_size_bytes),
      updated_at: d.updated_at ? d.updated_at.slice(0, 10) : null,
    }));
    return NextResponse.json({ apiVersion: API_VERSION, data: { documents } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
