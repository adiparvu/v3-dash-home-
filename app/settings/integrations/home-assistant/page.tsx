"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../../components/layout/StatusBar";

/**
 * Home Assistant / IoT integration gateway (spec: Digital Twin Layer →
 * "Synchronizes with Home Assistant and IoT integrations through backend-managed
 * contracts"; Backend Layer → integration gateways).
 */

type Device = { id: string; name: string; domain: string; zone: string; icon: string; lastSeen: string; online: boolean };

const DEVICES: Device[] = [
  { id: "d1", name: "Greenhouse Climate Controller", domain: "climate", zone: "Greenhouse", icon: "🌡️", lastSeen: "2s ago", online: true },
  { id: "d2", name: "Lake Pump Relay", domain: "switch", zone: "Lake", icon: "💧", lastSeen: "5s ago", online: true },
  { id: "d3", name: "Orchard Soil Probe", domain: "sensor", zone: "Orchard", icon: "🌱", lastSeen: "3s ago", online: true },
  { id: "d4", name: "Driveway Gate", domain: "cover", zone: "Driveway", icon: "🚧", lastSeen: "1m ago", online: true },
  { id: "d5", name: "Pond Aerator", domain: "switch", zone: "Smart Pond", icon: "🐟", lastSeen: "8s ago", online: true },
  { id: "d6", name: "House Energy Meter", domain: "sensor", zone: "House", icon: "⚡", lastSeen: "2s ago", online: true },
  { id: "d7", name: "Forest Weather Station", domain: "weather", zone: "Forest", icon: "🌤️", lastSeen: "12m ago", online: false },
];

const domainColor: Record<string, string> = {
  climate: "#F59E0B", switch: "#4ADE80", sensor: "#22D3EE", cover: "#9CA3AF", weather: "#7C3AED",
};

export default function HomeAssistantGatewayPage() {
  const [enabled, setEnabled] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2m ago");

  const online = DEVICES.filter((d) => d.online).length;

  const syncNow = () => {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      setLastSync("just now");
    }, 1200);
  };

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/settings/integrations" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>IoT Gateway</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* Gateway status */}
        <div className="rounded-3xl p-4" style={{ background: "rgba(34,211,238,0.07)", border: "1px solid rgba(34,211,238,0.20)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "rgba(34,211,238,0.15)", border: "1px solid rgba(34,211,238,0.3)" }}>🏠</div>
            <div className="flex-1">
              <p className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Home Assistant</p>
              <p className="text-text-secondary text-xs">{enabled ? `Connected · ${online}/${DEVICES.length} devices online` : "Disabled"}</p>
            </div>
            <button
              onClick={() => setEnabled((v) => !v)}
              aria-label="Toggle gateway"
              className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
              style={{ background: enabled ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
            >
              <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: enabled ? "calc(100% - 22px)" : "2px", background: enabled ? "#050A14" : "rgba(255,255,255,0.5)" }} />
            </button>
          </div>
          <p className="text-text-tertiary text-[11px] leading-relaxed">
            Devices are synchronized through backend-managed contracts — the client never
            talks to IoT devices directly. Telemetry flows into the Digital Twin and the
            event bus; commands are policy-validated before dispatch.
          </p>
        </div>

        {/* Sync flow */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between text-[11px] mb-3" style={{ color: "var(--text-2)" }}>
            {["IoT / HA", "Gateway", "Backend", "Digital Twin"].map((n, i, arr) => (
              <div key={n} className="flex items-center gap-1">
                <span className="px-2 py-1 rounded-lg" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>{n}</span>
                {i < arr.length - 1 && <span style={{ color: "var(--accent)" }}>→</span>}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Last sync</p>
              <p className="text-text-secondary text-xs">{syncing ? "Syncing…" : lastSync}</p>
            </div>
            <button onClick={syncNow} disabled={syncing || !enabled} className="text-xs font-medium px-4 py-2 rounded-full" style={{ background: enabled && !syncing ? "rgba(74,222,128,0.12)" : "var(--glass-bg)", border: "1px solid rgba(74,222,128,0.25)", color: enabled && !syncing ? "#4ADE80" : "var(--text-3)" }}>
              {syncing ? "Syncing…" : "Sync now"}
            </button>
          </div>
        </div>

        {/* Devices */}
        <div>
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Connected Devices ({DEVICES.length})</p>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {DEVICES.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < DEVICES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined, opacity: enabled ? 1 : 0.5 }}>
                <span className="text-lg w-7 text-center flex-shrink-0">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{d.name}</p>
                  <p className="text-text-secondary text-[11px]">{d.zone} · <span style={{ color: domainColor[d.domain] }}>{d.domain}</span></p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: d.online ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)", color: d.online ? "#4ADE80" : "#EF4444" }}>{d.online ? "online" : "offline"}</span>
                  <p className="text-text-tertiary text-[10px] mt-0.5">{d.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Link href="/twin" className="block w-full text-center py-3.5 rounded-2xl font-semibold text-sm" style={{ background: "var(--accent)", color: "#08111E" }}>
          Open Digital Twin
        </Link>
      </div>
    </div>
  );
}
