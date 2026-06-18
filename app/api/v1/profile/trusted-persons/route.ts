/**
 * POST /api/v1/profile/trusted-persons — assign a trusted person.
 * URI-versioned; RLS-scoped to the authenticated user.
 */
import { NextResponse } from "next/server";
import { currentUserId, addTrustedPerson, writeAudit } from "@/lib/data/profile";
import type { TrustedPermission } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const PERMISSIONS: TrustedPermission[] = [
  "emergency_access", "ownership_transfer", "recovery_approvals", "estate_continuity",
];

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let body: { name?: string; relationship?: string; email?: string; permissions?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "name_required" }, { status: 400 });
  }

  // Allowlist permissions against the enum.
  const permissions = (body.permissions ?? []).filter(
    (p): p is TrustedPermission => PERMISSIONS.includes(p as TrustedPermission)
  );

  try {
    const person = await addTrustedPerson({
      profile_id: userId,
      name: body.name.trim(),
      relationship: body.relationship?.trim() || null,
      email: body.email?.trim() || null,
      permissions,
    });
    await writeAudit({ user_id: userId, action: "profile.trusted_person.add", resource: "trusted_persons", detail: person.name });
    return NextResponse.json({ apiVersion: API_VERSION, data: { person } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
