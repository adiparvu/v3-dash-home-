"use client";

import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import Link from "next/link";
import { useT, type MessageKey } from "../lib/i18n";

const sections: { title: string; tkey: MessageKey; items: { href: string; lkey: MessageKey; dkey: MessageKey; icon: string; badge: string | null }[] }[] = [
  {
    title: "Estate",
    tkey: "more.estate",
    items: [
      { href: "/automations", lkey: "page.automations", dkey: "more.d.automations", icon: "⚡", badge: "3 active" },
      { href: "/chat", lkey: "more.chat", dkey: "more.d.chat", icon: "💬", badge: "6 unread" },
      { href: "/ai", lkey: "set.assistant", dkey: "more.d.ai", icon: "✨", badge: "Beta" },
      { href: "/properties", lkey: "page.properties", dkey: "more.d.properties", icon: "🏠", badge: null },
      { href: "/budget", lkey: "page.budget", dkey: "more.d.budget", icon: "💶", badge: "New" },
      { href: "/documents", lkey: "page.documents", dkey: "more.d.documents", icon: "📄", badge: "12" },
    ],
  },
  {
    title: "Monitoring",
    tkey: "more.monitoring",
    items: [
      { href: "/insights", lkey: "page.insights", dkey: "more.d.insights", icon: "💡", badge: "New" },
      { href: "/twin/energy", lkey: "more.energy", dkey: "more.d.energy", icon: "⚡", badge: "Live" },
      { href: "/twin/floorplan", lkey: "more.floorplan", dkey: "more.d.floorplan", icon: "🏠", badge: "Live" },
      { href: "/sensors", lkey: "page.sensors", dkey: "more.d.sensors", icon: "📡", badge: "Live" },
      { href: "/diagnostics", lkey: "page.diagnostics", dkey: "more.d.diagnostics", icon: "🩺", badge: null },
      { href: "/maintenance", lkey: "page.maintenance", dkey: "more.d.maintenance", icon: "🔧", badge: "1 due" },
      { href: "/contractors", lkey: "page.contractors", dkey: "more.d.contractors", icon: "👷", badge: null },
    ],
  },
  {
    title: "Account",
    tkey: "more.account",
    items: [
      { href: "/widgets", lkey: "page.widgets", dkey: "more.d.widgets", icon: "🧩", badge: "New" },
      { href: "/settings", lkey: "page.settings", dkey: "more.d.settings", icon: "⚙️", badge: null },
      { href: "/settings/security", lkey: "set.security", dkey: "set.security.desc", icon: "🔒", badge: null },
      { href: "/settings/privacy", lkey: "set.privacy", dkey: "more.d.privacy", icon: "🛡️", badge: null },
    ],
  },
];

export default function MorePage() {
  const t = useT();
  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header + Profile */}
      <div className="px-5 pt-1 pb-4">
        <h1 className="font-bold text-2xl mb-4" style={{ color: "var(--text-1)" }}>{t("more.title")}</h1>

        {/* Profile card */}
        <div
          className="rounded-3xl p-4 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 16px rgba(74,222,128,0.3)" }}
          >
            <span className="text-bg font-bold text-xl">A</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-base" style={{ color: "var(--text-1)" }}>Alex Owner</p>
            <p className="text-text-secondary text-xs">alex@prvio.earth</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span className="text-accent-green text-[10px] font-medium">Pro Member · since 2024</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">
              {t(section.tkey)}
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}
            >
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3.5 px-4 py-3.5 active:bg-white/[0.06] transition-colors"
                    style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(item.lkey)}</p>
                      <p className="text-text-secondary text-xs">{t(item.dkey)}</p>
                    </div>
                    {item.badge && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "rgba(74,222,128,0.15)", color: "var(--accent)" }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          className="w-full rounded-2xl py-3.5 text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
        >
          {t("more.signOut")}
        </button>

        <p className="text-text-tertiary text-center text-xs pb-2">PRVIO EARTH · v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
