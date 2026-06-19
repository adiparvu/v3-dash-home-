"use client";

/**
 * Intraday energy history for the Energie / Impact tabs.
 *
 * When Supabase is configured it pulls the durable `energy_readings` time-series
 * (GET /api/v1/twin/energy?history) and derives the solar/home series plus the
 * energy-autonomy split; otherwise — or when empty / signed out — it falls back
 * to a deterministic demo day. A `source` flag ("synced" | "demo") badges which.
 */
import { useEffect, useState } from "react";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

type Row = { solar: number; home: number; vehicle: number; battery: number; grid: number };
export type Autonomy = { total: number; solar: number; battery: number; grid: number };
export type EnergyHistory = { solar: number[]; home: number[]; forecast: number[]; autonomy: Autonomy; source: "synced" | "demo" };

const r1 = (v: number) => Math.round(v * 10) / 10;

// Clear-sky solar forecast (theoretical max per hour) — predicted vs actual.
const PEAK_SOLAR = 6.8;
export const SOLAR_FORECAST: number[] = Array.from({ length: 24 }, (_, h) =>
  r1(Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)) ** 1.15 * PEAK_SOLAR),
);

// Deterministic 24-hour demo day with a simple power balance (no randomness).
function buildDemoDay(): Row[] {
  let pct = 58;
  const rows: Row[] = [];
  for (let h = 0; h < 24; h++) {
    const solar = r1(Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)) * 6.5);
    const home = r1(0.45 + 0.8 * Math.exp(-((h - 8) ** 2) / 5) + 1.1 * Math.exp(-((h - 20) ** 2) / 6));
    const vehicle = h >= 10 && h <= 15 && solar > 2 ? 1.4 : 0;
    const consumption = home + vehicle;
    const net = solar - consumption;
    let battery = 0;
    if (net > 0) {
      const c = pct < 100 ? Math.min(net, 5) : 0;
      battery = c; pct = Math.min(100, pct + c * 1.5);
    } else if (net < 0) {
      const d = pct > 20 ? Math.min(-net, 5) : 0;
      battery = -d; pct = Math.max(0, pct - d * 1.5);
    }
    rows.push({ solar, home, vehicle, battery, grid: r1(consumption - solar + battery) });
  }
  return rows;
}

function autonomyOf(rows: Row[]): Autonomy {
  let cons = 0, gridIn = 0, batt = 0;
  for (const r of rows) {
    cons += r.home + r.vehicle;
    gridIn += Math.max(0, r.grid);
    batt += Math.max(0, -r.battery);
  }
  if (cons <= 0) return { total: 0, solar: 0, battery: 0, grid: 0 };
  const grid = Math.round((gridIn / cons) * 100);
  const battery = Math.min(100 - grid, Math.round((batt / cons) * 100));
  const solar = Math.max(0, 100 - grid - battery);
  return { total: 100 - grid, solar, battery, grid };
}

const DEMO_ROWS = buildDemoDay();
const DEMO: EnergyHistory = {
  solar: DEMO_ROWS.map((r) => r.solar),
  home: DEMO_ROWS.map((r) => r.home),
  forecast: SOLAR_FORECAST,
  autonomy: autonomyOf(DEMO_ROWS),
  source: "demo",
};

export function useEnergyHistory(): EnergyHistory {
  const [data, setData] = useState<EnergyHistory>(DEMO);

  useEffect(() => {
    if (!CONFIGURED) return;
    let cancelled = false;
    fetch("/api/v1/twin/energy?history&limit=96")
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        const readings: Array<Partial<Row>> | undefined = j?.data?.readings;
        if (cancelled || !readings || readings.length < 2) return;
        const rows: Row[] = [...readings].reverse().map((r) => ({
          solar: Number(r.solar) || 0,
          home: Number(r.home) || 0,
          vehicle: Number(r.vehicle) || 0,
          battery: Number(r.battery) || 0,
          grid: Number(r.grid) || 0,
        }));
        setData({ solar: rows.map((r) => r.solar), home: rows.map((r) => r.home), forecast: SOLAR_FORECAST, autonomy: autonomyOf(rows), source: "synced" });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return data;
}
