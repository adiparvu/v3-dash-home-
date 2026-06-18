"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useStore } from "../../lib/store";
import { AI_POLICY, ALLOWLISTED_TOOLS, classificationMeta, Classification } from "../../lib/ai/guardrails";

export default function AIGuardrailsPage() {
  const { aiAuditLog } = useStore();

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>AI Guardrails</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Intro */}
        <div className="rounded-3xl p-4" style={{ background: "rgba(124,58,237,0.07)", border: "1px solid rgba(124,58,237,0.20)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛡️</span>
            <p className="text-white font-semibold text-sm">Deny-by-default AI safety</p>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            Every prompt is treated as untrusted, classified for prompt-injection and
            policy probes, and answered only from data you are authorized to access.
            High-risk actions require multi-step confirmation and human approval. All
            decisions are audited.
          </p>
        </div>

        {/* Allowlisted tools */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Allowlisted Tools (deny by default)</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {ALLOWLISTED_TOOLS.map((t, i) => (
              <div key={t.id} className="px-4 py-3" style={{ borderBottom: i < ALLOWLISTED_TOOLS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t.label}</p>
                  {t.requiresApproval ? (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>Approval</span>
                  ) : (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>Auto</span>
                  )}
                </div>
                <p className="text-text-tertiary text-[11px] mt-0.5"><code>{t.id}</code> · scopes: {t.scopes.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy: Must */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">AI Must</p>
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(74,222,128,0.05)", border: "1px solid rgba(74,222,128,0.15)" }}>
            {AI_POLICY.must.map((line) => (
              <div key={line} className="flex gap-2">
                <span className="text-[#4ADE80] text-xs mt-0.5">✓</span>
                <p className="text-text-secondary text-xs leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy: Must Never */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">AI Must Never</p>
          <div className="rounded-2xl p-4 space-y-2" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            {AI_POLICY.mustNever.map((line) => (
              <div key={line} className="flex gap-2">
                <span className="text-[#EF4444] text-xs mt-0.5">✕</span>
                <p className="text-text-secondary text-xs leading-relaxed">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">AI Decision Audit ({aiAuditLog.length})</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {aiAuditLog.length === 0 && (
              <p className="text-text-tertiary text-xs px-4 py-3.5">No AI interactions yet. Decisions appear here once you chat with the assistant.</p>
            )}
            {aiAuditLog.map((e, i) => {
              const m = classificationMeta(e.classification as Classification);
              return (
                <div key={e.id} className="px-4 py-3" style={{ borderBottom: i < aiAuditLog.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm leading-tight flex-1 min-w-0 truncate" style={{ color: "var(--text-1)" }}>“{e.prompt}”</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${m.color}1a`, color: m.color }}>{m.label}</span>
                  </div>
                  <p className="text-text-tertiary text-[10px] mt-0.5">
                    {new Date(e.at).toLocaleString()} · {e.allowed ? "allowed" : "blocked"}
                    {e.scopes.length > 0 ? ` · scopes: ${e.scopes.join(", ")}` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-text-tertiary text-xs text-center pb-4">Zero-trust · least privilege · auditable AI behavior</p>
      </div>
    </div>
  );
}
