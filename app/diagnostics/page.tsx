"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import DetailDisclosureButton from "../components/DetailDisclosureButton";
import DetailSheet from "../components/DetailSheet";
import { deriveFaults, faultSummary, SEVERITY_META, DEMO_READINGS, type PossibleFault, type FaultSeverity } from "../lib/diagnostics";
import { useT, type MessageKey } from "../lib/i18n";

const SEV_KEYS: Record<FaultSeverity, MessageKey> = { critical: "sev.critical", warning: "sev.warning", watch: "sev.watch" };

export default function DiagnosticsPage() {
  const t = useT();
  const faults = deriveFaults(DEMO_READINGS);
  const summary = faultSummary(faults);
  const [selected, setSelected] = useState<PossibleFault | null>(null);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.diagnostics")}</h1>
          <p className="text-text-secondary text-xs">{summary.total} {t("diag.possibleFaultsWord")} {t("diag.detected")}</p>
        </div>
      </div>

      {/* Severity summary */}
      <div className="px-4 mb-4 grid grid-cols-3 gap-2">
        {(["critical", "warning", "watch"] as const).map((sev) => (
          <div key={sev} className="rounded-2xl p-3 text-center liquid-glass" style={{ border: `1px solid ${SEVERITY_META[sev].color}25` }}>
            <p className="font-bold text-xl" style={{ color: SEVERITY_META[sev].color }}>{summary[sev]}</p>
            <p className="text-text-secondary text-[10px]">{t(SEV_KEYS[sev])}</p>
          </div>
        ))}
      </div>

      {/* Possible faults — each row carries a Detail Disclosure Button */}
      <div className="px-5 mb-2 font-semibold text-sm">{t("diag.possibleFaultsTitle")}</div>
      <div className="px-4 space-y-2.5">
        {faults.length === 0 && (
          <div className="rounded-2xl p-6 text-center liquid-glass">
            <p className="text-2xl mb-1">✅</p>
            <p className="text-sm font-medium">{t("diag.noFaults")}</p>
            <p className="text-text-secondary text-xs mt-0.5">{t("diag.allInRange")}</p>
          </div>
        )}
        {faults.map((f) => {
          const meta = SEVERITY_META[f.severity];
          return (
            <div key={f.id} className="rounded-2xl p-4 liquid-glass flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}>
                {f.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-1)" }}>{f.title}</p>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${meta.color}18`, color: meta.color }}>{t(SEV_KEYS[f.severity])}</span>
                </div>
                <p className="text-text-secondary text-xs">{f.symptom}</p>
                <p className="text-text-tertiary text-[10px] mt-1">{f.zone} · {Math.round(f.confidence * 100)}% {t("diag.confidence")}</p>
              </div>
              <DetailDisclosureButton
                onPress={() => setSelected(f)}
                label={`${t("diag.detailsFor")} ${f.title}`}
                color={meta.color}
              />
            </div>
          );
        })}
      </div>

      {/* Detail sheet: causes + suggestions */}
      <DetailSheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        icon={selected?.icon}
        accent={selected ? SEVERITY_META[selected.severity].color : undefined}
      >
        {selected && (
          <div className="space-y-5">
            <div>
              <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-1">{t("diag.symptom")}</p>
              <p className="text-sm" style={{ color: "var(--text-1)" }}>{selected.symptom}</p>
              <p className="text-text-tertiary text-[11px] mt-1">{selected.zone} · {Math.round(selected.confidence * 100)}% {t("diag.confidence")}</p>
            </div>

            <div>
              <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-2">{t("diag.likelyCauses")}</p>
              <div className="space-y-1.5">
                {selected.likelyCauses.map((c, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5" style={{ background: "var(--glass-bg)", color: "var(--text-2)" }}>{i + 1}</span>
                    <span style={{ color: "var(--text-1)" }}>{c}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-2">{t("diag.suggestions")}</p>
              <div className="space-y-1.5">
                {selected.suggestions.map((sug, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <span className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent)" }}>✓</span>
                    <span style={{ color: "var(--text-1)" }}>{sug}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link href="/maintenance" className="block">
              <button className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "var(--accent)", color: "var(--bg-1)" }}>
                {t("diag.scheduleMaint")}
              </button>
            </Link>
          </div>
        )}
      </DetailSheet>

      <BottomNav />
    </div>
  );
}
