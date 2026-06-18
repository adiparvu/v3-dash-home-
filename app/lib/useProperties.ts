"use client";

/**
 * useProperties — the property portfolio for the Properties screen.
 *
 * Loads from the versioned `/api/v1/properties` endpoint when Supabase is
 * configured and the visitor is authenticated; otherwise returns the demo
 * estate so the prototype keeps rendering.
 */
import { useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export type UIProperty = {
  id: string;
  name: string;
  location: string;
  areaHa: number | null;
  zones: number | null;
  objects: number | null;
  health: number | null;
  valueLabel: string;
};

type Source = "demo" | "loading" | "remote";

const DEMO: UIProperty[] = [
  {
    id: "prvio-estate",
    name: "Prvio Estate",
    location: "Cluj-Napoca, România",
    areaHa: 45,
    zones: 26,
    objects: 142,
    health: 87,
    valueLabel: "€2.4M",
  },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapProperty(p: any): UIProperty {
  const ha = p.total_area_sqm != null ? Math.round((p.total_area_sqm / 10000) * 10) / 10 : null;
  return {
    id: p.id,
    name: p.name,
    location: [p.city, p.country].filter(Boolean).join(", ") || "—",
    areaHa: ha,
    zones: null,
    objects: null,
    health: null,
    valueLabel: "—",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface UseProperties {
  source: Source;
  properties: UIProperty[];
}

export function useProperties(): UseProperties {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [properties, setProperties] = useState<UIProperty[]>(DEMO);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/properties", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setSource("demo");
          return;
        }
        const json = await res.json();
        if (cancelled) return;
        const list = (json.data.properties ?? []).map(mapProperty);
        setProperties(list.length ? list : DEMO);
        setSource(list.length ? "remote" : "demo");
      } catch {
        if (!cancelled) setSource("demo");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { source, properties };
}
