/**
 * POST /api/v1/profile/social-links — add a social link to the current profile.
 * URI-versioned; RLS-scoped to the authenticated user.
 */
import { NextResponse } from "next/server";
import { currentUserId, addSocialLink, writeAudit } from "@/lib/data/profile";
import type { SocialPlatform } from "@/lib/types/database.types";

export const dynamic = "force-dynamic";

const API_VERSION = "1.0.0";

const PLATFORMS: SocialPlatform[] = [
  "facebook", "instagram", "x", "threads", "linkedin",
  "tiktok", "youtube", "telegram", "whatsapp", "custom",
];

export async function POST(request: Request) {
  const userId = await currentUserId();
  if (!userId) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "unauthorized" }, { status: 401 });
  }

  let body: { platform?: string; url?: string; label?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_json" }, { status: 400 });
  }

  const platform = body.platform as SocialPlatform;
  if (!body.url?.trim() || !PLATFORMS.includes(platform)) {
    return NextResponse.json({ apiVersion: API_VERSION, error: "invalid_input" }, { status: 400 });
  }

  try {
    const link = await addSocialLink({
      profile_id: userId,
      platform,
      url: body.url.trim(),
      label: body.label?.trim() || null,
    });
    await writeAudit({ user_id: userId, action: "profile.social_link.add", resource: "profile_social_links", detail: platform });
    return NextResponse.json({ apiVersion: API_VERSION, data: { link } }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ apiVersion: API_VERSION, error: err instanceof Error ? err.message : "failed" }, { status: 500 });
  }
}
