"use client";

import { useMemo } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { demoExpenses, summarize, budgetStatus, CATEGORY_META } from "../lib/budget";
import { useT, type MessageKey } from "../lib/i18n";

const CAT_KEYS: Record<string, MessageKey> = {
  Maintenance: "cat.maintenance", Garden: "cat.garden", Utilities: "cat.utilities",
  Improvement: "cat.improvement", Supplies: "cat.supplies", Other: "cat.other",
};
const SRC_KEYS: Record<string, MessageKey> = { receipt: "src.receipt", bank: "src.bank", manual: "src.manual" };

const MONTHLY_BUDGET = 800; // EUR

export default function BudgetPage() {
  const t = useT();
  const expenses = useMemo(() => demoExpenses(), []);
  const summary = useMemo(() => summarize(expenses), [expenses]);
  const status = budgetStatus(summary.thisMonth, MONTHLY_BUDGET);

  const recent = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const maxMonth = Math.max(1, ...summary.monthly.map((m) => m.amount));

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.budget")}</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* This-month budget progress */}
        <div className="rounded-3xl p-4 liquid-glass">
          <div className="flex items-end justify-between mb-2">
            <div>
              <p className="text-text-secondary text-xs">{t("budget.thisMonth")}</p>
              <p className="font-bold text-3xl" style={{ color: "var(--text-1)" }}>€{summary.thisMonth.toFixed(0)}</p>
            </div>
            <p className="text-text-secondary text-xs">{t("budget.of")} €{MONTHLY_BUDGET} {t("budget.budgetWord")}</p>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div className="h-full rounded-full" style={{ width: `${Math.min(100, status.pct)}%`, background: status.over ? "#EF4444" : "var(--accent)" }} />
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: status.over ? "#EF4444" : "var(--text-2)" }}>
            {status.over ? `€${Math.abs(status.remaining).toFixed(0)} ${t("budget.overBudget")}` : `€${status.remaining.toFixed(0)} ${t("budget.remaining")} · ${status.pct}% ${t("budget.used")}`}
          </p>
        </div>

        {/* Monthly trend */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("budget.monthlyTrend")}</p>
          <div className="rounded-2xl p-4 liquid-glass">
            <div className="flex items-end justify-between gap-2" style={{ height: 90 }}>
              {summary.monthly.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className="w-full rounded-t-md" style={{ height: 12 + (m.amount / maxMonth) * 64, background: "var(--accent)", opacity: 0.85 }} title={`€${m.amount}`} />
                  <span className="text-text-tertiary text-[9px]">{m.month.slice(5)}</span>
                </div>
              ))}
            </div>
            <p className="text-text-tertiary text-[10px] mt-2 text-center">{t("budget.totalTracked")}: €{summary.total.toFixed(0)}</p>
          </div>
        </div>

        {/* By category */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("budget.byCategory")}</p>
          <div className="rounded-2xl liquid-glass overflow-hidden">
            {summary.byCategory.map((c, i) => {
              const meta = CATEGORY_META[c.category] ?? CATEGORY_META.Other;
              return (
                <div key={c.category} className="px-4 py-3" style={{ borderBottom: i < summary.byCategory.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-base w-6 text-center flex-shrink-0">{meta.icon}</span>
                    <span className="flex-1 text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(CAT_KEYS[c.category] ?? "cat.other")}</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>€{c.amount.toFixed(0)}</span>
                    <span className="text-text-tertiary text-[10px] w-8 text-right">{c.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden ml-9" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: meta.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent expenses */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("budget.recent")}</p>
          <div className="rounded-2xl liquid-glass overflow-hidden">
            {recent.map((e, i) => {
              const meta = CATEGORY_META[e.category] ?? CATEGORY_META.Other;
              return (
                <div key={e.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < recent.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <span className="text-base w-6 text-center flex-shrink-0">{meta.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{e.label}</p>
                    <p className="text-text-secondary text-[11px]">{e.zone} · {e.date} · {e.source === "receipt" ? "🧾 " : e.source === "bank" ? "🏦 " : ""}{t(SRC_KEYS[e.source] ?? "src.manual")}</p>
                  </div>
                  <span className="text-sm font-semibold flex-shrink-0" style={{ color: "var(--text-1)" }}>€{e.amount.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          <p className="text-text-tertiary text-[11px] text-center mt-2">{t("budget.importedFrom")}</p>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
