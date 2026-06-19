"use client";

/**
 * Revolut-style line chart.
 *
 * Smooth curve + gradient area fade + soft glow, no axis clutter, and a
 * drag/hover crosshair that snaps to the nearest sample with a value pill — the
 * signature Revolut graph interaction. Supports an optional second (comparison)
 * series rendered as a thin dashed line. Pure SVG, no chart library.
 */
import { useId, useRef, useState } from "react";
import { pointsFromValues, smoothFromPoints, type Pt } from "../../lib/charts";

export type RevolutSeries = { values: number[]; color: string; dashed?: boolean; label?: string };

const W = 320;
const PAD = 6;

export default function RevolutChart({
  series,
  height = 120,
  max,
  formatValue = (v) => v.toFixed(1),
  formatX,
  className,
}: {
  series: RevolutSeries[];
  height?: number;
  max?: number;
  formatValue?: (v: number) => string;
  formatX?: (i: number) => string;
  className?: string;
}) {
  const gid = useId().replace(/[:]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [active, setActive] = useState<number | null>(null);

  const primary = series[0];
  const n = primary?.values.length ?? 0;
  const H = height;

  const ptsFor = (vals: number[]): Pt[] => pointsFromValues(vals, W, H, PAD, max);
  const primaryPts = primary ? ptsFor(primary.values) : [];

  const onMove = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg || n < 2) return;
    const rect = svg.getBoundingClientRect();
    const xRatio = (clientX - rect.left) / rect.width;
    const idx = Math.round(Math.min(1, Math.max(0, xRatio)) * (n - 1));
    setActive(idx);
  };

  const activePt = active !== null && primaryPts[active] ? primaryPts[active] : null;

  return (
    <div className={className} style={{ position: "relative" }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full touch-none select-none"
        style={{ height: H, overflow: "visible" }}
        preserveAspectRatio="none"
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); onMove(e.clientX); }}
        onPointerMove={(e) => { if (e.buttons || e.pointerType === "mouse") onMove(e.clientX); }}
        onPointerUp={() => setActive(null)}
        onPointerLeave={() => setActive(null)}
      >
        <defs>
          {series.map((s, i) => (
            <linearGradient key={i} id={`${gid}-fill-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
              <stop offset="60%" stopColor={s.color} stopOpacity="0.06" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>

        {series.map((s, i) => {
          const pts = ptsFor(s.values);
          const line = smoothFromPoints(pts);
          if (!line) return null;
          const area = `${line} L${(W - PAD).toFixed(1)},${(H - PAD).toFixed(1)} L${PAD.toFixed(1)},${(H - PAD).toFixed(1)} Z`;
          return (
            <g key={i}>
              {!s.dashed && <path d={area} fill={`url(#${gid}-fill-${i})`} stroke="none" />}
              <path
                d={line}
                fill="none"
                stroke={s.color}
                strokeWidth={s.dashed ? 1.5 : 2.25}
                strokeDasharray={s.dashed ? "4 4" : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                style={s.dashed ? undefined : { filter: `drop-shadow(0 0 5px ${s.color}66)` }}
              />
            </g>
          );
        })}

        {/* Crosshair */}
        {activePt && (
          <g>
            <line x1={activePt[0]} y1={0} x2={activePt[0]} y2={H} stroke="var(--text-3)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={activePt[0]} cy={activePt[1]} r="4.5" fill={primary.color} stroke="var(--bg-1)" strokeWidth="2" />
          </g>
        )}
      </svg>

      {/* Value pill */}
      {active !== null && primary && primary.values[active] !== undefined && activePt && (
        <div
          className="absolute -translate-x-1/2 px-2 py-1 rounded-lg text-[11px] font-semibold pointer-events-none"
          style={{
            left: `${(activePt[0] / W) * 100}%`,
            top: 0,
            background: "rgba(8,17,30,0.9)",
            border: "1px solid var(--glass-border)",
            color: "var(--text-1)",
            whiteSpace: "nowrap",
          }}
        >
          {formatValue(primary.values[active])}
          {formatX && <span style={{ color: "var(--text-3)", marginLeft: 6 }}>{formatX(active)}</span>}
        </div>
      )}
    </div>
  );
}
