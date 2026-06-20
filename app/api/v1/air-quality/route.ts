/**
 * GET /api/v1/air-quality?lat=&lon= — current air quality for a location.
 *
 * Fetches the Open-Meteo Air Quality API (European AQI + pollutants, no key)
 * and degrades to a deterministic fallback so the UI always renders.
 */
import { NextResponse } from "next/server";
import { AIR_QUALITY_FALLBACK, type AirQuality } from "@/app/lib/airQuality";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const DEFAULT_LAT = 45.94;
const DEFAULT_LON = 24.97;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat")) || DEFAULT_LAT;
  const lon = Number(params.get("lon")) || DEFAULT_LON;
  const label = params.get("label") || "Current location";

  try {
    const url =
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
      `&current=european_aqi,pm2_5,pm10,nitrogen_dioxide,ozone,sulphur_dioxide,grass_pollen,birch_pollen,alder_pollen,ragweed_pollen&timezone=auto`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const j = await res.json();
    const c = j?.current ?? {};
    const num = (v: unknown, d: number) => (typeof v === "number" && isFinite(v) ? Math.round(v) : d);
    const payload: AirQuality = {
      aqi: num(c.european_aqi, AIR_QUALITY_FALLBACK.aqi),
      pollutants: {
        pm25: num(c.pm2_5, AIR_QUALITY_FALLBACK.pollutants.pm25),
        pm10: num(c.pm10, AIR_QUALITY_FALLBACK.pollutants.pm10),
        no2: num(c.nitrogen_dioxide, AIR_QUALITY_FALLBACK.pollutants.no2),
        o3: num(c.ozone, AIR_QUALITY_FALLBACK.pollutants.o3),
        so2: num(c.sulphur_dioxide, AIR_QUALITY_FALLBACK.pollutants.so2),
      },
      pollen: {
        grass: num(c.grass_pollen, 0),
        birch: num(c.birch_pollen, 0),
        alder: num(c.alder_pollen, 0),
        ragweed: num(c.ragweed_pollen, 0),
      },
      location: label,
      source: "live",
    };
    return NextResponse.json(
      { apiVersion: API_VERSION, data: payload },
      { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" } },
    );
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, data: { ...AIR_QUALITY_FALLBACK, location: label } });
  }
}
