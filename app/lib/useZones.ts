"use client";

/**
 * useZones — the zone list for the Zones screen.
 *
 * Remote: loads the first property's zones from the estate API when Supabase is
 * configured and the visitor is authenticated. Otherwise (or when the account has
 * no zones yet) it returns the user's store-added zones merged with the demo seeds.
 */
import { useEffect, useState } from "react";
import { useStore, type Zone } from "./store";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type Source = "demo" | "loading" | "remote";

export const SEED_ZONES: Zone[] = [
  { href: "/zones/lake", name: "Lake", subtitle: "Freshwater Ecosystem", type: "Natural", status: "Excellent", statusColor: "#22D3EE", health: 95, icon: "💧", accentColor: "#22D3EE", metrics: [{ label: "Water Quality", value: "Excellent" }, { label: "Temp", value: "18.4°C" }] },
  { href: "/zones/forest", name: "Forest", subtitle: "Mixed Forest Zone", type: "Natural", status: "Good", statusColor: "#4ADE80", health: 91, icon: "🌲", accentColor: "#4ADE80", metrics: [{ label: "Trees", value: "2,543" }, { label: "Biodiversity", value: "High" }] },
  { href: "/zones/greenhouse", name: "Greenhouse", subtitle: "Main Greenhouse", type: "Agriculture", status: "Optimal", statusColor: "#4ADE80", health: 98, icon: "🏡", accentColor: "#4ADE80", metrics: [{ label: "Temp", value: "24.3°C" }, { label: "Humidity", value: "65%" }] },
  { href: "/zones/orchard", name: "Orchard", subtitle: "Apple Orchard", type: "Agriculture", status: "Good", statusColor: "#4ADE80", health: 88, icon: "🍎", accentColor: "#F59E0B", metrics: [{ label: "Harvest", value: "23 days" }, { label: "Yield", value: "12.4 t" }] },
  { href: "/zones/smart-pond", name: "Smart Pond", subtitle: "Koi & Aquatic Garden", type: "Natural", status: "Excellent", statusColor: "#22D3EE", health: 96, icon: "🐟", accentColor: "#22D3EE", metrics: [{ label: "pH", value: "7.4" }, { label: "O₂", value: "8.2 mg/L" }] },
  { href: "/zones/garden", name: "Garden", subtitle: "Main Garden", type: "Natural", status: "Good", statusColor: "#4ADE80", health: 84, icon: "🌿", accentColor: "#4ADE80", metrics: [{ label: "Plants", value: "87" }, { label: "Irrigation", value: "Active" }] },
  { href: "/zones/house", name: "House", subtitle: "Main Residence", type: "Built", status: "Good", statusColor: "#7C3AED", health: 90, icon: "🏠", accentColor: "#7C3AED", metrics: [{ label: "Rooms", value: "8" }, { label: "Temp", value: "22.1°C" }] },
  { href: "/zones/driveway", name: "Driveway", subtitle: "Gate & Access Control", type: "Built", status: "Secured", statusColor: "#9CA3AF", health: 100, icon: "🚗", accentColor: "#9CA3AF", metrics: [{ label: "Cameras", value: "4" }, { label: "Gate", value: "Closed" }] },
  { href: "/zones/smart-home", name: "Smart Home", subtitle: "Home Automation Hub", type: "Built", status: "Active", statusColor: "#4ADE80", health: 97, icon: "🤖", accentColor: "#4ADE80", metrics: [{ label: "Devices", value: "12" }, { label: "Active", value: "8" }] },
];

const TYPE_TO_FILTER: Record<string, string> = {
  forest: "Natural", lake: "Natural", garden: "Natural",
  greenhouse: "Agriculture", orchard: "Agriculture",
  driveway: "Infrastructure", house: "Built", smart_home: "Built", custom: "Natural",
};
const TYPE_ICON: Record<string, string> = {
  forest: "🌲", lake: "💧", garden: "🌿", greenhouse: "🏡", orchard: "🍎",
  driveway: "🚗", house: "🏠", smart_home: "🤖", custom: "📍",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapZone(z: any): Zone {
  return {
    href: `/zones/${z.id}`,
    name: z.name,
    subtitle: z.description ?? "Zone",
    type: TYPE_TO_FILTER[z.type] ?? "Natural",
    status: "Active",
    statusColor: "#4ADE80",
    health: 100,
    icon: z.icon ?? TYPE_ICON[z.type] ?? "📍",
    accentColor: "#4ADE80",
    metrics: [],
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface UseZones {
  source: Source;
  zones: Zone[];
}

export function useZones(): UseZones {
  const { addedZones } = useStore();
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [remote, setRemote] = useState<Zone[] | null>(null);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const pRes = await fetch("/api/v1/properties", { cache: "no-store" });
        if (!pRes.ok) throw new Error("unauth");
        const pJson = await pRes.json();
        const first = (pJson.data.properties ?? [])[0];
        if (!first) {
          if (!cancelled) setSource("demo");
          return;
        }
        const zRes = await fetch(`/api/v1/properties/${first.id}/zones`, { cache: "no-store" });
        if (!zRes.ok) throw new Error("zones");
        const zJson = await zRes.json();
        if (cancelled) return;
        const mapped = (zJson.data.zones ?? []).map(mapZone);
        if (mapped.length) {
          setRemote(mapped);
          setSource("remote");
        } else {
          setSource("demo");
        }
      } catch {
        if (!cancelled) setSource("demo");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (source === "remote" && remote) {
    return { source, zones: remote };
  }
  return { source, zones: [...addedZones, ...SEED_ZONES] };
}
