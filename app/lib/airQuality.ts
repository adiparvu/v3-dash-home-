/**
 * Air-quality helpers (pure, testable).
 *
 * Maps the Open-Meteo European AQI to the official 6-band scale and labels the
 * pollutants. Used by the /api/v1/air-quality route, the hook and the panel.
 */

export type AirQuality = {
  aqi: number;
  pollutants: { pm25: number; pm10: number; no2: number; o3: number; so2: number };
  /** Resolved location label for display. */
  location: string;
  source: "live" | "fallback";
};

export type AqiBand = { label: string; color: string };

/** European Air Quality Index bands (0–20 good … >100 extremely poor). */
export function aqiCategory(aqi: number): AqiBand {
  if (aqi <= 20) return { label: "Good", color: "#4ADE80" };
  if (aqi <= 40) return { label: "Fair", color: "#A3E635" };
  if (aqi <= 60) return { label: "Moderate", color: "#FACC15" };
  if (aqi <= 80) return { label: "Poor", color: "#F97316" };
  if (aqi <= 100) return { label: "Very poor", color: "#EF4444" };
  return { label: "Extremely poor", color: "#7C3AED" };
}

export const POLLUTANTS: { key: keyof AirQuality["pollutants"]; label: string; unit: string }[] = [
  { key: "pm25", label: "PM2.5", unit: "µg/m³" },
  { key: "pm10", label: "PM10", unit: "µg/m³" },
  { key: "no2", label: "NO₂", unit: "µg/m³" },
  { key: "o3", label: "O₃", unit: "µg/m³" },
  { key: "so2", label: "SO₂", unit: "µg/m³" },
];

export const AIR_QUALITY_FALLBACK: AirQuality = {
  aqi: 28,
  pollutants: { pm25: 9, pm10: 16, no2: 12, o3: 64, so2: 2 },
  location: "Estate",
  source: "fallback",
};
