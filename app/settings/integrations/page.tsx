"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

/**
 * Integrations hub — connected services + a categorized catalog of available
 * integrations across smart home, security, finance, hospitality and energy.
 * Everything that touches devices is routed through the backend-managed gateway
 * (see /settings/integrations/home-assistant).
 */

type Status =
  | { kind: "connected"; detail: string }
  | { kind: "soon" }
  | { kind: "action"; label: string; href?: string }
  | { kind: "via"; label: string };

type Integration = { id: string; name: string; desc: string; icon: string; color: string; href?: string; status: Status };

type Section = { title: string; items: Integration[] };

const sections: Section[] = [
  {
    title: "Smart Home & Standards",
    items: [
      { id: "ha", name: "Home Assistant", desc: "142 entities · gateway for all devices", icon: "🏠", color: "#22D3EE", href: "/settings/integrations/home-assistant", status: { kind: "connected", detail: "Synced 2m ago" } },
      { id: "matter", name: "Matter & Thread", desc: "Compatible Matter devices work automatically via Apple Home.", icon: "⚙️", color: "#4ADE80", href: "/settings/integrations/home-assistant", status: { kind: "via", label: "Via HomeKit" } },
      { id: "hue", name: "Philips Hue & IKEA", desc: "Lighting & sensors over Zigbee / Matter", icon: "💡", color: "#F59E0B", href: "/settings/integrations/home-assistant", status: { kind: "connected", detail: "Via gateway" } },
      { id: "sonos", name: "Sonos", desc: "Multi-room audio & announcements", icon: "🔊", color: "#9CA3AF", status: { kind: "soon" } },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "cameras", name: "Security Cameras", desc: "View live feeds and motion alerts from your cameras.", icon: "📷", color: "#7C3AED", href: "/cameras", status: { kind: "connected", detail: "6 devices" } },
      { id: "ring", name: "Ring Doorbell", desc: "See who's at the door and get motion alerts.", icon: "🔔", color: "#22D3EE", status: { kind: "soon" } },
      { id: "arlo", name: "Arlo / Eufy", desc: "Integrate wireless security cameras and sensors.", icon: "🎥", color: "#4ADE80", status: { kind: "soon" } },
    ],
  },
  {
    title: "Finance & Banking",
    items: [
      { id: "revolut", name: "Revolut / Wise", desc: "Auto-import home expenses from your bank transactions.", icon: "💳", color: "#7C3AED", status: { kind: "soon" } },
      { id: "openbanking", name: "Open Banking", desc: "Connect your bank for automatic expense categorization.", icon: "🏦", color: "#22D3EE", status: { kind: "soon" } },
      { id: "receipts", name: "Receipt Scanner", desc: "Scan and auto-categorize home improvement receipts.", icon: "🧾", color: "#4ADE80", status: { kind: "action", label: "Scan Now" } },
    ],
  },
  {
    title: "Rentals & Hospitality",
    items: [
      { id: "booking", name: "Booking.com", desc: "Manage short-term rental bookings and guest access.", icon: "🏨", color: "#22D3EE", status: { kind: "soon" } },
      { id: "airbnb", name: "Airbnb", desc: "Sync Airbnb calendar and automate guest check-ins.", icon: "🏡", color: "#F97316", status: { kind: "soon" } },
      { id: "vrbo", name: "VRBO / HomeAway", desc: "Connect VRBO listings to track occupancy and revenue.", icon: "🛏️", color: "#4ADE80", status: { kind: "soon" } },
    ],
  },
  {
    title: "Energy & Environment",
    items: [
      { id: "energy", name: "Energy Provider", desc: "Import utility bills automatically from your energy supplier.", icon: "💡", color: "#F59E0B", status: { kind: "soon" } },
      { id: "solar", name: "Solar / PV System", desc: "Monitor solar panel output and energy savings.", icon: "☀️", color: "#F59E0B", href: "/twin/energy", status: { kind: "connected", detail: "Live" } },
      { id: "ev", name: "EV Charging", desc: "Track charging sessions and energy costs for your EV.", icon: "🚗", color: "#22D3EE", href: "/twin/energy", status: { kind: "connected", detail: "Live" } },
      { id: "water", name: "Smart Water Meter", desc: "Monitor water consumption and detect leaks early.", icon: "💧", color: "#22D3EE", status: { kind: "soon" } },
      { id: "weather", name: "OpenWeather", desc: "Forecast & climate data", icon: "🌤️", color: "#F59E0B", status: { kind: "connected", detail: "Active" } },
      { id: "rachio", name: "Rachio Irrigation", desc: "4 zones · auto schedule", icon: "🌱", color: "#4ADE80", status: { kind: "connected", detail: "Connected" } },
    ],
  },
];

const connectedCount = sections.reduce((n, s) => n + s.items.filter((i) => i.status.kind === "connected" || i.status.kind === "via").length, 0);

function StatusPill({ status }: { status: Status }) {
  if (status.kind === "connected") {
    return <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>● {status.detail}</span>;
  }
  if (status.kind === "via") {
    return <span className="text-[10px] font-semibold px-2 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>{status.label}</span>;
  }
  if (status.kind === "action") {
    return <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "0.5px solid rgba(34,211,238,0.3)" }}>{status.label}</span>;
  }
  return <span className="text-[10px] font-medium px-2 py-1 rounded-full flex-shrink-0" style={{ background: "var(--glass-bg)", color: "var(--text-3)" }}>Soon</span>;
}

export default function IntegrationsPage() {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = sections
    .map((s) => ({ ...s, items: s.items.filter((i) => !q || i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)) }))
    .filter((s) => s.items.length > 0);

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
            <p className="text-text-secondary text-xs">{connectedCount} services connected · more coming soon</p>
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
        {visible.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{section.title}</p>
            <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
              {section.items.map((item, i) => {
                const inner = (
                  <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}>{item.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{item.name}</p>
                      <p className="text-text-secondary text-xs leading-snug mt-0.5">{item.desc}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>
                );
                return item.href ? (
                  <Link key={item.id} href={item.href} className="block active:bg-white/[0.04] transition-colors">{inner}</Link>
                ) : (
                  <div key={item.id}>{inner}</div>
                );
              })}
            </div>
          </div>
        ))}

        {visible.length === 0 && (
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
