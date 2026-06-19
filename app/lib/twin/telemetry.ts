/**
 * Spatial & telemetry model.
 *
 * A framework-free representation of the estate's spatial layout, asset/sensor
 * mapping and live telemetry. In the platform these come from backend-brokered
 * contracts synchronized with Home Assistant / IoT; here they are simulated on
 * device so the twin visualization, time-series and state-event flow are real.
 */
import { smoothPath } from "../charts";

export type TwinZone = {
  id: string;
  name: string;
  icon: string;
  color: string;
  /** Position & size on a 0–100 normalized map canvas. */
  x: number;
  y: number;
  w: number;
  h: number;
  health: number;
};

export type TwinSensor = {
  id: string;
  zoneId: string;
  label: string;
  metric: string;
  unit: string;
  value: number;
  /** Display range for gauges / sparklines. */
  min: number;
  max: number;
  /** Healthy operating band [low, high]. */
  optimal: [number, number];
  color: string;
};

export type SensorStatus = "ok" | "warn" | "alert";

export type TwinEvent = {
  id: string;
  at: number;
  sensorId: string;
  label: string;
  message: string;
  status: SensorStatus;
};

export const TWIN_ZONES: TwinZone[] = [
  { id: "forest", name: "Forest", icon: "🌲", color: "#4ADE80", x: 4, y: 4, w: 40, h: 30, health: 91 },
  { id: "orchard", name: "Orchard", icon: "🍎", color: "#F59E0B", x: 48, y: 4, w: 48, h: 24, health: 88 },
  { id: "greenhouse", name: "Greenhouse", icon: "🏡", color: "#22D3EE", x: 48, y: 32, w: 22, h: 22, health: 79 },
  { id: "garden", name: "Garden", icon: "🌷", color: "#EC4899", x: 72, y: 32, w: 24, h: 22, health: 93 },
  { id: "house", name: "House", icon: "🏠", color: "#7C3AED", x: 4, y: 38, w: 24, h: 26, health: 96 },
  { id: "lake", name: "Lake", icon: "💧", color: "#3B82F6", x: 30, y: 38, w: 16, h: 26, health: 95 },
  { id: "pond", name: "Smart Pond", icon: "🐟", color: "#06B6D4", x: 4, y: 68, w: 28, h: 28, health: 96 },
  { id: "driveway", name: "Driveway", icon: "🛣️", color: "#9CA3AF", x: 36, y: 68, w: 60, h: 28, health: 90 },
];

export const TWIN_SENSORS: TwinSensor[] = [
  { id: "s-green-temp", zoneId: "greenhouse", label: "Temp", metric: "Temperature", unit: "°C", value: 24.3, min: 10, max: 40, optimal: [18, 28], color: "#F59E0B" },
  { id: "s-green-co2", zoneId: "greenhouse", label: "CO₂", metric: "CO₂", unit: "ppm", value: 800, min: 400, max: 1200, optimal: [400, 700], color: "#22D3EE" },
  { id: "s-lake-temp", zoneId: "lake", label: "Water", metric: "Water temp", unit: "°C", value: 18.4, min: 4, max: 30, optimal: [12, 22], color: "#3B82F6" },
  { id: "s-pond-o2", zoneId: "pond", label: "O₂", metric: "Dissolved O₂", unit: "mg/L", value: 8.2, min: 4, max: 12, optimal: [6, 10], color: "#06B6D4" },
  { id: "s-orchard-soil", zoneId: "orchard", label: "Soil", metric: "Soil moisture", unit: "%", value: 42, min: 0, max: 100, optimal: [35, 60], color: "#F59E0B" },
  { id: "s-forest-hum", zoneId: "forest", label: "Humidity", metric: "Humidity", unit: "%", value: 68, min: 20, max: 100, optimal: [50, 80], color: "#4ADE80" },
  { id: "s-house-power", zoneId: "house", label: "Power", metric: "Power draw", unit: "kW", value: 3.1, min: 0, max: 15, optimal: [0, 8], color: "#7C3AED" },
  { id: "s-garden-light", zoneId: "garden", label: "Light", metric: "Lux", unit: "klx", value: 42, min: 0, max: 100, optimal: [20, 80], color: "#EC4899" },
];

export function statusFor(s: TwinSensor): SensorStatus {
  const [lo, hi] = s.optimal;
  if (s.value < lo || s.value > hi) {
    const span = hi - lo || 1;
    const dist = s.value < lo ? lo - s.value : s.value - hi;
    return dist > span * 0.25 ? "alert" : "warn";
  }
  return "ok";
}

export const STATUS_COLOR: Record<SensorStatus, string> = {
  ok: "#4ADE80",
  warn: "#F59E0B",
  alert: "#EF4444",
};

/** One simulated telemetry tick — a bounded random walk around the current value. */
export function tick(s: TwinSensor): number {
  const span = s.max - s.min;
  const step = (Math.random() - 0.5) * span * 0.04;
  let next = s.value + step;
  // Gentle pull back toward the optimal midpoint so values stay realistic.
  const mid = (s.optimal[0] + s.optimal[1]) / 2;
  next += (mid - s.value) * 0.03;
  next = Math.max(s.min, Math.min(s.max, next));
  return Math.round(next * 10) / 10;
}

/** Build an SVG polyline path for a time-series within a w×h box. */
export function seriesPath(values: number[], w: number, h: number, pad = 2): string {
  if (values.length < 2) return "";
  // Revolut-style smooth curve (see app/lib/charts.ts).
  return smoothPath(values, w, h, pad);
}
