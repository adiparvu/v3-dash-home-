"use client";

import { useAirQuality } from "../../lib/useAirQuality";
import { aqiCategory, pollenRisk, POLLUTANTS, POLLEN_TYPES } from "../../lib/airQuality";

/** Live air-quality panel — real European AQI for the visitor's location. */
export default function AirQualityPanel() {
  const { data, loading } = useAirQuality();
  const band = aqiCategory(data.aqi);
  const pollenMax = Math.max(...Object.values(data.pollen));
  const pollen = pollenRisk(pollenMax);

  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-4 liquid-glass flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0" style={{ background: `${band.color}1A`, border: `1px solid ${band.color}40` }}>
          <span className="font-bold text-2xl leading-none" style={{ color: band.color }}>{data.aqi}</span>
          <span className="text-[8px] mt-0.5" style={{ color: "var(--text-3)" }}>AQI</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-base" style={{ color: band.color }}>{band.label}</p>
          <p className="text-text-secondary text-xs">{data.location}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: data.source === "live" ? "var(--accent)" : "var(--text-3)" }} />
            <span className="text-[10px]" style={{ color: "var(--text-3)" }}>{loading ? "Locating…" : data.source === "live" ? "Live · Open-Meteo" : "Cached"}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="rounded-2xl p-3 text-center liquid-glass">
            <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{data.pollutants[p.key]}</p>
            <p className="text-text-secondary text-[10px] mt-0.5">{p.label}</p>
            <p className="text-text-tertiary text-[9px]">{p.unit}</p>
          </div>
        ))}
      </div>
      {/* Pollen */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Pollen</p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${pollen.color}1A`, color: pollen.color }}>{pollen.label}</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {POLLEN_TYPES.map((p) => (
            <div key={p.key} className="rounded-2xl p-3 text-center liquid-glass">
              <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{data.pollen[p.key]}</p>
              <p className="text-text-secondary text-[10px] mt-0.5">{p.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-text-tertiary text-[11px] text-center leading-relaxed">
        Air quality &amp; pollen are fetched for your current location (or the estate if location is unavailable).
      </p>
    </div>
  );
}
