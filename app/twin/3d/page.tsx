"use client";

import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import EstateScene, { type TwinNode } from "../../components/twin3d/EstateScene";
import { type MetricStatus } from "../../lib/monitor/types";

const NODES: TwinNode[] = [
  { id: "house", label: "Casă", route: "/zones/house", kind: "box", pos: [0, 0], size: [3.4, 2.6, 3.4] },
  { id: "lake", label: "Heleșteu", route: "/zones/lake", kind: "water", pos: [-7, 4] },
  { id: "orchard", label: "Livadă", route: "/zones/orchard", kind: "trees", pos: [7, 3.5] },
  { id: "greenhouse", label: "Greenhouse", route: "/zones/greenhouse", kind: "dome", pos: [6, -5] },
  { id: "garage", label: "Garaj", route: "/zones/driveway", kind: "box", pos: [-6, -5], size: [3.2, 1.8, 2.6] },
  { id: "garden", label: "Grădină", route: "/zones/garden", kind: "trees", pos: [0, 7] },
];

// Demo live status per node (drive from useEnergyLive / sensors later).
const STATUSES: Record<string, MetricStatus> = { orchard: "warn", greenhouse: "ok", lake: "ok" };

const LEGEND: { label: string; color: string }[] = [
  { label: "OK", color: "#4ADE80" },
  { label: "Atenție", color: "#F59E0B" },
  { label: "Alertă", color: "#F97316" },
];

export default function Twin3DPage() {
  return (
    <div className="min-h-screen pb-28" style={{ color: "var(--text-1)" }}>
      <StatusBar />
      <div className="px-5 pt-1 pb-3">
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Digital Twin</h1>
        <p className="text-text-secondary text-xs">Model 3D live al proprietății · rotește, mărește, atinge un modul</p>
      </div>

      <div className="px-4">
        <EstateScene nodes={NODES} statuses={STATUSES} height={380} />

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-3">
          {LEGEND.map((l) => (
            <span key={l.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-2)" }}>
              <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
        </div>

        {/* Module quick-links */}
        <p className="text-xs font-medium uppercase tracking-wide mt-6 mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Module</p>
        <div className="grid grid-cols-2 gap-2.5">
          {NODES.map((n) => (
            <a key={n.id} href={n.route} className="flex items-center justify-between rounded-2xl p-3.5 liquid-glass">
              <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{n.label}</span>
              <span className="w-2 h-2 rounded-full" style={{ background: { ok: "#4ADE80", warn: "#F59E0B", alert: "#F97316" }[STATUSES[n.id] ?? "ok"] }} />
            </a>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
