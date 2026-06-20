"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { INTEGRATIONS, CATEGORIES, useIntegrations } from "../../lib/integrations";

/**
 * Integrations hub — a categorized catalog where every integration is
 * connectable. Connection state lives in the integrations store; tap any item
 * to open its detail surface and connect/disconnect.
 */
export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const { isConnected, connectedCount } = useIntegrations();
  const q = query.trim().toLowerCase();

  const sections = CATEGORIES.map((cat) => ({
    title: cat,
    items: INTEGRATIONS.filter(
      (i) => i.category === cat && (!q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)),
    ),
  })).filter((s) => s.items.length > 0);

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Integrations</h1>
      </div>

      <div className="px-4 space-y-5">
        {/* Status banner */}
        <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(74,222,128,0.12)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 8px var(--accent)" }} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>All systems operational</p>
            <p className="text-text-secondary text-xs">{connectedCount} of {INTEGRATIONS.length} integrations connected</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search integrations"
          aria-label="Search integrations"
          className="w-full rounded-2xl px-4 py-2.5 text-sm"
          style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}
        />

        {/* Categorized integrations */}
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{section.title}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
              {section.items.map((item, i) => {
                const connected = isConnected(item.id);
                return (
                  <Link key={item.id} href={`/settings/integrations/${item.id}`} className="block active:bg-white/[0.04] transition-colors">
                    <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{item.name}</p>
                        <p className="text-text-secondary text-xs leading-snug mt-0.5">{item.desc}</p>
                      </div>
                      {connected ? (
                        <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>
                          {item.connectedBadge ?? "● Connected"}
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "0.5px solid rgba(34,211,238,0.3)" }}>
                          Connect
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <p className="text-text-secondary text-sm text-center py-6">No integration matches “{query}”.</p>
        )}

        {/* Developer */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Developer</p>
          <Link href="#">
            <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-2)" }} aria-hidden="true">
                  <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>API Keys & Webhooks</p>
                <p className="text-text-secondary text-xs">Build custom automations</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }} aria-hidden="true"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
