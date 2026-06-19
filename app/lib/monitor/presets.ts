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
