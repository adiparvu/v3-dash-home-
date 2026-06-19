/**
 * Module monitoring presets — per-module MetricSpec sets for the Zone-Monitoring
 * framework. Adding a module is mostly authoring one of these. Heleșteu first;
 * greenhouse / pool / cellar follow the same shape.
 */
import type { MetricSpec } from "./types";

// Heleșteu (lake) — aquaculture water quality. Bands follow common freshwater
// fish-farming targets (pH 6.5–8.5, DO ≥ 6 mg/L, temp 12–24 °C…).
export const POND_WATER: MetricSpec[] = [
  { key: "ph", label: "pH", icon: "🧪", demo: 7.2, decimals: 1, okMin: 6.5, okMax: 8.5, warnMin: 6.0, warnMax: 9.0 },
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 18.4, decimals: 1, okMin: 12, okMax: 24, warnMin: 8, warnMax: 28 },
  { key: "dissolved_oxygen", label: "Oxigen dizolvat", unit: "mg/L", icon: "🫧", demo: 8.1, decimals: 1, okMin: 6, okMax: 14, warnMin: 4, warnMax: 16 },
  { key: "water_level", label: "Nivel apă", unit: "m", icon: "📏", demo: 2.8, decimals: 2, okMin: 2.4, okMax: 3.2, warnMin: 2.0, warnMax: 3.6 },
  { key: "turbidity", label: "Turbiditate", unit: "NTU", icon: "🌫️", demo: 8, decimals: 0, okMax: 15, warnMax: 30 },
  { key: "salinity", label: "Salinitate", unit: "ppt", icon: "🧂", demo: 0.3, decimals: 1, okMax: 1.0, warnMax: 2.0 },
];

// Livada (orchard) — soil + microclimate + irrigation (farmOS-style agronomy).
export const ORCHARD: MetricSpec[] = [
  { key: "moisture", label: "Umiditate sol", unit: "%", icon: "💧", demo: 48, decimals: 0, okMin: 35, okMax: 65, warnMin: 25, warnMax: 75 },
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 21, decimals: 1, okMin: 10, okMax: 28, warnMin: 4, warnMax: 34 },
  { key: "humidity", label: "Umiditate aer", unit: "%", icon: "💨", demo: 62, decimals: 0, okMin: 45, okMax: 75, warnMin: 30, warnMax: 88 },
  { key: "ph", label: "pH sol", icon: "🧪", demo: 6.6, decimals: 1, okMin: 6.0, okMax: 7.5, warnMin: 5.5, warnMax: 8.0 },
  { key: "light", label: "Luminozitate", unit: "klx", icon: "☀️", demo: 64, decimals: 0 },
  { key: "water_flow", label: "Debit irigare", unit: "L/min", icon: "🚿", demo: 12, decimals: 0, okMax: 30, warnMax: 45 },
];
