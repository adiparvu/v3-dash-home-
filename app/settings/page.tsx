"use client";

import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useStore, RING_COLORS, memberSince, initials, AUTO_LOCK_OPTIONS, autoLockLabel } from "../lib/store";

const settingsSections = [
  {
    title: "Account",
    items: [
      { href: "/settings/profile", label: "Edit Profile", icon: "👤", desc: "Name, avatar, display preferences" },
      { href: "/settings/security", label: "Security", icon: "🔒", desc: "Face ID, sessions & audit log" },
      { href: "/settings/privacy", label: "Privacy & Data", icon: "🛡️", desc: "GDPR, data exports & deletion" },
      { href: "/settings/notifications", label: "Notifications", icon: "🔔", desc: "Alerts & push preferences" },
      { href: "/settings/assistant", label: "AI Assistant", icon: "✨", desc: "Name, avatar, personality & model" },
      { href: "/settings/ai-guardrails", label: "AI Guardrails", icon: "🛡️", desc: "Policy, allowlisted tools & AI audit" },
    ],
  },
  {
    title: "Estate",
    items: [
      { href: "/properties", label: "Properties", icon: "🏠", desc: "Manage properties & parcels" },
      { href: "/properties/transfer", label: "Transfer Ownership", icon: "📜", desc: "Verified, legally-recorded transfer" },
      { href: "/settings/units", label: "Units & Currency", icon: "📏", desc: "Metric/Imperial, EUR/USD" },
      { href: "/settings/integrations", label: "Integrations", icon: "🔗", desc: "Home Assistant, sensors, APIs" },
    ],
  },
  {
    title: "App",
    items: [
      { href: "/settings/appearance", label: "Appearance", icon: "🎨", desc: "Theme, accent color, layout" },
      { href: "/settings/language", label: "Language & Region", icon: "🌍", desc: "Language, timezone, date format" },
    ],
  },
];

export default function SettingsPage() {
  const { profile, security, setSecurity } = useStore();
  const ring = RING_COLORS[profile.ringColor] ?? RING_COLORS[0];

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4">
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Settings</h1>
      </div>

      {/* Profile card */}
      <div className="px-4 mb-5">
        <Link href="/settings/profile">
          <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 p-0.5"
              style={{ background: ring.value, boxShadow: "0 0 16px rgba(74,222,128,0.3)" }}
            >
              <div className="w-full h-full rounded-full flex items-center justify-center" style={{ background: "var(--bg-1)" }}>
                <span className="font-bold text-xl" style={{ color: "var(--text-1)" }}>{initials(profile.displayName)}</span>
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold" style={{ color: "var(--text-1)" }}>{profile.displayName}</p>
              <p className="text-text-secondary text-xs">{profile.email}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <span className="text-accent-green text-[10px] font-medium">Pro · Member since {memberSince(profile.createdAt)}</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)" }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </Link>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-5">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">{section.title}</p>
            <div className="liquid-glass rounded-2xl overflow-hidden">
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3.5 px-4 py-3.5 transition-colors"
                    style={{ borderBottom: i < section.items.length - 1 ? "0.5px solid var(--glass-border)" : undefined }}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{item.label}</p>
                      <p className="text-text-secondary text-xs">{item.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Auto lock */}
        <div>
          <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">Security</p>
          <div className="liquid-glass rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "0.5px solid var(--glass-border)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Auto Lock</p>
                <p className="text-text-secondary text-xs">Lock app after inactivity</p>
              </div>
              <span className="text-accent-green text-sm font-medium">{autoLockLabel(security)}</span>
            </div>
            <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {AUTO_LOCK_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSecurity({ autoLock: opt.id })}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
                  style={
                    security.autoLock === opt.id
                      ? { background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.35)", color: "var(--accent)" }
                      : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }
                  }
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="w-full rounded-2xl py-3.5 text-sm font-medium"
            style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
          >
            Sign Out
          </button>
        </form>

        <p className="text-text-tertiary text-center text-xs pb-4">PRVIO EARTH · v1.0.0 · Build 2026.06</p>
      </div>

      <BottomNav />
    </div>
  );
}
