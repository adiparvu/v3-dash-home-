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

// Greenhouse — Mycodo-style climate + hydroponics nutrient control.
export const GREENHOUSE: MetricSpec[] = [
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 24.3, decimals: 1, okMin: 18, okMax: 28, warnMin: 14, warnMax: 34 },
  { key: "humidity", label: "Umiditate", unit: "%", icon: "💧", demo: 65, decimals: 0, okMin: 50, okMax: 75, warnMin: 40, warnMax: 88 },
  { key: "co2", label: "CO₂", unit: "ppm", icon: "🌫️", demo: 800, decimals: 0, okMin: 400, okMax: 1000, warnMin: 350, warnMax: 1400 },
  { key: "light", label: "Lumină", unit: "%", icon: "☀️", demo: 60, decimals: 0, okMin: 40, okMax: 100 },
  { key: "ph", label: "pH nutrienți", icon: "🧪", demo: 6.0, decimals: 1, okMin: 5.5, okMax: 6.5, warnMin: 5.0, warnMax: 7.0 },
  { key: "ec", label: "EC nutrienți", unit: "mS/cm", icon: "⚡", demo: 1.8, decimals: 1, okMin: 1.2, okMax: 2.4, warnMin: 0.8, warnMax: 3.0 },
];

// Garaj — ambient climate for the vehicle bay (TeslaMate covers the vehicles).
export const GARAGE: MetricSpec[] = [
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 16.5, decimals: 1, okMin: 5, okMax: 30, warnMin: 0, warnMax: 38 },
  { key: "humidity", label: "Umiditate", unit: "%", icon: "💧", demo: 52, decimals: 0, okMin: 30, okMax: 65, warnMin: 20, warnMax: 80 },
];

// Piscină — pool water chemistry & comfort.
export const POOL: MetricSpec[] = [
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 27.5, decimals: 1, okMin: 26, okMax: 30, warnMin: 22, warnMax: 34 },
  { key: "ph", label: "pH", icon: "🧪", demo: 7.4, decimals: 1, okMin: 7.2, okMax: 7.6, warnMin: 6.8, warnMax: 8.0 },
  { key: "chlorine", label: "Clor liber", unit: "ppm", icon: "🧴", demo: 1.8, decimals: 1, okMin: 1, okMax: 3, warnMin: 0.5, warnMax: 5 },
  { key: "water_level", label: "Nivel apă", unit: "cm", icon: "📏", demo: 12, decimals: 0, okMin: 8, okMax: 16, warnMin: 4, warnMax: 20 },
  { key: "turbidity", label: "Turbiditate", unit: "NTU", icon: "🌫️", demo: 0.4, decimals: 1, okMax: 1.0, warnMax: 3.0 },
  { key: "salinity", label: "Salinitate", unit: "ppt", icon: "🧂", demo: 3.1, decimals: 1, okMin: 2.7, okMax: 3.4, warnMin: 2.0, warnMax: 4.0 },
];

// Subsol — cramă / tehnic: cellar climate + flood/leak detection.
export const CELLAR: MetricSpec[] = [
  { key: "temperature", label: "Temperatură", unit: "°C", icon: "🌡️", demo: 12.5, decimals: 1, okMin: 11, okMax: 14, warnMin: 8, warnMax: 18 },
  { key: "humidity", label: "Umiditate", unit: "%", icon: "💧", demo: 68, decimals: 0, okMin: 60, okMax: 75, warnMin: 50, warnMax: 85 },
  { key: "water_level", label: "Inundație", unit: "mm", icon: "🌊", demo: 0, decimals: 0, okMax: 2, warnMax: 10 },
  { key: "co2", label: "CO₂", unit: "ppm", icon: "🌫️", demo: 620, decimals: 0, okMax: 1000, warnMax: 2000 },
];
