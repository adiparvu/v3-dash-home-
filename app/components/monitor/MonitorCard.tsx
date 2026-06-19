"use client";

/**
 * A single metric tile for the Zone-Monitoring framework: icon + label, the live
 * value with its unit, a status dot coloured by threshold band, and a sparkline
 * of recent readings. Purely presentational — fed by useZoneSensors.
 */
import { useId } from "react";
import { type MetricReading, STATUS_COLOR } from "../../lib/monitor/types";
import { smoothPath, smoothAreaPath, lastPoint } from "../../lib/charts";

// Revolut-style mini sparkline: smooth curve, gradient fade, endpoint dot.
function Sparkline({ series, color }: { series: number[]; color: string }) {
  const gid = useId().replace(/[:]/g, "");
  if (series.length < 2) return null;
  const w = 100;
  const h = 28;
  const pad = 2;
  const line = smoothPath(series, w, h, pad);
  const area = smoothAreaPath(series, w, h, pad);
  const end = lastPoint(series, w, h, pad);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className="w-full h-7 mt-2" style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`spark-${gid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.30" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${gid})`} stroke="none" />
      <path d={line} fill="none" stroke={color} strokeWidth="1.75" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px ${color}55)` }} />
      {end && <circle cx={end[0]} cy={end[1]} r="1.8" fill={color} />}
    </svg>
  );
}

export default function MonitorCard({ m }: { m: MetricReading }) {
  const color = STATUS_COLOR[m.status];
  const decimals = m.decimals ?? (Math.abs(m.value) >= 100 ? 0 : 1);
  return (
    <div className="rounded-2xl p-3.5 liquid-glass" style={{ borderColor: m.status === "ok" ? undefined : `${color}40` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          {m.icon && <span className="text-base flex-shrink-0">{m.icon}</span>}
          <span className="text-xs truncate" style={{ color: "var(--text-2)" }}>{m.label}</span>
        </div>
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-xl font-bold" style={{ color: "var(--text-1)" }}>{m.value.toFixed(decimals)}</span>
        {m.unit && <span className="text-xs" style={{ color: "var(--text-3)" }}>{m.unit}</span>}
      </div>
      <Sparkline series={m.series} color={color} />
    </div>
  );
}
