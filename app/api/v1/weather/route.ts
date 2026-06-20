/**
 * GET /api/v1/weather?lat=<lat>&lon=<lon> — current estate weather + day range.
 *
 * Fetches from Open-Meteo (no API key) via the shared weather helper and maps
 * WMO codes to a human condition + emoji. Degrades to a deterministic fallback
 * so widgets and the dashboard always render. Short-cached at the edge.
 */
import { NextResponse } from "next/server";
import { fetchWeather } from "@/app/lib/weather";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

const DEFAULT_LAT = 45.94;
const DEFAULT_LON = 24.97;

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat")) || DEFAULT_LAT;
  const lon = Number(params.get("lon")) || DEFAULT_LON;

  const payload = await fetchWeather(lat, lon);
  const headers = payload.source === "live"
    ? { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" }
    : undefined;
  return NextResponse.json({ apiVersion: API_VERSION, data: payload }, headers ? { headers } : undefined);
}
