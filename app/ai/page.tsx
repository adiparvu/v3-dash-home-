"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useStore } from "../lib/store";
import { retrieve, retrieveRemote, OWNER_SCOPES, RetrievedChunk } from "../lib/ai/retrieval";
import { classifyAndGuard, validateOutput, classificationMeta, GuardrailDecision } from "../lib/ai/guardrails";

const suggestions = [
  "What's the health status of my forest zone?",
  "When should I harvest the orchard?",
  "Is my greenhouse CO₂ level safe?",
  "How many zones and assets do I have?",
];

type MsgMeta = {
  classification: GuardrailDecision["classification"];
  sources: { title: string; scope: string }[];
  requiresApproval?: boolean;
  retrieval?: "backend" | "on-device";
};

type Msg = { id: number; role: "user" | "assistant"; content: string; meta?: MsgMeta };

const initial: Msg[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Hello! I'm your PRVIO Earth AI Assistant. I have authorized, read-only access to your estate knowledge — zones, sensors, tasks and history. Every answer is retrieval-grounded and policy-checked. How can I help?",
  },
];

export default function AIPage() {
  const { estateName, addedZones, addedAssets, assistant, logAiDecision, aiAuditLog } = useStore();
  const [input, setInput] = useState("");
  const [chat, setChat] = useState<Msg[]>(initial);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const totalZones = 26 + addedZones.length;
  const totalAssets = 140 + addedAssets.length;

  /** Compose a grounded answer from retrieved chunks (provenance-first). */
  const compose = (raw: string, chunks: RetrievedChunk[]): string => {
    const q = raw.toLowerCase();
    if (/\b(hi|hello|hey)\b/.test(q)) return `Hi! Everything at ${estateName} is running smoothly. Ask me about any zone, your tasks, or maintenance.`;
    if (q.includes("thank")) return "Anytime! I'm always monitoring your estate in the background. 🌿";

    if (chunks.length === 0) {
      return `I can help with zones, assets, tasks, maintenance and alerts for ${estateName}. Try asking about a specific zone (e.g. "greenhouse"), your tasks, or "estate overview".`;
    }
    // Stitch the top chunks; augment counts with live store data where relevant.
    const parts = chunks.map((c) => {
      if (c.id === "kb-zones-count") return `You have ${totalZones} zones across the estate${addedZones.length ? ` (${addedZones.length} you added)` : ""}. Overall estate health is 87/100 — Very Good.`;
      if (c.id === "kb-assets") return `Inventory holds ${totalAssets} assets${addedAssets.length ? ` (${addedAssets.length} added by you)` : ""}: 118 active, 7 in maintenance, 3 offline.`;
      return c.content;
    });
    return parts.join("\n\n");
  };

  const pushAssistant = (content: string, meta?: MsgMeta) =>
    setChat((prev) => [...prev, { id: Date.now() + Math.random(), role: "assistant", content, meta }]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChat((prev) => [...prev, { id: Date.now(), role: "user", content: trimmed }]);
    setInput("");
    setTyping(true);

    // 1) Guardrails: every prompt is untrusted and classified before anything else.
    const decision = classifyAndGuard(trimmed);

    setTimeout(() => {
      if (!decision.allowed && decision.classification !== "high_risk_action") {
        // Injection / policy probe → refuse and log, retrieve nothing.
        logAiDecision({ prompt: trimmed.slice(0, 120), classification: decision.classification, risk: decision.risk, allowed: false, scopes: [] });
        pushAssistant(
          "I can't help with that. That request conflicts with my safety policy — I won't reveal internal instructions or secrets, follow override attempts, or bypass authorization. This attempt has been logged.",
          { classification: decision.classification, sources: [] }
        );
        setTyping(false);
        return;
      }

      if (decision.classification === "high_risk_action") {
        // Deny by default; surface a human-approval path instead of acting.
        logAiDecision({ prompt: trimmed.slice(0, 120), classification: decision.classification, risk: decision.risk, allowed: false, scopes: [] });
        pushAssistant(
          "That's a high-risk action (ownership, security, financial or destructive). I can't perform it directly — it requires multi-step confirmation and your explicit approval through a secure workflow.",
          { classification: decision.classification, sources: [], requiresApproval: true }
        );
        setTyping(false);
        return;
      }

      // 2) Authorized retrieval — prefer the backend pgvector store, fall back
      //    to the on-device retriever when the backend is unavailable.
      (async () => {
        const remote = await retrieveRemote(decision.sanitizedInput, OWNER_SCOPES);
        const chunks = remote ?? retrieve(decision.sanitizedInput, OWNER_SCOPES, 3);
        const { text } = validateOutput(compose(trimmed, chunks));
        const sources = chunks.map((c) => ({ title: c.title, scope: c.scope }));
        logAiDecision({ prompt: trimmed.slice(0, 120), classification: decision.classification, risk: decision.risk, allowed: true, scopes: sources.map((s) => s.scope) });
        pushAssistant(text, { classification: decision.classification, sources, retrieval: remote ? "backend" : "on-device" });
        setTyping(false);
      })();
    }, 650);
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat, typing]);

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))",
              border: "1px solid rgba(124,58,237,0.4)",
              boxShadow: "0 0 20px rgba(124,58,237,0.2)",
            }}
          >
            <span className="text-base">{assistant.avatar}</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight" style={{ color: "var(--text-1)" }}>{assistant.name}</h1>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--accent)" }} />
              <span className="text-[10px]" style={{ color: "var(--accent)" }}>
                {(() => {
                  const m = assistant.model;
                  const label = m === "byo" ? (assistant.byoModelName || "Custom model") : m === "claude" ? "Claude" : "On-device";
                  const byoReady = m !== "byo" || Boolean(assistant.byoEndpoint && assistant.byoModelName && assistant.byoApiKey);
                  return `via ${label}${byoReady ? "" : " · setup needed"} · guardrails on`;
                })()}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/settings/ai-guardrails"
            aria-label="AI guardrails"
            className="w-9 h-9 rounded-2xl flex items-center justify-center relative"
            style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /></svg>
            {aiAuditLog.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center" style={{ background: "var(--accent)", color: "#050A14" }}>{aiAuditLog.length}</span>
            )}
          </Link>
          <button
            onClick={() => setChat(initial)}
            aria-label="New chat"
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
        {chat.map((msg) => {
          const meta = msg.meta;
          const badge = meta && meta.classification !== "estate_query" ? classificationMeta(meta.classification) : null;
          return (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>
                  {assistant.avatar}
                </div>
              )}
              <div
                className="max-w-[80%] rounded-2xl px-4 py-3"
                style={
                  msg.role === "user"
                    ? { background: "linear-gradient(135deg, #7C3AED, #4F46E5)", borderBottomRightRadius: 6, color: "#fff" }
                    : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", borderBottomLeftRadius: 6, color: "var(--text-1)" }
                }
              >
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>

                {badge && (
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${badge.color}1a`, color: badge.color }}>
                    🛡 {badge.label}
                  </span>
                )}

                {meta?.requiresApproval && (
                  <Link href="/properties/transfer" className="block mt-2 text-center text-xs font-medium px-3 py-2 rounded-xl" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.3)", color: "#F59E0B" }}>
                    Open secure workflow →
                  </Link>
                )}

                {meta && meta.sources.length > 0 && (
                  <div className="mt-2 pt-2 flex flex-wrap items-center gap-1.5" style={{ borderTop: "0.5px solid var(--glass-border)" }}>
                    <span className="text-[10px]" style={{ color: "var(--text-3)" }}>Sources:</span>
                    {meta.sources.map((s, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "rgba(34,211,238,0.10)", color: "#22D3EE" }}>{s.title}</span>
                    ))}
                    {meta.retrieval && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "var(--glass-bg)", color: "var(--text-3)" }}>
                        {meta.retrieval === "backend" ? "● backend store" : "on-device"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-xl flex items-center justify-center text-sm mr-2 mt-auto flex-shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(34,211,238,0.3))", border: "1px solid rgba(124,58,237,0.3)" }}>{assistant.avatar}</div>
            <div className="rounded-2xl px-4 py-3.5 flex items-center gap-1" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", borderBottomLeftRadius: 6 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: "var(--text-3)", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {chat.length <= 1 && !typing && (
          <div className="space-y-2 mt-4">
            <p className="text-xs px-1" style={{ color: "var(--text-2)" }}>Suggested questions</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full text-left rounded-2xl px-4 py-3 text-sm active:scale-[0.98] transition-transform liquid-glass"
                style={{ color: "var(--text-1)" }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 pb-28 pt-2 flex-shrink-0">
        <div className="rounded-2xl flex items-end gap-2 p-2" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your estate..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none resize-none px-2 py-1.5"
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            style={{ maxHeight: 100, color: "var(--text-1)", caretColor: "var(--accent)" }}
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
            style={input.trim() ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 12px rgba(74,222,128,0.3)" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke={input.trim() ? "#050A14" : "var(--text-3)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
