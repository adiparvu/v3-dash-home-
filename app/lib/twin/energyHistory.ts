"use client";

/**
 * Intraday energy history for the Energie tab.
 *
 * When Supabase is configured it pulls the durable `energy_readings` time-series
 * (GET /api/v1/twin/energy?history) and exposes the solar/home series; otherwise
 * — or when empty / signed out — it falls back to a deterministic demo day. A
 * `source` flag ("synced" | "demo") lets the UI badge which is shown.
 */
import { useEffect, useState } from "react";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type EnergyHistory = { solar: number[]; home: number[]; source: "synced" | "demo" };

// Deterministic 24-hour demo day (no randomness → no hydration mismatch).
const HOURS = Array.from({ length: 24 }, (_, h) => h);
const DEMO_SOLAR = HOURS.map((h) => Math.round(Math.max(0, Math.sin(((h - 6) / 12) * Math.PI)) * 6.5 * 10) / 10);
const DEMO_HOME = HOURS.map((h) => Math.round((0.45 + 0.8 * Math.exp(-((h - 8) ** 2) / 5) + 1.1 * Math.exp(-((h - 20) ** 2) / 6)) * 10) / 10);

type Row = { solar: number; home: number };

export function useEnergyHistory(): EnergyHistory {
  const [data, setData] = useState<EnergyHistory>({ solar: DEMO_SOLAR, home: DEMO_HOME, source: "demo" });

  useEffect(() => {
    if (!CONFIGURED) return;
    let cancelled = false;
    fetch("/api/v1/twin/energy?history&limit=48")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        const readings: Row[] | undefined = j?.data?.readings;
        if (cancelled || !readings || readings.length < 2) return;
        const rows = [...readings].reverse(); // API returns newest-first → chronological
        setData({ solar: rows.map((r) => r.solar), home: rows.map((r) => r.home), source: "synced" });
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return data;
}
