/**
 * GET /api/v1/estate/snapshot?lat=&lon= — the unified estate snapshot.
 *
 * One shape for widget timelines, the native client and the Siri "estate health"
 * intent. Live weather is fetched; estate metrics come from the backend services
 * (demo values here). Always renders thanks to the weather fallback.
 */
import { NextResponse } from "next/server";
import { fetchWeather } from "@/app/lib/weather";
import { buildEstateSnapshot } from "@/app/lib/estateSnapshot";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const DEFAULT_LAT = 45.94;
const DEFAULT_LON = 24.97;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat")) || DEFAULT_LAT;
  const lon = Number(params.get("lon")) || DEFAULT_LON;

  const weather = await fetchWeather(lat, lon);
  const snapshot = buildEstateSnapshot(weather);
  return NextResponse.json(
    { apiVersion: API_VERSION, data: snapshot },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=900" } },
  );
}
