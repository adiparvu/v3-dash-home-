"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useStore, ASSISTANT_PERSONALITIES, ASSISTANT_AVATARS } from "../../lib/store";
import { useT, type MessageKey } from "../../lib/i18n";

const MODELS: { id: string; lkey: MessageKey; dkey: MessageKey }[] = [
  { id: "on-device", lkey: "asst.m.onDevice", dkey: "asst.m.onDevice.d" },
  { id: "claude", lkey: "asst.m.claude", dkey: "asst.m.claude.d" },
  { id: "byo", lkey: "asst.m.byo", dkey: "asst.m.byo.d" },
];

const PERSONALITY_KEYS: Record<string, { l: MessageKey; d: MessageKey }> = {
  concise: { l: "asst.p.concise", d: "asst.p.concise.d" },
  friendly: { l: "asst.p.friendly", d: "asst.p.friendly.d" },
  expert: { l: "asst.p.expert", d: "asst.p.expert.d" },
  proactive: { l: "asst.p.proactive", d: "asst.p.proactive.d" },
};

export default function AssistantSettingsPage() {
  const { assistant, setAssistant } = useStore();
  const t = useT();
  const byoReady = Boolean(assistant.byoEndpoint && assistant.byoModelName && assistant.byoApiKey);
  const [saved, setSaved] = useState(false);

  function save() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("set.assistant")}</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Identity preview */}
        <div className="flex flex-col items-center py-3 gap-2">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
            style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.4)", boxShadow: "0 0 24px rgba(124,58,237,0.25)" }}
          >
            {assistant.avatar}
          </div>
          <p className="font-semibold text-lg" style={{ color: "var(--text-1)" }}>{assistant.name || "Your Assistant"}</p>
          <p className="text-text-tertiary text-xs">You own this AI identity and its estate knowledge.</p>
        </div>

        {/* Name */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("asst.name")}</p>
          <div className="rounded-2xl px-4 py-3 liquid-glass">
            <input
              value={assistant.name}
              onChange={(e) => setAssistant({ name: e.target.value })}
              placeholder={t("asst.namePlaceholder")}
              className="w-full bg-transparent text-sm outline-none"
              style={{ caretColor: "var(--accent)", color: "var(--text-1)" }}
            />
          </div>
        </div>

        {/* Avatar */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("asst.avatar")}</p>
          <div className="flex gap-2.5 px-1 flex-wrap">
            {ASSISTANT_AVATARS.map((a) => (
              <button
                key={a}
                onClick={() => setAssistant({ avatar: a })}
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all"
                style={
                  assistant.avatar === a
                    ? { background: "rgba(124,58,237,0.18)", border: "1px solid rgba(124,58,237,0.45)", transform: "scale(1.08)" }
                    : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }
                }
              >
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Personality */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("asst.personality")}</p>
          <div className="grid grid-cols-2 gap-2">
            {ASSISTANT_PERSONALITIES.map((p) => (
              <button
                key={p.id}
                onClick={() => setAssistant({ personality: p.id })}
                className="text-left rounded-2xl px-4 py-3 transition-all"
                style={
                  assistant.personality === p.id
                    ? { background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.40)" }
                    : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }
                }
              >
                <p className="text-sm font-medium" style={{ color: assistant.personality === p.id ? "var(--accent-purple)" : "var(--text-1)" }}>{PERSONALITY_KEYS[p.id] ? t(PERSONALITY_KEYS[p.id].l) : p.label}</p>
                <p className="text-text-secondary text-[11px]">{PERSONALITY_KEYS[p.id] ? t(PERSONALITY_KEYS[p.id].d) : p.blurb}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Model — bring your own */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("asst.model")}</p>
          <div className="rounded-2xl overflow-hidden liquid-glass">
            {MODELS.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setAssistant({ model: m.id })}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                style={{ borderBottom: i < MODELS.length - 1 ? "1px solid var(--glass-border)" : undefined }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(m.lkey)}</p>
                  <p className="text-text-secondary text-xs">{t(m.dkey)}</p>
                </div>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={assistant.model === m.id ? { background: "var(--accent)" } : { border: "1.5px solid var(--glass-border)" }}
                >
                  {assistant.model === m.id && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </span>
              </button>
            ))}
          </div>
          <p className="text-text-tertiary text-[11px] px-1 mt-2">
            {t("asst.byoNote")}
          </p>

          {assistant.model === "byo" && (
            <div className="rounded-2xl p-4 mt-3 liquid-glass space-y-3">
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1.5 block">{t("asst.endpoint")}</label>
                <input
                  value={assistant.byoEndpoint ?? ""}
                  onChange={(e) => setAssistant({ byoEndpoint: e.target.value })}
                  placeholder="https://api.your-provider.com/v1/chat/completions"
                  className="w-full rounded-xl px-3 py-2.5 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}
                />
              </div>
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1.5 block">{t("asst.modelName")}</label>
                <input
                  value={assistant.byoModelName ?? ""}
                  onChange={(e) => setAssistant({ byoModelName: e.target.value })}
                  placeholder="e.g. gpt-4o, llama-3.1-70b"
                  className="w-full rounded-xl px-3 py-2.5 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}
                />
              </div>
              <div>
                <label className="text-text-secondary text-xs font-medium mb-1.5 block">{t("asst.apiKey")}</label>
                <input
                  type="password"
                  value={assistant.byoApiKey ?? ""}
                  onChange={(e) => setAssistant({ byoApiKey: e.target.value })}
                  placeholder="sk-…"
                  className="w-full rounded-xl px-3 py-2.5 text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}
                />
              </div>
              <p className="text-[11px] flex items-center gap-1.5" style={{ color: byoReady ? "#4ADE80" : "var(--text-3)" }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: byoReady ? "#4ADE80" : "#9CA3AF", display: "inline-block" }} />
                {byoReady ? t("asst.byoReady") : t("asst.byoIncomplete")}
              </p>
            </div>
          )}
        </div>

        {/* Voice */}
        <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between liquid-glass">
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("asst.voice")}</p>
            <p className="text-text-secondary text-xs">{t("asst.voice.d")}</p>
          </div>
          <button
            onClick={() => setAssistant({ voiceEnabled: !assistant.voiceEnabled })}
            aria-label={t("asst.toggleVoice")}
            className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
            style={{ background: assistant.voiceEnabled ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
          >
            <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: assistant.voiceEnabled ? "calc(100% - 22px)" : "2px", background: assistant.voiceEnabled ? "#050A14" : "rgba(255,255,255,0.5)" }} />
          </button>
        </div>

        <button
          onClick={save}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all"
          style={{
            background: saved ? "rgba(74,222,128,0.2)" : "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)",
            color: saved ? "#4ADE80" : "#050A14",
            border: saved ? "1px solid rgba(74,222,128,0.4)" : undefined,
          }}
        >
          {saved ? t("asst.saved") : t("asst.save")}
        </button>
      </div>
    </div>
  );
}
