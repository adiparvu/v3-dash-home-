// =============================================================================
// Edge Function: push-notify
// =============================================================================
// Delivers a Web Push notification to every device a user has registered. Reads
// push_subscriptions with the service-role key, signs + encrypts each payload
// with VAPID, and prunes subscriptions the push service reports as gone
// (404/410). Intended to be invoked by the backend (e.g. from a DB trigger via
// pg_net, or another function) — verify_jwt is enabled so it is never
// anonymously invocable.
//
// Required secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
//   VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT (e.g. mailto:ops@prvio.app)
//
// Body: { user_id: string, title: string, body?: string, url?: string, tag?: string }
// =============================================================================
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import webpush from "npm:web-push@3.6.7";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") ?? "";
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") ?? "";
const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT") ?? "mailto:ops@prvio.app";

Deno.serve(async (req: Request) => {
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return new Response(JSON.stringify({ error: "vapid_unconfigured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  let body: { user_id?: string; title?: string; body?: string; url?: string; tag?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "invalid_json" }), { status: 400 });
  }
  if (!body.user_id || !body.title) {
    return new Response(JSON.stringify({ error: "missing_fields" }), { status: 400 });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  const { data: subs, error } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", body.user_id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  const payload = JSON.stringify({
    title: body.title,
    body: body.body ?? "",
    url: body.url ?? "/notifications",
    tag: body.tag,
  });

  let sent = 0;
  let pruned = 0;
  await Promise.all(
    (subs ?? []).map(async (s) => {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        );
        sent++;
      } catch (err) {
        const code = (err as { statusCode?: number })?.statusCode;
        if (code === 404 || code === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
          pruned++;
        }
      }
    }),
  );

  return new Response(JSON.stringify({ ok: true, sent, pruned }), {
    headers: { "Content-Type": "application/json" },
  });
});
