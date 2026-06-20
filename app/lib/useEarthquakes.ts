"use client";

/** Seismic hook — resolves location (geolocation, estate fallback) and fetches USGS quakes. */
import { useEffect, useState } from "react";
import { SEISMIC_FALLBACK, type SeismicData } from "./earthquakes";

export function useEarthquakes(): { data: SeismicData; loading: boolean } {
  const [data, setData] = useState<SeismicData>(SEISMIC_FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = (lat?: number, lon?: number, label?: string) => {
      const qs = new URLSearchParams();
      if (lat != null && lon != null) {
        qs.set("lat", String(lat));
        qs.set("lon", String(lon));
      }
      if (label) qs.set("label", label);
      fetch(`/api/v1/earthquakes?${qs.toString()}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((j) => {
          if (!cancelled && j?.data) setData(j.data as SeismicData);
        })
        .catch(() => {})
        .finally(() => !cancelled && setLoading(false));
    };

    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => load(pos.coords.latitude, pos.coords.longitude, "Current location"),
        () => load(undefined, undefined, "Estate"),
        { timeout: 4000, maximumAge: 600000 },
      );
    } else {
      load(undefined, undefined, "Estate");
    }

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading };
}
