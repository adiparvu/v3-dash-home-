/** Sign the current user out and return to the login screen. */
import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { isSupabaseConfigured } from "../../../lib/supabase/middleware";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const { origin } = new URL(request.url);
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(`${origin}/login`, { status: 303 });
}
