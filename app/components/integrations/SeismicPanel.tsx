"use client";

import { useEarthquakes } from "../../lib/useEarthquakes";
import { quakeSeverity } from "../../lib/earthquakes";

/** Live seismic panel — recent earthquakes near the location (USGS). */
export default function SeismicPanel() {
  const { data, loading } = useEarthquakes();
  const band = quakeSeverity(data.maxMagnitude);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-4 liquid-glass flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `${band.color}1A`, border: `1px solid ${band.color}40` }}>
          <span className="font-bold text-2xl leading-none" style={{ color: band.color }}>{data.maxMagnitude.toFixed(1)}</span>
          <span className="text-[8px] mt-0.5" style={{ color: "var(--text-3)" }}>MAX M</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base" style={{ color: band.color }}>{data.quakes.length === 0 ? "All quiet" : band.label}</p>
          <p className="text-text-secondary text-xs">{data.quakes.length} events · 30 days · {data.location}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: data.source === "live" ? "var(--accent)" : "var(--text-3)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-3)" }}>{loading ? "Locating…" : data.source === "live" ? "Live · USGS" : "Cached"}</span>
          </div>
        </div>
      </div>

      {data.quakes.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {data.quakes.slice(0, 6).map((q, i, arr) => {
            const b = quakeSeverity(q.magnitude);
            return (
              <div key={q.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <span className="font-bold text-sm w-10 text-center flex-shrink-0" style={{ color: b.color }}>{q.magnitude.toFixed(1)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{q.place}</p>
                  <p className="text-text-secondary text-[11px]">{q.distanceKm} km away · {q.depthKm} km deep</p>
                </div>
                <span className="text-text-tertiary text-[10px] flex-shrink-0">{new Date(q.time).toLocaleDateString()}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
