/** Shared weather helpers (pure) — WMO code mapping used by the weather and
 *  estate-snapshot routes. */

export type WeatherReading = {
  tempC: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
  uv: number;
  source: "live" | "fallback";
};

export const WEATHER_FALLBACK: WeatherReading = {
  tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, uv: 3, source: "fallback",
};

/** WMO weather interpretation codes → label + emoji. */
export function describeWeather(code: number): { condition: string; icon: string } {
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

/** Fetch current weather from Open-Meteo with a graceful fallback. */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherReading> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,weather_code,uv_index&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3500);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);
    const j = await res.json();
    const code = Number(j?.current?.weather_code ?? 0);
    const { condition, icon } = describeWeather(code);
    return {
      tempC: Math.round(Number(j?.current?.temperature_2m ?? WEATHER_FALLBACK.tempC)),
      condition,
      icon,
      high: Math.round(Number(j?.daily?.temperature_2m_max?.[0] ?? WEATHER_FALLBACK.high)),
      low: Math.round(Number(j?.daily?.temperature_2m_min?.[0] ?? WEATHER_FALLBACK.low)),
      uv: Math.round(Number(j?.current?.uv_index ?? WEATHER_FALLBACK.uv)),
      source: "live",
    };
  } catch {
    return WEATHER_FALLBACK;
  }
}
