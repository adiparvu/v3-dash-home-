"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

type Group = { key: string; label: string; desc: string; options: string[] };

const groups: Group[] = [
  { key: "system", label: "Measurement System", desc: "Distance, area & volume", options: ["Metric", "Imperial"] },
  { key: "temp", label: "Temperature", desc: "Sensor & climate readings", options: ["Celsius", "Fahrenheit"] },
  { key: "currency", label: "Currency", desc: "Costs, budgets & invoices", options: ["EUR €", "USD $", "GBP £", "RON"] },
  { key: "date", label: "Date Format", desc: "How dates are displayed", options: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"] },
  { key: "time", label: "Time Format", desc: "Clock display", options: ["24-hour", "12-hour"] },
  { key: "week", label: "First Day of Week", desc: "Calendar & schedules", options: ["Monday", "Sunday"] },
];

const defaults: Record<string, string> = {
  system: "Metric",
  temp: "Celsius",
  currency: "EUR €",
  date: "DD/MM/YYYY",
  time: "24-hour",
  week: "Monday",
};

export default function UnitsPage() {
  const [sel, setSel] = useState<Record<string, string>>(defaults);

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Units & Currency</h1>
      </div>

      <div className="px-4 space-y-5">
        {groups.map((g) => (
          <div key={g.key}>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{g.label}</p>
            <div className="liquid-glass rounded-2xl p-3">
              <p className="text-text-tertiary text-[11px] mb-2.5 px-1">{g.desc}</p>
              <div className="flex flex-wrap gap-2">
                {g.options.map((opt) => {
                  const active = sel[g.key] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setSel((s) => ({ ...s, [g.key]: opt }))}
                      className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
                      style={
                        active
                          ? { background: "var(--accent)", color: "var(--bg-1)" }
                          : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}

        {/* Live preview */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Preview</p>
          <div className="liquid-glass rounded-2xl p-4 space-y-2.5">
            {[
              { label: "Lake area", value: sel.system === "Metric" ? "1,240 m²" : "13,347 ft²" },
              { label: "Greenhouse temp", value: sel.temp === "Celsius" ? "24.3 °C" : "75.7 °F" },
              { label: "Monthly upkeep", value: `${sel.currency.slice(-1) === "N" ? "" : sel.currency.slice(-1)}2,450${sel.currency.startsWith("RON") ? " RON" : ""}` },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-2)" }}>{row.label}</span>
                <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
