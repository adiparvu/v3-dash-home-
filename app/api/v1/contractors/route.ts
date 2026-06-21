/** GET /api/v1/contractors — contractor directory for the owner's property (migration 001). */
import { NextResponse } from "next/server";
import { currentUserId } from "@/lib/data/profile";
import { listProperties } from "@/lib/data/estate";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { listContractors } from "@/lib/data/operations";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function GET() {
  if (!isSupabaseConfigured()) return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  const userId = await currentUserId();
  if (!userId) return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  try {
    const property = (await listProperties())[0];
    if (!property) return NextResponse.json({ apiVersion: API_VERSION, data: { contractors: [] } });
    const contractors = (await listContractors(property.id)).map((c) => ({
      id: c.id,
      name: c.name,
      company: c.company,
      phone: c.phone,
      email: c.email,
      rating: c.rating,
      is_preferred: c.is_preferred,
    }));
    return NextResponse.json({ apiVersion: API_VERSION, data: { contractors } });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
