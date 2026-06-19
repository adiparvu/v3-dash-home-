"use client";

/**
 * useProperty — a single property's live record for the detail screen.
 *
 * Loads from `/api/v1/properties/[id]` when Supabase is configured and the
 * visitor is authenticated; otherwise returns the demo estate so the prototype
 * keeps rendering. `source` badges which is shown.
 */
import { useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type UIPropertyDetail = {
  name: string;
  location: string;
  areaHa: number | null;
  active: boolean;
};

export type PropertySource = "demo" | "loading" | "remote";

const DEMO: UIPropertyDetail = {
  name: "Prvio Estate",
  location: "Cluj-Napoca, România",
  areaHa: 45,
  active: true,
};

export function useProperty(id: string | undefined): { source: PropertySource; property: UIPropertyDetail } {
  const [source, setSource] = useState<PropertySource>(configured && id ? "loading" : "demo");
  const [property, setProperty] = useState<UIPropertyDetail>(DEMO);

  useEffect(() => {
    if (!configured || !id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/v1/properties/${id}`, { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setSource("demo"); return; }
        const json = await res.json();
        const p = json?.data?.property;
        if (cancelled || !p) { if (!cancelled) setSource("demo"); return; }
        const ha = p.total_area_sqm != null ? Math.round((p.total_area_sqm / 10000) * 10) / 10 : null;
        setProperty({
          name: p.name ?? DEMO.name,
          location: [p.city, p.country].filter(Boolean).join(", ") || DEMO.location,
          areaHa: ha,
          active: p.is_active !== false,
        });
        setSource("remote");
      } catch {
        if (!cancelled) setSource("demo");
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { source, property };
}
