/** Seismic helpers (pure, testable) — recent earthquakes near a location (USGS). */

export type Quake = {
  id: string;
  magnitude: number;
  place: string;
  /** Unix ms. */
  time: number;
  depthKm: number;
  distanceKm: number;
};

export type SeismicData = {
  quakes: Quake[];
  /** Largest magnitude in the window. */
  maxMagnitude: number;
  location: string;
  source: "live" | "fallback";
};

export type QuakeBand = { label: string; color: string };

/** Richter magnitude → severity band. */
export function quakeSeverity(mag: number): QuakeBand {
  if (mag < 3) return { label: "Minor", color: "#4ADE80" };
  if (mag < 4) return { label: "Light", color: "#A3E635" };
  if (mag < 5) return { label: "Moderate", color: "#FACC15" };
  if (mag < 6) return { label: "Strong", color: "#F97316" };
  return { label: "Major", color: "#EF4444" };
}

/** Great-circle distance in km (Haversine). */
export function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export const SEISMIC_FALLBACK: SeismicData = {
  quakes: [],
  maxMagnitude: 0,
  location: "Estate",
  source: "fallback",
};
