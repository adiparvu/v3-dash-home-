/**
 * OAuth / magic-link callback. Exchanges the auth code for a session and then
 * redirects to the originally requested page (or the dashboard).
 */
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { isSupabaseConfigured } from "../../../lib/supabase/middleware";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") ?? "/";

  if (code && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${redirect}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
