"use client";

/**
 * Lightweight, dependency-free GIS surface.
 *
 * Renders polygon features (e.g. `zones.boundary_geojson` / `parcels`) into an
 * SVG, auto-fitting the bounding box of all coordinates to the viewport (with a
 * geographic Y-flip so north is up). Each feature is filled by its status colour
 * and labelled at its centroid — reusable for heleșteu basins, orchard parcels,
 * irrigation zones, etc. A real tile basemap (MapLibre) can layer under this
 * later without changing the feature model.
 */
import { useState } from "react";
import { type MetricStatus, STATUS_COLOR } from "../../lib/monitor/types";

export type MapFeature = {
  id: string;
  label: string;
  /** Ring of [x, y] (or [lon, lat]) coordinates. */
  polygon: [number, number][];
  status?: MetricStatus;
  sub?: string;
};

const W = 320;
const H = 200;
const PAD = 16;

function centroid(pts: [number, number][]): [number, number] {
  const n = pts.length;
  const sx = pts.reduce((a, p) => a + p[0], 0);
  const sy = pts.reduce((a, p) => a + p[1], 0);
  return [sx / n, sy / n];
}

export default function ZoneMap({ features, caption }: { features: MapFeature[]; caption?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const all = features.flatMap((f) => f.polygon);
  const xs = all.map((p) => p[0]);
  const ys = all.map((p) => p[1]);
  const minX = Math.min(...xs), maxX = Math.max(...xs);
  const minY = Math.min(...ys), maxY = Math.max(...ys);
  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const scale = Math.min((W - PAD * 2) / spanX, (H - PAD * 2) / spanY);
  const offX = (W - spanX * scale) / 2;
  const offY = (H - spanY * scale) / 2;
  // Map to screen; flip Y so larger latitude renders higher.
  const tx = (x: number) => offX + (x - minX) * scale;
  const ty = (y: number) => H - (offY + (y - minY) * scale);

  return (
    <div className="rounded-2xl overflow-hidden liquid-glass p-3">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ background: "radial-gradient(circle at 50% 40%, rgba(34,211,238,0.06), transparent 70%)" }}>
        {/* subtle grid */}
        {Array.from({ length: 7 }).map((_, i) => (
          <line key={`v${i}`} x1={(W / 6) * i} y1={0} x2={(W / 6) * i} y2={H} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={(H / 4) * i} x2={W} y2={(H / 4) * i} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        ))}
        {features.map((f) => {
          const color = STATUS_COLOR[f.status ?? "ok"];
          const path = f.polygon.map((p) => `${tx(p[0])},${ty(p[1])}`).join(" ");
          const [cx, cy] = centroid(f.polygon);
          const on = active === f.id;
          return (
            <g key={f.id} onClick={() => setActive(on ? null : f.id)} style={{ cursor: "pointer" }}>
              <polygon points={path} fill={`${color}22`} stroke={color} strokeWidth={on ? 2.5 : 1.5} />
              <circle cx={tx(cx)} cy={ty(cy)} r={on ? 4 : 3} fill={color} />
              <text x={tx(cx)} y={ty(cy) - 8} textAnchor="middle" fontSize="9" fill="var(--text-1)" style={{ fontWeight: 600 }}>{f.label}</text>
              {f.sub && <text x={tx(cx)} y={ty(cy) + 14} textAnchor="middle" fontSize="8" fill="var(--text-3)">{f.sub}</text>}
            </g>
          );
        })}
      </svg>
      {caption && <p className="text-[10px] mt-1.5 text-center" style={{ color: "var(--text-3)" }}>{caption}</p>}
    </div>
  );
}
