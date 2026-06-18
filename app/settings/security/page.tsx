"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useSecurity } from "../../lib/useSecurity";
import { useStore, AUTO_LOCK_OPTIONS, autoLockLabel } from "../../lib/store";

export default function SecurityPage() {
  const { source, sessions, auditLog, revokeSession, revokeOthers } = useSecurity();
  const { security, setSecurity } = useStore();
  const [autoLockOpen, setAutoLockOpen] = useState(false);

  const authToggles: { key: "faceId" | "touchId" | "passcodeLock" | "loginAlerts" | "suspiciousActivity"; label: string; desc: string }[] = [
    { key: "faceId", label: "Face ID", desc: "Unlock with Face ID" },
    { key: "touchId", label: "Touch ID", desc: "Unlock with Touch ID" },
    { key: "passcodeLock", label: "Passcode Lock", desc: "Require a passcode to open the app" },
    { key: "loginAlerts", label: "Login Alerts", desc: "Notify on new sign-ins" },
    { key: "suspiciousActivity", label: "Suspicious Activity", desc: "Detect and alert on unusual access" },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Security</h1>
        <span
          className="ml-auto text-[10px] font-medium px-2 py-1 rounded-full"
          style={
            source === "remote"
              ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }
              : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }
          }
        >
          {source === "remote" ? "● Synced" : source === "loading" ? "…" : "Demo"}
        </span>
      </div>

      <div className="px-4 space-y-4">
        {/* Auth methods */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Authentication</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {authToggles.map((item, i) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < authToggles.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button
                  onClick={() => setSecurity({ [item.key]: !security[item.key] })}
                  className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: security[item.key] ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
                  aria-label={item.label}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: security[item.key] ? "calc(100% - 22px)" : "2px", background: security[item.key] ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-lock */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Auto-Lock</p>
          <button
            onClick={() => setAutoLockOpen(true)}
            className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}
          >
            <div className="text-left">
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Lock after</p>
              <p className="text-text-secondary text-xs">Require authentication when idle</p>
            </div>
            <span className="flex items-center gap-1 text-sm" style={{ color: "var(--accent)" }}>
              {autoLockLabel(security)}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
        </div>

        {/* Active sessions */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Active Sessions</p>
            <button onClick={revokeOthers} className="text-accent-red text-xs" style={{ color: "#EF4444" }}>Sign out all</button>
          </div>
          <div className="space-y-2">
            {sessions.length === 0 && (
              <div className="rounded-2xl p-3.5 liquid-glass">
                <p className="text-text-tertiary text-xs">No other active sessions.</p>
              </div>
            )}
            {sessions.map((s) => (
              <div key={s.id} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: s.current ? "1px solid rgba(74,222,128,0.25)" : "0.5px solid var(--glass-border)" }}>
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.current ? "rgba(74,222,128,0.12)" : "rgba(255,255,255,0.07)" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="2" width="14" height="20" rx="2" stroke={s.current ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
                    <circle cx="12" cy="17" r="1" fill={s.current ? "#4ADE80" : "#9CA3AF"} />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{s.device}</p>
                    {s.current && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>This device</span>}
                  </div>
                  <p className="text-text-secondary text-xs">{s.platform} · {s.location}</p>
                  <p className="text-text-tertiary text-[10px]">{s.lastActive}</p>
                </div>
                {!s.current && (
                  <button onClick={() => revokeSession(s.id)} className="text-xs px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Audit log */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Audit Log</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {auditLog.length === 0 && (
              <p className="text-text-tertiary text-xs px-4 py-3.5">No audit entries yet.</p>
            )}
            {auditLog.map((entry, i) => (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < auditLog.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <span className="text-base w-7 text-center flex-shrink-0">{entry.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-tight" style={{ color: "var(--text-1)" }}>{entry.action}</p>
                  <p className="text-text-secondary text-xs">{entry.detail}</p>
                </div>
                <span className="text-text-tertiary text-[10px] flex-shrink-0">{entry.time}</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={revokeOthers} className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}>
          Sign Out All Sessions
        </button>
      </div>

      {/* Auto-lock picker */}
      {autoLockOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setAutoLockOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-3" style={{ color: "var(--text-1)" }}>Auto-Lock</h2>
            <div className="rounded-2xl overflow-hidden mb-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              {AUTO_LOCK_OPTIONS.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => { setSecurity({ autoLock: o.id }); if (o.id !== "custom") setAutoLockOpen(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                  style={{ borderBottom: i < AUTO_LOCK_OPTIONS.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
                >
                  <span className="text-sm" style={{ color: "var(--text-1)" }}>{o.label}</span>
                  {security.autoLock === o.id && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                </button>
              ))}
            </div>
            {security.autoLock === "custom" && (
              <div className="mb-3">
                <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Custom duration (minutes)</label>
                <div className="flex items-center gap-3 rounded-2xl px-4 py-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                  <input
                    type="number"
                    min={1}
                    max={1440}
                    value={security.autoLockCustomMinutes}
                    onChange={(e) => setSecurity({ autoLockCustomMinutes: Math.max(1, Math.min(1440, Number(e.target.value) || 1)) })}
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "var(--text-1)", caretColor: "var(--accent)" }}
                  />
                  <span className="text-text-secondary text-xs">minutes</span>
                </div>
              </div>
            )}
            <button onClick={() => setAutoLockOpen(false)} className="w-full py-3.5 rounded-2xl font-semibold text-base" style={{ background: "var(--accent)", color: "#08111E" }}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}
