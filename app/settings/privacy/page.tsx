"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useStore, PRIVACY_REQUEST_TYPES, PrivacyRequestType, PrivacyRequest } from "../../lib/store";
import { useT, type MessageKey } from "../../lib/i18n";

/** Documented retention schedule shown to users (spec: "Display retention schedules"). */
const RETENTION_SCHEDULE: { ckey: MessageKey; pkey: MessageKey }[] = [
  { ckey: "priv.r.account", pkey: "priv.r.account.p" },
  { ckey: "priv.r.estate", pkey: "priv.r.estate.p" },
  { ckey: "priv.r.comms", pkey: "priv.r.comms.p" },
  { ckey: "priv.r.audit", pkey: "priv.r.audit.p" },
  { ckey: "priv.r.analytics", pkey: "priv.r.analytics.p" },
  { ckey: "priv.r.transfer", pkey: "priv.r.transfer.p" },
];

const CONSENTS: { key: "analytics" | "crashReports" | "personalization" | "marketing" | "aiProcessing"; lkey: MessageKey; dkey: MessageKey }[] = [
  { key: "analytics", lkey: "priv.c.analytics", dkey: "priv.c.analytics.d" },
  { key: "crashReports", lkey: "priv.c.crashReports", dkey: "priv.c.crashReports.d" },
  { key: "personalization", lkey: "priv.c.personalization", dkey: "priv.c.personalization.d" },
  { key: "aiProcessing", lkey: "priv.c.aiProcessing", dkey: "priv.c.aiProcessing.d" },
  { key: "marketing", lkey: "priv.c.marketing", dkey: "priv.c.marketing.d" },
];

const STATUS_META: Record<PrivacyRequest["status"], { lkey: MessageKey; color: string }> = {
  submitted: { lkey: "priv.st.submitted", color: "#22D3EE" },
  in_review: { lkey: "priv.st.inReview", color: "#F59E0B" },
  completed: { lkey: "priv.st.completed", color: "#4ADE80" },
};

const REQ_TYPE_KEYS: Record<string, { l: MessageKey; d: MessageKey }> = {
  access: { l: "priv.t.access", d: "priv.t.access.d" },
  portability: { l: "priv.t.portability", d: "priv.t.portability.d" },
  rectification: { l: "priv.t.rectification", d: "priv.t.rectification.d" },
  erasure: { l: "priv.t.erasure", d: "priv.t.erasure.d" },
  restriction: { l: "priv.t.restriction", d: "priv.t.restriction.d" },
  objection: { l: "priv.t.objection", d: "priv.t.objection.d" },
};

export default function PrivacyPage() {
  const { consents, setConsent, privacyRequests, addPrivacyRequest, removePrivacyRequest } = useStore();
  const t = useT();
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

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), app: "PRVIO Earth", format: "machine-readable", data: collectData() }, null, 2)], { type: "application/json" });
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
    if (reqType === "portability") exportData();
    addPrivacyRequest(reqType, reqReg);
    setRequestOpen(false);
  };

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("set.privacy")}</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Data ownership */}
        <div className="rounded-3xl p-4" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.20)" }}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">🛡️</span>
            <p className="text-white font-semibold text-sm">{t("priv.youOwn")}</p>
          </div>
          <p className="text-text-secondary text-xs leading-relaxed">
            {t("priv.ownershipNote")}
          </p>
        </div>

        {/* Consent management */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("priv.consentMgmt")}</p>
            <span className="text-text-tertiary text-[10px]">{t("priv.updated")} {new Date(consents.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {CONSENTS.map((item, i) => (
              <div key={item.key} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i < CONSENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <div className="pr-3">
                  <p className="text-white text-sm font-medium">{t(item.lkey)}</p>
                  <p className="text-text-secondary text-xs">{t(item.dkey)}</p>
                </div>
                <button onClick={() => setConsent(item.key, !consents[item.key])} aria-label={t(item.lkey)} className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0" style={{ background: consents[item.key] ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: consents[item.key] ? "calc(100% - 22px)" : "2px", background: consents[item.key] ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
          <p className="text-text-tertiary text-[11px] mt-1.5 px-1">{t("priv.withdrawNote")}</p>
        </div>

        {/* Data subject rights */}
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("priv.yourRights")}</p>
            <button onClick={() => setRequestOpen(true)} className="text-xs px-3 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>{t("priv.newRequest")}</button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <button onClick={exportData} className="w-full flex items-center justify-between px-4 py-3.5 text-left" style={{ borderBottom: "0.5px solid var(--glass-border)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("priv.download")}</p>
                <p className="text-text-secondary text-xs">{t("priv.download.d")}</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>{exported ? t("priv.savedTick") : t("priv.export")}</span>
            </button>
            <Link href="/settings/profile" className="w-full flex items-center justify-between px-4 py-3.5 text-left">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("priv.correct")}</p>
                <p className="text-text-secondary text-xs">{t("priv.correct.d")}</p>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>{t("priv.edit")}</span>
            </Link>
          </div>
        </div>

        {/* Tracked requests */}
        {privacyRequests.length > 0 && (
          <div>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("priv.requestHistory")}</p>
            <div className="space-y-2">
              {privacyRequests.map((r) => {
                const meta = PRIVACY_REQUEST_TYPES.find((t) => t.id === r.type);
                const sm = STATUS_META[r.status];
                return (
                  <div key={r.id} className="rounded-2xl p-3.5 flex items-center gap-3 liquid-glass">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{REQ_TYPE_KEYS[r.type] ? t(REQ_TYPE_KEYS[r.type].l) : (meta?.label ?? r.type)}</p>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "var(--glass-bg)", color: "var(--text-3)" }}>{r.regulation}</span>
                      </div>
                      <p className="text-text-tertiary text-[10px]">{t("priv.submittedOn")} {new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: `${sm.color}1a`, color: sm.color }}>{t(sm.lkey)}</span>
                    <button onClick={() => removePrivacyRequest(r.id)} aria-label={t("priv.withdraw")} style={{ color: "var(--text-3)" }}>
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
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("priv.retention")}</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            {RETENTION_SCHEDULE.map((row, i) => (
              <div key={row.ckey} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < RETENTION_SCHEDULE.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <p className="text-sm" style={{ color: "var(--text-1)" }}>{t(row.ckey)}</p>
                <p className="text-text-secondary text-xs text-right">{t(row.pkey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Danger zone */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("priv.dangerZone")}</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(239,68,68,0.10)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("priv.deleteAll")}</p>
                <p className="text-text-secondary text-xs">{t("priv.deleteAll.d")}</p>
              </div>
              <button onClick={() => setConfirmDelete(true)} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>{t("contractors.delete")}</button>
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("priv.deleteAccount")}</p>
                <p className="text-text-secondary text-xs">{t("priv.deleteAccount.d")}</p>
              </div>
              <button onClick={() => { setReqType("erasure"); setRequestOpen(true); }} className="text-xs px-3 py-1.5 rounded-full" style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>{t("contractors.close")}</button>
            </div>
          </div>
        </div>

        <p className="text-text-tertiary text-xs text-center pb-4">{t("priv.compliant")}</p>
      </div>

      {/* New request sheet */}
      {requestOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setRequestOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>{t("priv.newRequestTitle")}</h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>{t("priv.newRequestNote")}</p>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>{t("priv.regulation")}</label>
            <div className="flex gap-2 mb-4">
              {(["GDPR", "CCPA"] as const).map((r) => (
                <button key={r} onClick={() => setReqReg(r)} className="flex-1 py-2 rounded-xl text-sm font-medium transition-all" style={reqReg === r ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>{r}</button>
              ))}
            </div>

            <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>{t("priv.requestType")}</label>
            <div className="rounded-2xl overflow-hidden mb-5" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              {PRIVACY_REQUEST_TYPES.map((rt, i) => (
                <button key={rt.id} onClick={() => setReqType(rt.id)} className="w-full flex items-center justify-between px-4 py-3 text-left" style={{ borderBottom: i < PRIVACY_REQUEST_TYPES.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}>
                  <div className="pr-3">
                    <p className="text-sm" style={{ color: "var(--text-1)" }}>{REQ_TYPE_KEYS[rt.id] ? t(REQ_TYPE_KEYS[rt.id].l) : rt.label}</p>
                    <p className="text-text-secondary text-xs">{REQ_TYPE_KEYS[rt.id] ? t(REQ_TYPE_KEYS[rt.id].d) : rt.desc}</p>
                  </div>
                  {reqType === rt.id && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </button>
              ))}
            </div>

            <button onClick={submitRequest} className="w-full py-3.5 rounded-2xl font-semibold text-base active:scale-[0.97] transition-transform" style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)", color: "#08111E" }}>{t("priv.submitRequest")}</button>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setConfirmDelete(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>{t("priv.deleteConfirmTitle")}</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>{t("priv.deleteConfirmNote")}</p>
            <button onClick={deleteAllData} className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 active:scale-[0.97] transition-transform" style={{ background: "#EF4444", color: "#fff" }}>{t("priv.deleteEverything")}</button>
            <button onClick={() => setConfirmDelete(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("priv.cancel")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
