"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useTheme } from "../../components/ThemeProvider";
import { useT, type MessageKey } from "../../lib/i18n";

const accents = [
  { id: "green", label: "Forest", color: "#4ADE80" },
  { id: "cyan", label: "Lake", color: "#22D3EE" },
  { id: "purple", label: "Orchid", color: "#7C3AED" },
  { id: "amber", label: "Harvest", color: "#F59E0B" },
  { id: "blue", label: "Sky", color: "#3B82F6" },
  { id: "rose", label: "Bloom", color: "#F43F5E" },
];

const densities: { id: string; lkey: MessageKey; dkey: MessageKey }[] = [
  { id: "comfortable", lkey: "appr.comfortable", dkey: "appr.comfortable.d" },
  { id: "compact", lkey: "appr.compact", dkey: "appr.compact.d" },
];

function BackHeader({ title }: { title: string }) {
  return (
    <div className="px-5 pt-1 pb-4 flex items-center gap-3">
      <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </Link>
      <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{title}</h1>
    </div>
  );
}

export default function AppearancePage() {
  const { theme, setTheme } = useTheme();
  const t = useT();
  const [accent, setAccent] = useState("green");
  const [density, setDensity] = useState("comfortable");
  const [reduceMotion, setReduceMotion] = useState(false);
  const [boldText, setBoldText] = useState(false);

  const themeCards: { id: "light" | "dark"; label: string }[] = [
    { id: "light", label: t("appr.light") },
    { id: "dark", label: t("appr.dark") },
  ];

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />
      <BackHeader title={t("appr.title")} />

      <div className="px-4 space-y-5">
        {/* Theme */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("appr.theme")}</p>
          <div className="grid grid-cols-2 gap-3">
            {themeCards.map((tc) => {
              const active = theme === tc.id;
              return (
                <button
                  key={tc.id}
                  onClick={() => setTheme(tc.id)}
                  className="liquid-glass rounded-3xl p-3 text-left active:scale-[0.98] transition-transform"
                  style={{ border: active ? "1.5px solid var(--accent)" : undefined }}
                >
                  {/* Mini preview */}
                  <div
                    className="rounded-2xl mb-2.5 p-2.5 h-24 flex flex-col gap-1.5"
                    style={{ background: tc.id === "dark" ? "#0c0e1a" : "#F0F1F7" }}
                  >
                    <div className="h-2 w-10 rounded-full" style={{ background: tc.id === "dark" ? "rgba(255,255,255,0.85)" : "#0A0A12" }} />
                    <div className="rounded-xl flex-1 p-1.5 flex items-center gap-1.5" style={{ background: tc.id === "dark" ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.85)", border: tc.id === "dark" ? "0.5px solid rgba(255,255,255,0.16)" : "0.5px solid rgba(0,0,0,0.06)" }}>
                      <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ background: "linear-gradient(135deg,#4ADE80,#22D3EE)" }} />
                      <div className="flex-1 space-y-1">
                        <div className="h-1.5 w-full rounded-full" style={{ background: tc.id === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }} />
                        <div className="h-1.5 w-2/3 rounded-full" style={{ background: tc.id === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)" }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between px-0.5">
                    <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{tc.label}</span>
                    <span
                      className="w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ border: active ? "none" : "1.5px solid var(--glass-border)", background: active ? "var(--accent)" : "transparent" }}
                    >
                      {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--bg-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("appr.accent")}</p>
          <div className="liquid-glass rounded-2xl p-4 grid grid-cols-6 gap-3">
            {accents.map((a) => (
              <button key={a.id} onClick={() => setAccent(a.id)} aria-label={a.label} className="flex flex-col items-center gap-1.5 active:scale-90 transition-transform">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: a.color, boxShadow: accent === a.id ? `0 0 0 2px var(--bg-1), 0 0 0 4px ${a.color}` : "none" }}
                >
                  {accent === a.id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                <span className="text-[9px]" style={{ color: "var(--text-2)" }}>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Layout density */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("appr.layout")}</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {densities.map((d, i) => (
              <button
                key={d.id}
                onClick={() => setDensity(d.id)}
                className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                style={{ borderBottom: i < densities.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
              >
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(d.lkey)}</p>
                  <p className="text-text-secondary text-xs">{t(d.dkey)}</p>
                </div>
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ border: density === d.id ? "none" : "1.5px solid var(--glass-border)", background: density === d.id ? "var(--accent)" : "transparent" }}
                >
                  {density === d.id && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--bg-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Accessibility toggles */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("appr.accessibility")}</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {[
              { label: t("appr.reduceMotion"), desc: t("appr.reduceMotion.d"), enabled: reduceMotion, onToggle: () => setReduceMotion((v) => !v) },
              { label: t("appr.boldText"), desc: t("appr.boldText.d"), enabled: boldText, onToggle: () => setBoldText((v) => !v) },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: i === 0 ? "0.5px solid var(--glass-border)" : undefined }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{item.label}</p>
                  <p className="text-text-secondary text-xs">{item.desc}</p>
                </div>
                <button
                  onClick={item.onToggle}
                  className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: item.enabled ? "var(--accent)" : "var(--glass-border)" }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: item.enabled ? "calc(100% - 22px)" : "2px", background: item.enabled ? "var(--bg-1)" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
