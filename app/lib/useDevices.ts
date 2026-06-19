"use client";

/**
 * useDevices — devices brokered by the Home Assistant gateway.
 *
 * Loads from `GET /api/v1/twin/devices` (migration 006) when Supabase is
 * configured and the visitor is authenticated; otherwise returns a demo device
 * list so the prototype keeps rendering. `source` badges which is shown.
 */
import { useEffect, useState } from "react";

const configured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type Protocol = "Matter" | "Thread" | "Zigbee" | "Z-Wave" | "Wi-Fi";
export type UIDevice = {
  id: string;
  name: string;
  domain: string;
  zone: string;
  icon: string;
  lastSeen: string;
  online: boolean;
  protocol: Protocol;
  local: boolean;
};

type Source = "demo" | "loading" | "remote";

const DOMAIN_ICON: Record<string, string> = {
  climate: "🌡️", switch: "🔌", sensor: "📡", cover: "🚧", weather: "🌤️", light: "💡", lock: "🔒",
};

export const DEMO_DEVICES: UIDevice[] = [
  { id: "d1", name: "Greenhouse Climate Controller", domain: "climate", zone: "Greenhouse", icon: "🌡️", lastSeen: "2s ago", online: true, protocol: "Matter", local: true },
  { id: "d2", name: "Lake Pump Relay", domain: "switch", zone: "Lake", icon: "💧", lastSeen: "5s ago", online: true, protocol: "Zigbee", local: true },
  { id: "d3", name: "Orchard Soil Probe", domain: "sensor", zone: "Orchard", icon: "🌱", lastSeen: "3s ago", online: true, protocol: "Thread", local: true },
  { id: "d4", name: "Driveway Gate", domain: "cover", zone: "Driveway", icon: "🚧", lastSeen: "1m ago", online: true, protocol: "Z-Wave", local: true },
  { id: "d5", name: "Pond Aerator", domain: "switch", zone: "Smart Pond", icon: "🐟", lastSeen: "8s ago", online: true, protocol: "Zigbee", local: true },
  { id: "d6", name: "House Energy Meter", domain: "sensor", zone: "House", icon: "⚡", lastSeen: "2s ago", online: true, protocol: "Matter", local: true },
  { id: "d7", name: "Forest Weather Station", domain: "weather", zone: "Forest", icon: "🌤️", lastSeen: "12m ago", online: false, protocol: "Wi-Fi", local: false },
];

function relTime(iso: string): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return "";
  const m = Math.floor((Date.now() - t) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapDevice(d: any): UIDevice {
  return {
    id: d.id,
    name: d.name,
    domain: d.domain,
    zone: d.zone ?? "—",
    icon: DOMAIN_ICON[d.domain] ?? "📦",
    lastSeen: relTime(d.last_seen_at),
    online: Boolean(d.is_online),
    protocol: (d.protocol as Protocol) ?? "Wi-Fi",
    local: Boolean(d.is_local),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function useDevices(): { source: Source; devices: UIDevice[] } {
  const [source, setSource] = useState<Source>(configured ? "loading" : "demo");
  const [devices, setDevices] = useState<UIDevice[]>(DEMO_DEVICES);

  useEffect(() => {
    if (!configured) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/twin/devices", { cache: "no-store" });
        if (!res.ok) { if (!cancelled) setSource("demo"); return; }
        const json = await res.json();
        const list = (json?.data?.devices ?? []).map(mapDevice);
        if (cancelled) return;
        setDevices(list.length ? list : DEMO_DEVICES);
        setSource(list.length ? "remote" : "demo");
      } catch {
        if (!cancelled) setSource("demo");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { source, devices };
}
