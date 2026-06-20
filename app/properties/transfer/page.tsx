"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useStore } from "../../lib/store";
import { useT, type MessageKey } from "../../lib/i18n";

/**
 * Ownership-transfer workflow (spec: Property & Estate Management → Property
 * Transfer). A high-risk action gated by the Security & AI Guardrails controls:
 * ownership verification, legal confirmation records, asset reassignment,
 * document transfer, multi-step confirmation and preserved audit history.
 */

const STEP_KEYS: MessageKey[] = ["tr.step.verify", "tr.step.recipient", "tr.step.assets", "tr.step.confirm"];

export default function PropertyTransferPage() {
  const { estateName, profile, addPropertyTransfer, propertyTransfers } = useStore();
  const t = useT();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  // Step 1 — ownership verification
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [legalNameConfirmed, setLegalNameConfirmed] = useState(false);

  // Step 2 — recipient + legal confirmation record
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [jurisdiction, setJurisdiction] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [legalAck, setLegalAck] = useState(false);

  // Step 3 — reassignment
  const [assetsIncluded, setAssetsIncluded] = useState(true);
  const [documentsIncluded, setDocumentsIncluded] = useState(true);

  // Step 4 — multi-step confirmation
  const [confirmText, setConfirmText] = useState("");

  const canNext = () => {
    if (step === 0) return identityConfirmed && legalNameConfirmed;
    if (step === 1) return recipientName.trim() && recipientEmail.trim() && jurisdiction.trim() && effectiveDate && legalAck;
    if (step === 2) return true;
    if (step === 3) return confirmText.trim().toUpperCase() === "TRANSFER";
    return false;
  };

  const submit = () => {
    addPropertyTransfer({
      property: estateName,
      recipientName: recipientName.trim(),
      recipientEmail: recipientEmail.trim(),
      jurisdiction: jurisdiction.trim(),
      effectiveDate,
      assetsIncluded,
      documentsIncluded,
      auditPreserved: true,
    });
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
        <StatusBar />
        <div className="px-6 pt-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" }}>📜</div>
          <h1 className="font-bold text-xl mb-2" style={{ color: "var(--text-1)" }}>{t("tr.doneTitle")}</h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>
            {t("tr.doneBody1")} <b>{estateName}</b> → {recipientName} {t("tr.doneBody2")}
          </p>
          <Link href="/properties/transfer" onClick={() => { setDone(false); setStep(0); }} className="w-full max-w-sm py-3.5 rounded-2xl font-semibold text-sm mb-2" style={{ background: "var(--accent)", color: "#08111E" }}>{t("tr.viewRecords")}</Link>
          <Link href="/settings" className="w-full max-w-sm py-3.5 rounded-2xl font-medium text-sm" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("tr.backToSettings")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/settings" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{t("tr.title")}</h1>
      </div>

      {/* High-risk banner */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl p-3 flex items-start gap-2" style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.22)" }}>
          <span className="text-base">⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>
            {t("tr.banner")}
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="px-4 mb-5 flex items-center gap-1">
        {STEP_KEYS.map((s, i) => (
          <div key={s} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full h-1 rounded-full" style={{ background: i <= step ? "var(--accent)" : "var(--glass-border)" }} />
            <span className="text-[10px]" style={{ color: i === step ? "var(--accent)" : "var(--text-3)" }}>{t(s)}</span>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-4">
        {step === 0 && (
          <div className="space-y-3">
            <p className="text-text-secondary text-xs leading-relaxed px-1">{t("tr.confirmOwner1")} <b style={{ color: "var(--text-1)" }}>{estateName}</b>.</p>
            <Check label={`${t("tr.iAm1")} ${profile.displayName}${t("tr.iAm2")}`} sub={t("tr.iAmSub")} checked={identityConfirmed} onToggle={() => setIdentityConfirmed(!identityConfirmed)} />
            <Check label={t("tr.nameMatch")} sub={t("tr.nameMatchSub")} checked={legalNameConfirmed} onToggle={() => setLegalNameConfirmed(!legalNameConfirmed)} />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-3">
            <Field label={t("tr.recipientName")} value={recipientName} onChange={setRecipientName} placeholder={t("tr.recipientNamePh")} />
            <Field label={t("tr.recipientEmail")} value={recipientEmail} onChange={setRecipientEmail} placeholder={t("tr.recipientEmailPh")} type="email" />
            <Field label={t("tr.jurisdiction")} value={jurisdiction} onChange={setJurisdiction} placeholder={t("tr.jurisdictionPh")} />
            <Field label={t("tr.effectiveDate")} value={effectiveDate} onChange={setEffectiveDate} type="date" />
            <Check label={t("tr.legalAck")} sub={t("tr.legalAckSub")} checked={legalAck} onToggle={() => setLegalAck(!legalAck)} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <p className="text-text-secondary text-xs leading-relaxed px-1">{t("tr.assetsIntro")}</p>
            <Check label={t("tr.assetsInc")} sub={t("tr.assetsIncSub")} checked={assetsIncluded} onToggle={() => setAssetsIncluded(!assetsIncluded)} />
            <Check label={t("tr.docsInc")} sub={t("tr.docsIncSub")} checked={documentsIncluded} onToggle={() => setDocumentsIncluded(!documentsIncluded)} />
            <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("tr.preserveAudit")}</p>
                <p className="text-text-secondary text-xs">{t("tr.preserveAuditSub")}</p>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80" }}>{t("tr.alwaysOn")}</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="rounded-2xl p-4 space-y-1.5" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
              <Row k={t("tr.rowProperty")} v={estateName} />
              <Row k={t("tr.rowNewOwner")} v={recipientName} />
              <Row k={t("tr.rowEmail")} v={recipientEmail} />
              <Row k={t("tr.rowJurisdiction")} v={jurisdiction} />
              <Row k={t("tr.rowEffective")} v={effectiveDate} />
              <Row k={t("tr.rowAssets")} v={assetsIncluded ? t("tr.included") : t("tr.excluded")} />
              <Row k={t("tr.rowDocuments")} v={documentsIncluded ? t("tr.included") : t("tr.excluded")} />
              <Row k={t("tr.rowAudit")} v={t("tr.preserved")} />
            </div>
            <div>
              <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("tr.typeConfirm")}</label>
              <div className="rounded-2xl px-4 py-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                <input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} placeholder="TRANSFER" className="w-full bg-transparent text-sm outline-none tracking-widest" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex gap-2 pt-2">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="flex-1 py-3.5 rounded-2xl font-medium text-sm" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("tr.back")}</button>
          )}
          {step < STEP_KEYS.length - 1 ? (
            <button onClick={() => canNext() && setStep(step + 1)} disabled={!canNext()} className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all" style={canNext() ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}>{t("tr.continue")}</button>
          ) : (
            <button onClick={() => canNext() && submit()} disabled={!canNext()} className="flex-1 py-3.5 rounded-2xl font-semibold text-sm transition-all" style={canNext() ? { background: "#EF4444", color: "#fff" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}>{t("tr.confirmTransfer")}</button>
          )}
        </div>

        {/* Existing transfer records */}
        {propertyTransfers.length > 0 && (
          <div className="pt-2">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("tr.records")}</p>
            <div className="space-y-2">
              {propertyTransfers.map((rec) => (
                <div key={rec.id} className="rounded-2xl p-3.5 liquid-glass">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{rec.property} → {rec.recipientName}</p>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: rec.status === "completed" ? "rgba(74,222,128,0.12)" : "rgba(245,158,11,0.12)", color: rec.status === "completed" ? "#4ADE80" : "#F59E0B" }}>{rec.status}</span>
                  </div>
                  <p className="text-text-tertiary text-[10px] mt-0.5">{rec.jurisdiction} · {t("tr.effectivePrefix")} {rec.effectiveDate} · {t("tr.auditPreserved")}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{label}</label>
      <div className="rounded-2xl px-4 py-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)", colorScheme: "dark" }} />
      </div>
    </div>
  );
}

function Check({ label, sub, checked, onToggle }: { label: string; sub: string; checked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left" style={{ background: "rgba(255,255,255,0.04)", border: checked ? "1px solid rgba(74,222,128,0.3)" : "0.5px solid var(--glass-border)" }}>
      <span className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={checked ? { background: "var(--accent)" } : { border: "1.5px solid var(--glass-border)" }}>
        {checked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{label}</p>
        <p className="text-text-secondary text-xs">{sub}</p>
      </div>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-text-secondary text-xs">{k}</span>
      <span className="text-sm font-medium text-right" style={{ color: "var(--text-1)" }}>{v || "—"}</span>
    </div>
  );
}
