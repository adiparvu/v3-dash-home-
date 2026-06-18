"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useSecurity } from "../../lib/useSecurity";

export default function SecurityPage() {
  const { source, sessions, auditLog, revokeSession, revokeOthers } = useSecurity();
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);

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
            {[
              { label: "Face ID", desc: "Unlock with Face ID", enabled: faceIdEnabled, onToggle: () => setFaceIdEnabled(!faceIdEnabled) },
              { label: "Login Alerts", desc: "Notify on new sign-ins", enabled: loginAlerts, onToggle: () => setLoginAlerts(!loginAlerts) },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button
                  onClick={item.onToggle}
                  className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: item.enabled ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: item.enabled ? "calc(100% - 22px)" : "2px", background: item.enabled ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
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
    </div>
  );
}
