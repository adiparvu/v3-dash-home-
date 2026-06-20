/**
 * Energy-tariff helpers (pure, testable).
 *
 * Models day-ahead spot prices for the supported bidding zones (Belgium,
 * Romania) sourced from Energy-Charts. Prices upstream are EUR/MWh; we expose
 * ct/kWh for display and compute the cheapest window.
 */

export type TariffZone = "BE" | "RO";

export const ZONES: Record<TariffZone, { label: string; flag: string; bzn: string }> = {
  BE: { label: "Belgium", flag: "🇧🇪", bzn: "BE" },
  RO: { label: "Romania", flag: "🇷🇴", bzn: "RO" },
};

export type TariffPoint = { t: number; eurMwh: number };

export type Tariff = {
  zone: TariffZone;
  /** Hourly day-ahead points (unix seconds + EUR/MWh). */
  points: TariffPoint[];
  current: number; // ct/kWh
  min: number; // ct/kWh
  max: number; // ct/kWh
  avg: number; // ct/kWh
  /** Unix seconds of the cheapest hour. */
  cheapestAt: number;
  source: "live" | "fallback";
};

/** EUR/MWh → ct/kWh (1 €/MWh = 0.1 ct/kWh). */
export function toCentsPerKwh(eurMwh: number): number {
  return Math.round(eurMwh * 0.1 * 100) / 100;
}

/** Compute display stats from raw day-ahead arrays. `nowSec` selects "current". */
export function tariffStats(
  unixSeconds: number[],
  eurMwh: number[],
  nowSec: number = Math.floor(Date.now() / 1000),
): { points: TariffPoint[]; current: number; min: number; max: number; avg: number; cheapestAt: number } {
  const points: TariffPoint[] = unixSeconds.map((t, i) => ({ t, eurMwh: eurMwh[i] })).filter((p) => Number.isFinite(p.eurMwh));
  if (points.length === 0) {
    return { points: [], current: 0, min: 0, max: 0, avg: 0, cheapestAt: 0 };
  }
  const prices = points.map((p) => p.eurMwh);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
  const cheapest = points.reduce((lo, p) => (p.eurMwh < lo.eurMwh ? p : lo), points[0]);
  // "Current" = the latest point at or before now, else the first.
  const past = points.filter((p) => p.t <= nowSec);
  const currentPoint = past.length ? past[past.length - 1] : points[0];
  return {
    points,
    current: toCentsPerKwh(currentPoint.eurMwh),
    min: toCentsPerKwh(min),
    max: toCentsPerKwh(max),
    avg: toCentsPerKwh(avg),
    cheapestAt: cheapest.t,
  };
}

/** Deterministic fallback curve (a typical day) used when the upstream is down. */
export function tariffFallback(zone: TariffZone, base = Date.now()): Tariff {
  const startHour = new Date(base);
  startHour.setMinutes(0, 0, 0);
  const start = Math.floor(startHour.getTime() / 1000) - 12 * 3600;
  const shape = [70, 62, 55, 50, 48, 52, 68, 95, 120, 110, 98, 90, 88, 92, 100, 115, 140, 165, 150, 125, 105, 92, 84, 76];
  const unix = shape.map((_, i) => start + i * 3600);
  const eur = shape.map((v) => (zone === "RO" ? v * 0.95 : v));
  const s = tariffStats(unix, eur, base / 1000);
  return { zone, ...s, source: "fallback" };
}
