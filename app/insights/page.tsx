"use client";

import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useConditions } from "../lib/useConditions";
import { evaluateRules } from "../lib/automationRules";
import { deriveFaults, DEMO_READINGS } from "../lib/diagnostics";
import { buildInsights, type Insight } from "../lib/insights";
import { useT } from "../lib/i18n";

/** Proactive insights — fuses live conditions, faults and active rules. */
export default function InsightsPage() {
  const t = useT();
  const { conditions, live } = useConditions();
  const faults = deriveFaults(DEMO_READINGS);
  const rules = evaluateRules(conditions);
  const insights = buildInsights(conditions, faults, rules);

  const actions = insights.filter((i) => i.kind === "action").length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.insights")}</h1>
          <p className="text-text-secondary text-xs">{actions} action{actions === 1 ? "" : "s"} suggested now</p>
        </div>
        <span className="ml-auto text-[10px] font-semibold px-2 py-1 rounded-full" style={live
          ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
          : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{live ? "Live" : "Demo"}</span>
      </div>

      {/* Live conditions strip */}
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        {[
          { label: "Temp", value: `${conditions.tempC}°` },
          { label: "UV", value: String(conditions.uv) },
          { label: "AQI", value: String(conditions.aqi) },
          { label: "Tariff", value: `${conditions.tariffNow.toFixed(0)}` },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center liquid-glass">
            <p className="font-bold text-base" style={{ color: "var(--text-1)" }}>{s.value}</p>
            <p className="text-text-secondary text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="px-4 space-y-2.5">
        {insights.map((insight: Insight) => {
          const card = (
            <div className="rounded-2xl p-4 liquid-glass flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${insight.color}15`, border: `1px solid ${insight.color}30` }}>
                {insight.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-semibold leading-tight" style={{ color: "var(--text-1)" }}>{insight.title}</p>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide" style={{ background: `${insight.color}18`, color: insight.color }}>{insight.kind}</span>
                </div>
                <p className="text-text-secondary text-xs leading-snug">{insight.detail}</p>
              </div>
              {insight.href && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4, marginTop: 4 }} aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
              )}
            </div>
          );
          return insight.href ? (
            <Link key={insight.id} href={insight.href} className="block active:scale-[0.98] transition-transform">{card}</Link>
          ) : (
            <div key={insight.id}>{card}</div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
