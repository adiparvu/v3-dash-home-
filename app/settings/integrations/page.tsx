"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const connected = [
  { id: "ha", name: "Home Assistant", desc: "142 entities · synced 2m ago", icon: "🏠", color: "#22D3EE", status: "Connected" },
  { id: "weather", name: "OpenWeather", desc: "Forecast & climate data", icon: "🌤️", color: "#F59E0B", status: "Connected" },
  { id: "rachio", name: "Rachio Irrigation", desc: "4 zones · auto schedule", icon: "💧", color: "#4ADE80", status: "Connected" },
  { id: "ring", name: "Ring Cameras", desc: "6 devices · motion alerts", icon: "📷", color: "#7C3AED", status: "Connected" },
];

const available = [
  { id: "ecobee", name: "Ecobee", desc: "Smart thermostats", icon: "🌡️" },
  { id: "tesla", name: "Tesla Powerwall", desc: "Energy storage & solar", icon: "🔋" },
  { id: "netatmo", name: "Netatmo", desc: "Weather station & air quality", icon: "🌬️" },
  { id: "sonos", name: "Sonos", desc: "Multi-room audio", icon: "🔊" },
];

export default function IntegrationsPage() {
  const [conns, setConns] = useState<Record<string, boolean>>(
    Object.fromEntries(connected.map((c) => [c.id, true]))
  );

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
            <p className="text-text-secondary text-xs">4 services connected · 152 entities</p>
          </div>
        </div>

        {/* Connected */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Connected</p>
          <div className="space-y-2">
            {connected.map((c) => (
              <div key={c.id} className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${c.color}18`, border: `1px solid ${c.color}30` }}>
                  {c.icon}
                </div>
                {c.id === "ha" ? (
                  <Link href="/settings/integrations/home-assistant" className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{c.name}</p>
                    <p className="text-text-secondary text-xs">{c.desc} · manage gateway →</p>
                  </Link>
                ) : (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{c.name}</p>
                    <p className="text-text-secondary text-xs">{c.desc}</p>
                  </div>
                )}
                <button
                  onClick={() => setConns((s) => ({ ...s, [c.id]: !s[c.id] }))}
                  className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
                  style={{ background: conns[c.id] ? "var(--accent)" : "var(--glass-border)" }}
                >
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: conns[c.id] ? "calc(100% - 22px)" : "2px", background: conns[c.id] ? "var(--bg-1)" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Available */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Discover</p>
          <div className="grid grid-cols-2 gap-2.5">
            {available.map((a) => (
              <div key={a.id} className="liquid-glass rounded-2xl p-3.5 flex flex-col gap-2">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{a.name}</p>
                  <p className="text-text-secondary text-[11px] leading-tight mt-0.5">{a.desc}</p>
                </div>
                <button className="mt-1 rounded-xl py-1.5 text-xs font-medium active:scale-95 transition-transform" style={{ background: "rgba(74,222,128,0.12)", color: "var(--accent)", border: "0.5px solid rgba(74,222,128,0.25)" }}>
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* API access */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Developer</p>
          <Link href="#">
            <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3.5 active:scale-[0.98] transition-transform">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-2)" }}>
                  <path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>API Keys & Webhooks</p>
                <p className="text-text-secondary text-xs">Build custom automations</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
