"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const settingsSections = [
  {
    title: "Account",
    items: [
      { href: "/settings/profile", label: "Edit Profile", icon: "👤", desc: "Name, avatar, display preferences" },
      { href: "/settings/security", label: "Security", icon: "🔒", desc: "Face ID, sessions & audit log" },
      { href: "/settings/privacy", label: "Privacy & Data", icon: "🛡️", desc: "GDPR, data exports & deletion" },
      { href: "/settings/notifications", label: "Notifications", icon: "🔔", desc: "Alerts & push preferences" },
    ],
  },
  {
    title: "Estate",
    items: [
      { href: "/properties", label: "Properties", icon: "🏠", desc: "Manage properties & parcels" },
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
  const [autoLock, setAutoLock] = useState("5 minutes");

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4">
        <h1 className="text-white font-bold text-2xl">Settings</h1>
      </div>

      {/* Profile card */}
      <div className="px-4 mb-5">
        <Link href="/settings/profile">
          <div
            className="rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 16px rgba(74,222,128,0.3)", border: "2px solid #4ADE80" }}
            >
              <span className="text-bg font-bold text-xl">A</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">Alex Owner</p>
              <p className="text-text-secondary text-xs">alex@prvio.earth</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
                <span className="text-accent-green text-[10px] font-medium">Pro · Member since 2024</span>
              </div>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </Link>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-5">
        {settingsSections.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">{section.title}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3.5 px-4 py-3.5 active:bg-white/[0.06] transition-colors"
                    style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-text-secondary text-xs">{item.desc}</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Auto lock */}
        <div>
          <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">Security</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center justify-between px-4 py-3.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div>
                <p className="text-white text-sm font-medium">Auto Lock</p>
                <p className="text-text-secondary text-xs">Lock app after inactivity</p>
              </div>
              <span className="text-accent-green text-sm font-medium">{autoLock}</span>
            </div>
            <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
              {["1 min", "5 minutes", "15 minutes", "1 hour"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setAutoLock(opt)}
                  className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
                  style={
                    autoLock === opt
                      ? { background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.35)", color: "#4ADE80" }
                      : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF" }
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sign out */}
        <button
          className="w-full rounded-2xl py-3.5 text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
        >
          Sign Out
        </button>

        <p className="text-text-tertiary text-center text-xs pb-4">PRVIO EARTH · v1.0.0 · Build 2026.06</p>
      </div>

      <BottomNav />
    </div>
  );
}
