/**
 * GET  /api/v1/profile  — the authenticated user's profile + identity bundle.
 * PATCH /api/v1/profile — update editable profile fields.
 *
 * URI-versioned per the platform versioning policy (docs/PRODUCT_SPEC.md §10).
 * Authorization is enforced by Supabase RLS via the server client; this handler
 * only ever resolves the caller's own data.
 */
import { NextResponse } from "next/server";
import {
  currentUserId,
  getProfile,
  updateProfile,
  listSocialLinks,
  listTrustedPersons,
  listSessions,
  writeAudit,
} from "../../../../lib/data/profile";
import type { TablesUpdate } from "../../../../lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

/** Fields a client is allowed to PATCH — anything else is ignored. */
const EDITABLE_FIELDS = [
  "first_name",
  "last_name",
  "display_name",
  "notes",
  "phone",
  "avatar_ring_color",
  "auto_lock_seconds",
  "login_alerts",
] as const;

function unauthorized() {
  return NextResponse.json(
    { apiVersion: API_VERSION, error: "unauthorized" },
    { status: 401 }
  );
}

export async function GET() {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  const [profile, socialLinks, trustedPersons, sessions] = await Promise.all([
    getProfile(userId),
    listSocialLinks(userId),
    listTrustedPersons(userId),
    listSessions(userId),
  ]);

  if (!profile) {
    return NextResponse.json(
      { apiVersion: API_VERSION, error: "not_found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    apiVersion: API_VERSION,
    data: { profile, socialLinks, trustedPersons, sessions },
  });
}

export async function PATCH(request: Request) {
  const userId = await currentUserId();
  if (!userId) return unauthorized();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { apiVersion: API_VERSION, error: "invalid_json" },
      { status: 400 }
    );
  }

  // Allowlist input — never trust the client to send only safe fields.
  const patch: TablesUpdate<"profiles"> = {};
  for (const key of EDITABLE_FIELDS) {
    if (key in body) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (patch as any)[key] = body[key];
    }
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { apiVersion: API_VERSION, error: "no_editable_fields" },
      { status: 400 }
    );
  }

  try {
    const profile = await updateProfile(userId, patch);
    await writeAudit({
      user_id: userId,
      action: "profile.update",
      resource: "profiles",
      detail: `Updated: ${Object.keys(patch).join(", ")}`,
    });
    return NextResponse.json({ apiVersion: API_VERSION, data: { profile } });
  } catch (err) {
    return NextResponse.json(
      { apiVersion: API_VERSION, error: err instanceof Error ? err.message : "update_failed" },
      { status: 500 }
    );
  }
}
