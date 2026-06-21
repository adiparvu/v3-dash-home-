"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useStore, PRIVACY_REQUEST_TYPES, PrivacyRequestType, PrivacyRequest } from "../../lib/store";

/** Documented retention schedule shown to users (spec: "Display retention schedules"). */
const RETENTION_SCHEDULE: { category: string; period: string }[] = [
  { category: "Account & profile", period: "Until account deletion" },
  { category: "Estate & asset records", period: "Until deleted by owner" },
  { category: "Communications & chat", period: "24 months, then purged" },
  { category: "Audit logs", period: "7 years (compliance)" },
  { category: "Analytics events", period: "14 months" },
  { category: "Ownership-transfer records", period: "Retained (legally required)" },
];

const CONSENTS: { key: "analytics" | "crashReports" | "personalization" | "marketing" | "aiProcessing"; label: string; desc: string }[] = [
  { key: "analytics", label: "Analytics", desc: "Help improve the app with usage data" },
  { key: "crashReports", label: "Crash Reports", desc: "Automatically report crashes" },
  { key: "personalization", label: "Personalization", desc: "Tailor the experience to your estate" },
  { key: "aiProcessing", label: "AI Processing", desc: "Allow the assistant to use your estate knowledge" },
  { key: "marketing", label: "Marketing", desc: "Product news and announcements" },
];

const STATUS_META: Record<PrivacyRequest["status"], { label: string; color: string }> = {
  submitted: { label: "Submitted", color: "#22D3EE" },
  in_review: { label: "In review", color: "#F59E0B" },
  completed: { label: "Completed", color: "#4ADE80" },
};

export default function PrivacyPage() {
  const { consents, setConsent, privacyRequests, addPrivacyRequest, removePrivacyRequest } = useStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exported, setExported] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [reqType, setReqType] = useState<PrivacyRequestType>("access");
  const [reqReg, setReqReg] = useState<PrivacyRequest["regulation"]>("GDPR");

  const collectData = () => {
    const data: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("prvio")) {
        try { data[k] = JSON.parse(localStorage.getItem(k) || "null"); }
        catch { data[k] = localStorage.getItem(k); }
      }
    }
    return data;
  };

  // Map the client consent keys to the backend's snake_case enum.
  const CONSENT_KEY_MAP: Record<string, string> = {
    analytics: "analytics", crashReports: "crash_reports", personalization: "personalization",
    marketing: "marketing", aiProcessing: "ai_processing",
  };

  const syncConsent = (key: string, granted: boolean) => {
    const mapped = CONSENT_KEY_MAP[key];
    if (!mapped) return;
    fetch("/api/v1/privacy/consents", {
      method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ key: mapped, granted }),
    }).catch(() => {});
  };

  const downloadJSON = (text: string) => {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prvio-earth-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  // Prefer the server-side, machine-readable export; fall back to local data.
  const exportData = async () => {
    try {
      const res = await fetch("/api/v1/privacy/export", { credentials: "include" });
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.export) { downloadJSON(JSON.stringify(json.data.export, null, 2)); return; }
      }
    } catch { /* fall back */ }
    downloadJSON(JSON.stringify({ exportedAt: new Date().toISOString(), app: "PRVIO Earth", format: "machine-readable", data: collectData() }, null, 2));
  };

  const deleteAllData = () => {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith("prvio")) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
    window.location.href = "/";
  };

  const submitRequest = () => {
    // Portability is fulfilled instantly via local export; others are tracked.
    if (reqType === "portability") void exportData();
    addPrivacyRequest(reqType, reqReg);
    // Best-effort: persist the request server-side (immutable, audited).
    const TYPE_MAP: Record<string, string> = {
      access: "access", portability: "export", erasure: "erasure",
      rectification: "rectification", restriction: "restriction", objection: "objection", deletion: "erasure",
    };
    fetch("/api/v1/privacy/requests", {
      method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ type: TYPE_MAP[reqType] ?? "access", regulation: String(reqReg).toLowerCase() }),
    }).catch(() => {});
    setRequestOpen(false);
  };

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Privacy & Data</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Data ownership */}
        <div className="rounded-3xl p-4" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.20)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛡️</span>
            <p className="text-white font-semibold text-sm">You own your data</p>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            All your estate data, documents, communications, and AI knowledge bases remain your property at all times. PRVIO Earth never sells your data to third parties, and AI systems never claim ownership of your content.
          </p>
        </div>

        {/* Consent management */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Consent Management</p>
            <span className="text-text-tertiary text-[10px]">Updated {new Date(consents.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {CONSENTS.map((item, i) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < CONSENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div className="pr-3">
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button onClick={() => { const v = !consents[item.key]; setConsent(item.key, v); syncConsent(item.key, v); }} aria-label={item.label} className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0" style={{ background: consents[item.key] ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: consents[item.key] ? "calc(100% - 22px)" : "2px", background: consents[item.key] ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-[11px] mt-1.5 px-1">You can withdraw consent at any time. Changes are recorded with a timestamp.</p>
        </div>

        {/* Data subject rights */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Your Rights (GDPR / CCPA)</p>
            <button onClick={() => setRequestOpen(true)} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>New request</button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={exportData} className="w-full flex items-center justify-between px-4 py-3.5 text-left" style={{ borderBottom: "0.5px solid var(--glass-border)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Download My Data</p>
                <p className="text-text-secondary text-xs">Structured, machine-readable export (JSON)</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>{exported ? "Saved ✓" : "Export"}</span>
            </button>
            <Link href="/settings/profile" className="w-full flex items-center justify-between px-4 py-3.5 text-left">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Correct My Information</p>
                <p className="text-text-secondary text-xs">Update or rectify your profile data</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>Edit</span>
            </Link>
          </div>
        </div>

        {/* Tracked requests */}
        {privacyRequests.length > 0 && (
          <div>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Request History</p>
            <div className="space-y-2">
              {privacyRequests.map((r) => {
                const meta = PRIVACY_REQUEST_TYPES.find((t) => t.id === r.type);
                const sm = STATUS_META[r.status];
                return (
                  <div key={r.id} className="rounded-2xl p-3.5 flex items-center gap-3 liquid-glass">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{meta?.label ?? r.type}</p>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "var(--glass-bg)", color: "var(--text-3)" }}>{r.regulation}</span>
                      </div>
                      <p className="text-text-tertiary text-[10px]">Submitted {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sm.color}1a`, color: sm.color }}>{sm.label}</span>
                    <button onClick={() => removePrivacyRequest(r.id)} aria-label="Withdraw request" style={{ color: "var(--text-3)" }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Retention schedule */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Data Retention Schedule</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {RETENTION_SCHEDULE.map((row, i) => (
              <div key={row.category} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < RETENTION_SCHEDULE.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <p className="text-sm" style={{ color: "var(--text-1)" }}>{row.category}</p>
                <p className="text-text-secondary text-xs text-right">{row.period}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Danger Zone</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(239,68,68,0.10)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Delete All Data</p>
                <p className="text-text-secondary text-xs">Permanently erase all estate data</p>
              </div>
              <button onClick={() => setConfirmDelete(true)} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>Delete</button>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Delete Account</p>
                <p className="text-text-secondary text-xs">Close account · subject to legal requirements</p>
              </div>
              <button onClick={() => { setReqType("erasure"); setRequestOpen(true); }} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>Close</button>
            </div>
          </div>
        </div>

        <p className="text-text-tertiary text-xs text-center pb-4">Compliant with GDPR · CCPA · Privacy by Design</p>
      </div>

      {/* New request sheet */}
      {requestOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setRequestOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>New Privacy Request</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>Submit a verified data-subject request. We respond within statutory timelines.</p>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Regulation</label>
            <div className="flex gap-2 mb-4">
              {(["GDPR", "CCPA"] as const).map((r) => (
                <button key={r} onClick={() => setReqReg(r)} className="flex-1 py-2 rounded-xl text-sm font-medium transition-all" style={reqReg === r ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>{r}</button>
              ))}
            </div>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Request type</label>
            <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              {PRIVACY_REQUEST_TYPES.map((t, i) => (
                <button key={t.id} onClick={() => setReqType(t.id)} className="w-full flex items-center justify-between px-4 py-3 text-left" style={{ borderBottom: i < PRIVACY_REQUEST_TYPES.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}>
                  <div className="pr-3">
                    <p className="text-sm" style={{ color: "var(--text-1)" }}>{t.label}</p>
                    <p className="text-text-secondary text-xs">{t.desc}</p>
                  </div>
                  {reqType === t.id && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
              ))}
            </div>

            <button onClick={submitRequest} className="w-full py-3.5 rounded-2xl font-semibold text-base active:scale-[0.97] transition-transform" style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)", color: "#08111E" }}>Submit Request</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setConfirmDelete(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>Delete all data?</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>This erases your estate name, zones, assets, tasks, automations and settings from this device. This cannot be undone.</p>
            <button onClick={deleteAllData} className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 active:scale-[0.97] transition-transform" style={{ background: "#EF4444", color: "#fff" }}>Delete Everything</button>
            <button onClick={() => setConfirmDelete(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
