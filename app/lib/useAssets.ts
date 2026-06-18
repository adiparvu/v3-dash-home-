"use client";

/**
 * useAssets — the asset list for the Inventory screen.
 *
 * Remote: loads the first property's assets from the estate API when Supabase is
 * configured and the visitor is authenticated. Otherwise (or when the account has
 * no assets yet) returns the user's store-added assets merged with the demo seeds.
 */
import { useEffect, useState } from "react";
import { useStore, type Asset } from "./store";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

type Source = "demo" | "loading" | "remote";

export const SEED_ASSETS: Asset[] = [
  { href: "/inventory/water-pump", name: "Water Pump", category: "Equipment", location: "Lake", status: "On", statusColor: "#4ADE80", icon: "⚙️", accentColor: "#22D3EE" },
  { href: "/inventory/ficus-tree", name: "Ficus Tree", category: "Plants", location: "Living Room", status: "Healthy", statusColor: "#4ADE80", icon: "🌱", accentColor: "#4ADE80" },
  { href: "/inventory/air-conditioner", name: "Air Conditioner", category: "Devices", location: "House", status: "On", statusColor: "#4ADE80", icon: "❄️", accentColor: "#22D3EE" },
  { href: "/inventory/lawn-mower", name: "Lawn Mower", category: "Equipment", location: "Garden", status: "Idle", statusColor: "#9CA3AF", icon: "🌿", accentColor: "#4ADE80" },
  { href: "/inventory/security-camera", name: "Security Camera", category: "Devices", location: "Driveway", status: "3 Active", statusColor: "#FFFFFF", icon: "📷", accentColor: "#7C3AED" },
  { href: "/inventory/irrigation-system", name: "Irrigation System", category: "Equipment", location: "Orchard", status: "Active", statusColor: "#4ADE80", icon: "💧", accentColor: "#22D3EE" },
];

const CATEGORY_TO_FILTER: Record<string, string> = {
  device: "Devices", plant: "Plants", equipment: "Equipment", vehicle: "Vehicles",
  furniture: "Equipment", structure: "Equipment", other: "Equipment",
};
const CATEGORY_ICON: Record<string, string> = {
  device: "🔌", plant: "🌱", equipment: "⚙️", vehicle: "🚜", furniture: "🪑", structure: "🏗️", other: "📦",
};

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapAsset(a: any): Asset {
  return {
    href: `/inventory/${a.id}`,
    name: a.name,
    category: CATEGORY_TO_FILTER[a.category] ?? "Equipment",
    location: a.location_description ?? "—",
    status: a.is_active ? "Active" : "Offline",
    statusColor: a.is_active ? "#4ADE80" : "#EF4444",
    icon: CATEGORY_ICON[a.category] ?? "📦",
    accentColor: "#22D3EE",
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface UseAssets {
  source: Source;
  assets: Asset[];
}

export function useAssets(): UseAssets {
  const { addedAssets } = useStore();
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [remote, setRemote] = useState<Asset[] | null>(null);

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
        const aRes = await fetch(`/api/v1/properties/${first.id}/assets`, { cache: "no-store" });
        if (!aRes.ok) throw new Error("assets");
        const aJson = await aRes.json();
        if (cancelled) return;
        const mapped = (aJson.data.assets ?? []).map(mapAsset);
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
    return { source, assets: remote };
  }
  return { source, assets: [...addedAssets, ...SEED_ASSETS] };
}
