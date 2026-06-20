/**
 * GET /api/v1/earthquakes?lat=&lon= — recent earthquakes near a location.
 *
 * Sources the USGS FDSN event feed (GeoJSON, no key). Degrades to an empty
 * fallback so the UI always renders.
 */
import { NextResponse } from "next/server";
import { distanceKm, SEISMIC_FALLBACK, type Quake, type SeismicData } from "@/app/lib/earthquakes";

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
    const start = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
    const url =
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}` +
      `&latitude=${lat}&longitude=${lon}&maxradiuskm=600&minmagnitude=2.5&orderby=time&limit=10`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const j = await res.json();
    const features: unknown[] = Array.isArray(j?.features) ? j.features : [];
    const quakes: Quake[] = features.map((f) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const ft = f as any;
      const [qlon, qlat, depth] = ft.geometry?.coordinates ?? [lon, lat, 0];
      return {
        id: String(ft.id),
        magnitude: Math.round((Number(ft.properties?.mag) || 0) * 10) / 10,
        place: String(ft.properties?.place ?? "Unknown"),
        time: Number(ft.properties?.time) || Date.now(),
        depthKm: Math.round(Number(depth) || 0),
        distanceKm: distanceKm(lat, lon, Number(qlat) || lat, Number(qlon) || lon),
      };
    });
    const maxMagnitude = quakes.reduce((m, q) => Math.max(m, q.magnitude), 0);
    const payload: SeismicData = { quakes, maxMagnitude, location: label, source: "live" };
    return NextResponse.json(
      { apiVersion: API_VERSION, data: payload },
      { headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, data: { ...SEISMIC_FALLBACK, location: label } });
  }
}
