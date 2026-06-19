/**
 * POST /api/v1/onboarding/provision — provision the signed-in user's estate.
 *
 * Called when onboarding finishes: ensures the user's `profiles` row exists (the
 * FK target for property ownership), then creates their property and seeds the
 * property-scoped tables (zones, devices, presence, schedules, energy history).
 * Idempotent — returns the existing property if one is already owned. Falls back
 * to 503 when Supabase is unconfigured, so the demo (local-only) onboarding keeps
 * working unchanged.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/middleware";
import { provisionEstate } from "@/lib/data/seed";
import { writeAudit } from "@/lib/data/profile";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unconfigured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let body: { name?: string; zones?: string[] } = {};
  try {
    const raw = await request.text();
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  try {
    // Ensure the profile row exists (an auth trigger may already create it; this
    // upsert is a no-op when it does, and the FK target when it doesn't).
    await supabase
      .from("profiles")
      .upsert({ id: user.id, email: user.email ?? "", onboarding_completed: true }, { onConflict: "id" });

    const { property, created } = await provisionEstate(user.id, {
      name: typeof body.name === "string" ? body.name : "My Estate",
      zones: Array.isArray(body.zones) ? body.zones.filter((z) => typeof z === "string") : undefined,
    });

    if (created) {
      await writeAudit({
        user_id: user.id,
        property_id: property.id,
        action: "onboarding.provision",
        resource: "properties",
        detail: `Provisioned estate "${property.name}"`,
      }).catch(() => {});
    }

    return NextResponse.json(
      { apiVersion: API_VERSION, data: { property, created } },
      { status: created ? 201 : 200 },
    );
  } catch (err) {
    return NextResponse.json(
      { apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" },
      { status: 500 },
    );
  }
}
