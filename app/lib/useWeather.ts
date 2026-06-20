"use client";

/**
 * Estate weather hook. Calls our /api/v1/weather route (Open-Meteo upstream with
 * a server-side fallback) and exposes the current reading for widgets and the
 * dashboard. Falls back to a static reading if the route itself is unreachable.
 */
import { useEffect, useState } from "react";

export type Weather = { tempC: number; condition: string; icon: string; high: number; low: number; uv: number; source: "live" | "fallback" };

const FALLBACK: Weather = { tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, uv: 3, source: "fallback" };

export function useWeather(): Weather {
  const [weather, setWeather] = useState<Weather>(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/v1/weather")
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (!cancelled && j?.data) setWeather(j.data as Weather);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return weather;
}
