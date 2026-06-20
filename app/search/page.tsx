"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import { useStore } from "../lib/store";
import { searchIndex, type SearchEntry, type SearchKind } from "../lib/searchIndex";
import { useT, type MessageKey } from "../lib/i18n";

const kindMeta: Record<SearchKind, { labelKey: MessageKey; kindKey: MessageKey; color: string }> = {
  Zone: { labelKey: "search.zones", kindKey: "search.kZone", color: "#4ADE80" },
  Asset: { labelKey: "search.assets", kindKey: "search.kAsset", color: "#22D3EE" },
  Task: { labelKey: "search.tasks", kindKey: "search.kTask", color: "#F59E0B" },
  Page: { labelKey: "search.pages", kindKey: "search.kPage", color: "#7C3AED" },
};

const order: SearchKind[] = ["Zone", "Asset", "Task", "Page"];

export default function SearchPage() {
  const t = useT();
  const [q, setQ] = useState("");
  const { addedZones, addedAssets } = useStore();

  const entries = useMemo<SearchEntry[]>(() => {
    const custom: SearchEntry[] = [
      ...addedZones.map((z) => ({ kind: "Zone" as const, name: z.name, subtitle: z.subtitle, href: z.href, icon: z.icon })),
      ...addedAssets.map((a) => ({ kind: "Asset" as const, name: a.name, subtitle: `${a.category} · ${a.location}`, href: a.href, icon: a.icon })),
    ];
    return [...custom, ...searchIndex];
  }, [addedZones, addedAssets]);

  const query = q.trim().toLowerCase();
  const results = query
    ? entries.filter((e) => e.name.toLowerCase().includes(query) || e.subtitle.toLowerCase().includes(query))
    : [];

  const grouped = order
    .map((kind) => ({ kind, items: results.filter((r) => r.kind === kind) }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      {/* Header with search field */}
      <div className="px-4 pt-1 pb-3 flex items-center gap-2">
        <Link href="/zones" aria-label={t("search.back")} className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div className="flex-1 rounded-2xl flex items-center gap-2 px-3.5 py-2.5" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-1)", caretColor: "var(--accent)" }}
          />
          {q && (
            <button onClick={() => setQ("")} aria-label={t("search.clear")} style={{ color: "var(--text-3)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" /><path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {!query && (
        <div className="flex flex-col items-center justify-center px-8 text-center mt-24">
          <span className="text-5xl mb-4">🔍</span>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-1)" }}>{t("search.emptyTitle")}</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{t("search.emptyBody")}</p>
        </div>
      )}

      {query && grouped.length === 0 && (
        <div className="flex flex-col items-center justify-center px-8 text-center mt-24">
          <span className="text-5xl mb-4">🤷</span>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-1)" }}>{t("search.noResults")}</p>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>{t("search.noMatch")} “{q}”.</p>
        </div>
      )}

      {query && grouped.length > 0 && (
        <div className="px-4 space-y-5">
          {grouped.map((g) => (
            <div key={g.kind}>
              <p className="text-xs font-medium uppercase tracking-wide mb-2 px-1" style={{ color: "var(--text-2)" }}>
                {t(kindMeta[g.kind].labelKey)} · {g.items.length}
              </p>
              <div className="liquid-glass rounded-2xl overflow-hidden">
                {g.items.map((item, i) => (
                  <Link key={item.href + item.name} href={item.href}>
                    <div className="flex items-center gap-3.5 px-4 py-3.5" style={i < g.items.length - 1 ? { borderBottom: "0.5px solid var(--glass-border)" } : {}}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{item.name}</p>
                        <p className="text-xs truncate" style={{ color: "var(--text-2)" }}>{item.subtitle}</p>
                      </div>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${kindMeta[g.kind].color}1F`, color: kindMeta[g.kind].color }}>
                        {t(kindMeta[g.kind].kindKey)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
