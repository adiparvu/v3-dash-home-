"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function LoginInner() {
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function sendMagicLink() {
    if (!email.trim()) return;
    if (!supabaseConfigured) {
      setStatus("error");
      setMessage("Supabase isn't configured yet. Add env vars to enable sign-in.");
      return;
    }
    setStatus("sending");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}` },
      });
      if (error) throw error;
      setStatus("sent");
      setMessage(`We sent a sign-in link to ${email.trim()}.`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Could not send the link.");
    }
  }

  async function oauth(provider: "google" | "apple") {
    if (!supabaseConfigured) {
      setStatus("error");
      setMessage("Supabase isn't configured yet. Add env vars to enable sign-in.");
      return;
    }
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}` },
    });
  }

  return (
    <div className="min-h-screen flex flex-col justify-center px-6 pb-16" style={{ color: "var(--text-1)" }}>
      {/* Brand */}
      <div className="flex flex-col items-center mb-8">
        <div
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl mb-4"
          style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 28px rgba(74,222,128,0.35)" }}
        >
          🌍
        </div>
        <h1 className="font-bold text-2xl">PRVIO EARTH</h1>
        <p className="text-text-secondary text-sm mt-1">Private Estate Operating System</p>
      </div>

      {!supabaseConfigured && (
        <div className="rounded-2xl px-4 py-3 mb-4 text-xs" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.30)", color: "#F59E0B" }}>
          Demo mode — Supabase isn’t configured. Sign-in activates once
          <span className="font-medium"> NEXT_PUBLIC_SUPABASE_URL</span> and the anon key are set.
        </div>
      )}

      {/* Email magic link */}
      <div className="rounded-2xl px-4 py-3 liquid-glass mb-3">
        <p className="text-text-secondary text-[10px] mb-1 uppercase tracking-wide">Email</p>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full bg-transparent text-sm outline-none"
          style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
          onKeyDown={(e) => { if (e.key === "Enter") sendMagicLink(); }}
        />
      </div>

      <button
        onClick={sendMagicLink}
        disabled={!email.trim() || status === "sending"}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all mb-3"
        style={email.trim() ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
      >
        {status === "sending" ? "Sending…" : status === "sent" ? "✓ Link sent" : "Send sign-in link"}
      </button>

      {message && (
        <p className="text-center text-xs mb-3" style={{ color: status === "error" ? "#EF4444" : "var(--accent)" }}>{message}</p>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3 my-3">
        <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
        <span className="text-text-tertiary text-[11px]">or continue with</span>
        <div className="flex-1 h-px" style={{ background: "var(--glass-border)" }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => oauth("apple")} className="py-3 rounded-2xl text-sm font-medium liquid-glass" style={{ color: "var(--text-1)" }}> Apple</button>
        <button onClick={() => oauth("google")} className="py-3 rounded-2xl text-sm font-medium liquid-glass" style={{ color: "var(--text-1)" }}>G Google</button>
      </div>

      <p className="text-text-tertiary text-center text-[11px] mt-8">
        By continuing you agree to PRVIO Earth’s privacy-by-design data handling.
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <LoginInner />
    </Suspense>
  );
}
