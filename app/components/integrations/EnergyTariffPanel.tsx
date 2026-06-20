"use client";

import { useState } from "react";
import { useEnergyTariff } from "../../lib/useEnergyTariff";
import { ZONES, type TariffZone } from "../../lib/energyTariff";

/** Live energy-tariff panel — real day-ahead spot prices for Belgium & Romania. */
export default function EnergyTariffPanel() {
  const [zone, setZone] = useState<TariffZone>("BE");
  const { data, loading } = useEnergyTariff(zone);

  const cheapest = data.cheapestAt
    ? new Date(data.cheapestAt * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "—";

  // Bar chart bounds.
  const prices = data.points.map((p) => p.eurMwh);
  const lo = prices.length ? Math.min(...prices) : 0;
  const hi = prices.length ? Math.max(...prices) : 1;
  const span = Math.max(1, hi - lo);

  return (
    <div className="space-y-4">
      {/* Zone selector — Belgium / Romania */}
      <div className="flex gap-1 p-0.5 rounded-full" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
        {(Object.keys(ZONES) as TariffZone[]).map((z) => (
          <button
            key={z}
            onClick={() => setZone(z)}
            className="flex-1 text-xs font-medium py-1.5 rounded-full transition-colors"
            style={{ background: zone === z ? "var(--accent)" : "transparent", color: zone === z ? "var(--bg-1)" : "var(--text-2)" }}
          >
            {ZONES[z].flag} {ZONES[z].label}
          </button>
        ))}
      </div>

      {/* Current price + stats */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "Now", value: data.current, accent: true },
          { label: "Min", value: data.min },
          { label: "Avg", value: data.avg },
          { label: "Max", value: data.max },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3 text-center liquid-glass">
            <p className="font-bold text-sm" style={{ color: s.accent ? "var(--accent)" : "var(--text-1)" }}>{s.value.toFixed(1)}</p>
            <p className="text-text-secondary text-[10px] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
      <p className="text-text-tertiary text-[11px] text-center">ct/kWh · cheapest hour around <span style={{ color: "var(--accent)" }}>{cheapest}</span></p>

      {/* Day-ahead bar chart */}
      {data.points.length > 0 && (
        <div className="rounded-2xl p-3 liquid-glass">
          <div className="flex items-end gap-[2px]" style={{ height: 72 }}>
            {data.points.map((p) => {
              const h = 12 + ((p.eurMwh - lo) / span) * 56;
              const isCheapest = p.t === data.cheapestAt;
              return (
                <div
                  key={p.t}
                  className="flex-1 rounded-t-sm"
                  style={{ height: h, background: isCheapest ? "var(--accent)" : "rgba(255,255,255,0.18)" }}
                  title={`${new Date(p.t * 1000).getHours()}:00 · ${(p.eurMwh * 0.1).toFixed(1)} ct/kWh`}
                />
              );
            })}
          </div>
          <p className="text-text-tertiary text-[10px] mt-2 text-center">
            {loading ? "Loading…" : data.source === "live" ? "Live day-ahead · Energy-Charts" : "Cached curve"}
          </p>
        </div>
      )}
    </div>
  );
}
