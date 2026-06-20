"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../../components/layout/StatusBar";
import { useDevices, type Protocol } from "../../../lib/useDevices";
import { FEATURES } from "../../../lib/features";

/**
 * Home Assistant / IoT integration gateway: synchronizes with Home Assistant and
 * IoT integrations through backend-managed contracts (Backend Layer → integration
 * gateways).
 */

const PROTOCOL_COLOR: Record<Protocol, string> = {
  Matter: "#4ADE80", Thread: "#22D3EE", Zigbee: "#F59E0B", "Z-Wave": "#7C3AED", "Wi-Fi": "#9CA3AF",
};

const domainColor: Record<string, string> = {
  climate: "#F59E0B", switch: "#4ADE80", sensor: "#22D3EE", cover: "#9CA3AF", weather: "#7C3AED",
};

export default function HomeAssistantGatewayPage() {
  const [enabled, setEnabled] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState("2m ago");
  const { source, devices: DEVICES } = useDevices();

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
            talks to IoT devices directly. Telemetry flows into the live dashboard and the
            event bus; commands are policy-validated before dispatch.
          </p>
        </div>

        {/* Sync flow */}
        <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          <div className="flex items-center justify-between text-[11px] mb-3" style={{ color: "var(--text-2)" }}>
            {["IoT / HA", "Gateway", "Backend", "Dashboard"].map((n, i, arr) => (
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
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Connected Devices ({DEVICES.length})</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={source === "remote"
              ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
              : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>
              {source === "remote" ? "Synced" : "Demo"}
            </span>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
            {DEVICES.map((d, i) => (
              <div key={d.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < DEVICES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined, opacity: enabled ? 1 : 0.5 }}>
                <span className="text-lg w-7 text-center flex-shrink-0">{d.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{d.name}</p>
                  <p className="text-text-secondary text-[11px]">{d.zone} · <span style={{ color: domainColor[d.domain] }}>{d.domain}</span></p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${PROTOCOL_COLOR[d.protocol]}22`, color: PROTOCOL_COLOR[d.protocol], border: `1px solid ${PROTOCOL_COLOR[d.protocol]}40` }}>{d.protocol}</span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={d.local
                      ? { background: "rgba(74,222,128,0.12)", color: "#4ADE80" }
                      : { background: "rgba(245,158,11,0.12)", color: "#F59E0B" }}>{d.local ? "Local" : "Cloud"}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: d.online ? "rgba(74,222,128,0.12)" : "rgba(239,68,68,0.12)", color: d.online ? "#4ADE80" : "#EF4444" }}>{d.online ? "online" : "offline"}</span>
                  <p className="text-text-tertiary text-[10px] mt-0.5">{d.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {FEATURES.floorplan && (
          <Link href="/twin/floorplan" className="block w-full text-center py-3.5 rounded-2xl font-semibold text-sm" style={{ background: "var(--accent)", color: "#08111E" }}>
            Open Floorplan
          </Link>
        )}
      </div>
    </div>
  );
}
