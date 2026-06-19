"use client";

import { useMemo } from "react";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import EstateScene, { type TwinNode } from "../../components/twin3d/EstateScene";
import { type MetricStatus } from "../../lib/monitor/types";
import { POND_WATER, ORCHARD, GREENHOUSE, GARAGE } from "../../lib/monitor/presets";
import { useTwinStatuses, type StatusConfig } from "../../lib/twin/useTwinStatuses";
import { useEnergyLive } from "../../lib/twin/energyLive";

const NODES: TwinNode[] = [
  { id: "house", label: "Casă", route: "/zones/house", kind: "box", pos: [0, 0], size: [3.4, 2.6, 3.4] },
  { id: "lake", label: "Heleșteu", route: "/zones/lake", kind: "water", pos: [-7, 4] },
  { id: "orchard", label: "Livadă", route: "/zones/orchard", kind: "trees", pos: [7, 3.5] },
  { id: "greenhouse", label: "Greenhouse", route: "/zones/greenhouse", kind: "dome", pos: [6, -5] },
  { id: "garage", label: "Garaj", route: "/zones/garage", kind: "box", pos: [-6, -5], size: [3.2, 1.8, 2.6] },
  { id: "garden", label: "Grădină", route: "/zones/garden", kind: "trees", pos: [0, 7] },
];

// Sensor-backed nodes → derive status from live readings vs each preset's bands.
const SENSOR_CONFIGS: StatusConfig[] = [
  { id: "lake", zoneType: "lake", specs: POND_WATER },
  { id: "orchard", zoneType: "orchard", specs: ORCHARD },
  { id: "greenhouse", zoneType: "greenhouse", specs: GREENHOUSE },
  { id: "garage", zoneType: "garage", specs: GARAGE },
];
// Demo fallback when no live data flows.
const FALLBACK: Record<string, MetricStatus> = { orchard: "warn" };

const DOT: Record<MetricStatus, string> = { ok: "#4ADE80", warn: "#F59E0B", alert: "#F97316" };
const LEGEND = [
  { label: "OK", color: "#4ADE80" },
  { label: "Atenție", color: "#F59E0B" },
  { label: "Alertă", color: "#F97316" },
];

export default function Twin3DPage() {
  const { statuses, source } = useTwinStatuses(SENSOR_CONFIGS, FALLBACK);
  const { s } = useEnergyLive();

  // House status is energy-derived: low battery reserve raises a warning.
  const statusesWithEnergy = useMemo<Record<string, MetricStatus>>(() => {
    const house: MetricStatus = s.batteryPct < 20 ? "alert" : s.batteryPct < 40 ? "warn" : "ok";
    return { ...statuses, house };
  }, [statuses, s.batteryPct]);

  return (
    <div className="min-h-screen pb-28" style={{ color: "var(--text-1)" }}>
      <StatusBar />
      <div className="px-5 pt-1 pb-3 flex items-end justify-between">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Digital Twin</h1>
          <p className="text-text-secondary text-xs">Model 3D live · rotește, mărește, atinge un modul</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-semibold mb-1" style={{ color: source === "live" ? "#4ADE80" : "#9CA3AF" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: source === "live" ? "#4ADE80" : "#9CA3AF" }} />
          {source === "live" ? "Live" : "Simulat"}
        </span>
      </div>

      <div className="px-4">
        <EstateScene nodes={NODES} statuses={statusesWithEnergy} height={380} />

        <div className="flex items-center justify-center gap-4 mt-3">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-2)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>

        <p className="text-xs font-medium uppercase tracking-wide mt-6 mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Module</p>
        <div className="grid grid-cols-2 gap-2.5">
          {NODES.map((n) => (
            <a key={n.id} href={n.route} className="flex items-center justify-between rounded-2xl p-3.5 liquid-glass">
              <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{n.label}</span>
              <span className="w-2 h-2 rounded-full" style={{ background: DOT[statusesWithEnergy[n.id] ?? "ok"] }} />
            </a>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
