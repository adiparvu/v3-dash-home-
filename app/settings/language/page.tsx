"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const languages = [
  { id: "en", label: "English", native: "English", flag: "🇬🇧" },
  { id: "ro", label: "Romanian", native: "Română", flag: "🇷🇴" },
  { id: "de", label: "German", native: "Deutsch", flag: "🇩🇪" },
  { id: "fr", label: "French", native: "Français", flag: "🇫🇷" },
  { id: "es", label: "Spanish", native: "Español", flag: "🇪🇸" },
  { id: "it", label: "Italian", native: "Italiano", flag: "🇮🇹" },
];

const timezones = [
  "Europe/Bucharest (GMT+2)",
  "Europe/London (GMT+0)",
  "Europe/Berlin (GMT+1)",
  "America/New_York (GMT-5)",
];

export default function LanguagePage() {
  const [lang, setLang] = useState("en");
  const [tz, setTz] = useState(timezones[0]);

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Language & Region</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Language */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">App Language</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {languages.map((l, i) => {
              const active = lang === l.id;
              return (
                <button
                  key={l.id}
                  onClick={() => setLang(l.id)}
                  className="w-full flex items-center gap-3.5 px-4 py-3.5 text-left"
                  style={{ borderBottom: i < languages.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
                >
                  <span className="text-xl flex-shrink-0">{l.flag}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{l.label}</p>
                    <p className="text-text-secondary text-xs">{l.native}</p>
                  </div>
                  {active && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "var(--accent)" }}>
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Timezone */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Time Zone</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            {timezones.map((t, i) => {
              const active = tz === t;
              return (
                <button
                  key={t}
                  onClick={() => setTz(t)}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                  style={{ borderBottom: i < timezones.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
                >
                  <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t}</span>
                  {active && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "var(--accent)" }}>
                      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Region note */}
        <p className="text-text-tertiary text-[11px] px-1 leading-relaxed">
          Region settings affect date, number and currency formatting throughout the app. Manage formats in Units & Currency.
        </p>
      </div>
    </div>
  );
}
