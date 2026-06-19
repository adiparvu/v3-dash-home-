/**
 * GET /api/v1/weather?lat=<lat>&lon=<lon> — current estate weather + day range.
 *
 * Fetches from Open-Meteo (no API key required) and maps WMO weather codes to a
 * human condition + emoji. Degrades gracefully: on any network/parse failure it
 * returns a deterministic fallback so widgets and the dashboard always render.
 * Short-cached at the edge to avoid hammering the upstream.
 */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

// Estate default (used when no coordinates are supplied).
const DEFAULT_LAT = 45.94;
const DEFAULT_LON = 24.97;

type WeatherPayload = {
  tempC: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  source: "live" | "fallback";
};

const FALLBACK: WeatherPayload = { tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, source: "fallback" };

/** WMO weather interpretation codes → label + emoji. */
function describe(code: number): { condition: string; icon: string } {
  if (code === 0) return { condition: "Clear", icon: "☀️" };
  if (code <= 2) return { condition: "Partly cloudy", icon: "⛅" };
  if (code === 3) return { condition: "Overcast", icon: "☁️" };
  if (code <= 48) return { condition: "Fog", icon: "🌫️" };
  if (code <= 57) return { condition: "Drizzle", icon: "🌦️" };
  if (code <= 67) return { condition: "Rain", icon: "🌧️" };
  if (code <= 77) return { condition: "Snow", icon: "🌨️" };
  if (code <= 82) return { condition: "Showers", icon: "🌦️" };
  if (code <= 86) return { condition: "Snow showers", icon: "🌨️" };
  if (code <= 99) return { condition: "Thunderstorm", icon: "⛈️" };
  return { condition: "Clear", icon: "☀️" };
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const lat = Number(params.get("lat")) || DEFAULT_LAT;
  const lon = Number(params.get("lon")) || DEFAULT_LON;

  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const j = await res.json();
    const code = Number(j?.current?.weather_code ?? 0);
    const { condition, icon } = describe(code);
    const payload: WeatherPayload = {
      tempC: Math.round(Number(j?.current?.temperature_2m ?? FALLBACK.tempC)),
      condition,
      icon,
      high: Math.round(Number(j?.daily?.temperature_2m_max?.[0] ?? FALLBACK.high)),
      low: Math.round(Number(j?.daily?.temperature_2m_min?.[0] ?? FALLBACK.low)),
      source: "live",
    };
    return NextResponse.json(
      { apiVersion: API_VERSION, data: payload },
      { headers: { "Cache-Control": "public, max-age=600, stale-while-revalidate=1800" } },
    );
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, data: FALLBACK });
  }
}
