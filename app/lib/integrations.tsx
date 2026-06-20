"use client";

/**
 * Integrations store + catalog.
 *
 * Every integration is connectable in-app: connection state is persisted
 * (localStorage `prvio-integrations-v1`) and each integration has a detail
 * surface with representative data + actions. Real third-party APIs (Revolut,
 * Airbnb, Ring, …) would plug into the same shapes behind the backend; here the
 * data is demo so the flows are fully functional without external credentials.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type IntegrationCategory =
  | "Smart Home & Standards"
  | "Security"
  | "Finance & Banking"
  | "Rentals & Hospitality"
  | "Energy & Environment";

export type Integration = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  color: string;
  category: IntegrationCategory;
  /** Connected out of the box (already wired surfaces). */
  defaultConnected?: boolean;
  /** Badge shown instead of "Connected", e.g. "Via HomeKit". */
  connectedBadge?: string;
  /** Verb on the connect button, e.g. "Connect", "Pair", "Scan a receipt". */
  connectLabel?: string;
  /** Renders a real, live data panel on the detail screen when connected. */
  live?: "energy-tariff" | "air-quality";
  /** Sold benefits, shown before connecting. */
  whatYouGet: string[];
  /** Headline numbers, shown once connected. */
  metrics: { label: string; value: string }[];
  /** Recent activity feed, shown once connected. */
  feed?: { icon: string; title: string; sub: string }[];
  /** Deep links to the live surface this integration powers. */
  actions?: { label: string; href: string }[];
};

export const INTEGRATIONS: Integration[] = [
  // ── Smart Home & Standards ────────────────────────────────────────────────
  {
    id: "ha", name: "Home Assistant", desc: "142 entities · gateway for all devices", icon: "🏠", color: "#22D3EE",
    category: "Smart Home & Standards", defaultConnected: true,
    whatYouGet: ["Single gateway for every device", "Local-first control & automations", "Telemetry into the dashboard & event bus"],
    metrics: [{ label: "Entities", value: "142" }, { label: "Online", value: "6/7" }, { label: "Last sync", value: "2m" }],
    feed: [{ icon: "🌡️", title: "Greenhouse Climate Controller", sub: "Matter · online" }, { icon: "💧", title: "Lake Pump Relay", sub: "Zigbee · online" }],
    actions: [{ label: "Open gateway", href: "/settings/integrations/home-assistant" }, { label: "Floorplan", href: "/twin/floorplan" }],
  },
  {
    id: "matter", name: "Matter & Thread", desc: "Compatible Matter devices work automatically via Apple Home.", icon: "⚙️", color: "#4ADE80",
    category: "Smart Home & Standards", defaultConnected: true, connectedBadge: "Via HomeKit",
    whatYouGet: ["Auto-discovery of Matter devices", "Thread border-router mesh", "Cross-ecosystem standard, future-proof"],
    metrics: [{ label: "Matter", value: "9" }, { label: "Thread", value: "4" }, { label: "Routers", value: "2" }],
    actions: [{ label: "Manage in gateway", href: "/settings/integrations/home-assistant" }],
  },
  {
    id: "hue", name: "Philips Hue & IKEA", desc: "Lighting & sensors over Zigbee / Matter", icon: "💡", color: "#F59E0B",
    category: "Smart Home & Standards", defaultConnected: true,
    whatYouGet: ["Hue Bridge + IKEA DIRIGERA", "Lights, plugs, motion & contacts", "Scenes and lighting automations"],
    metrics: [{ label: "Lights", value: "18" }, { label: "Sensors", value: "6" }, { label: "Scenes", value: "5" }],
    feed: [{ icon: "💡", title: "Living Room", sub: "On · 60% warm" }, { icon: "🛋️", title: "IKEA VALLHORN motion", sub: "Hallway · idle" }],
    actions: [{ label: "Compatible ecosystems", href: "/settings/integrations/home-assistant" }],
  },
  {
    id: "sonos", name: "Sonos", desc: "Multi-room audio & announcements", icon: "🔊", color: "#9CA3AF",
    category: "Smart Home & Standards", connectLabel: "Connect Sonos",
    whatYouGet: ["Multi-room audio control", "Announcements from automations", "Per-zone speaker grouping"],
    metrics: [{ label: "Speakers", value: "4" }, { label: "Rooms", value: "3" }, { label: "Playing", value: "1" }],
    feed: [{ icon: "🔊", title: "Kitchen · Arc", sub: "Playing · Jazz" }, { icon: "🔈", title: "Office · One", sub: "Idle" }],
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    id: "cameras", name: "Security Cameras", desc: "Live feeds and motion alerts from your cameras.", icon: "📷", color: "#7C3AED",
    category: "Security", defaultConnected: true,
    whatYouGet: ["Live RTSP/ONVIF feeds", "AI object detection events", "Per-zone camera wall"],
    metrics: [{ label: "Cameras", value: "6" }, { label: "Online", value: "5" }, { label: "Events today", value: "23" }],
    feed: [{ icon: "🚶", title: "Driveway · person", sub: "curier · 2m ago" }, { icon: "🦌", title: "Orchard · animal", sub: "căprioară · 11m ago" }],
    actions: [{ label: "Open camera wall", href: "/cameras" }],
  },
  {
    id: "ring", name: "Ring Doorbell", desc: "See who's at the door and get motion alerts.", icon: "🔔", color: "#22D3EE",
    category: "Security", connectLabel: "Connect Ring",
    whatYouGet: ["Doorbell press & motion alerts", "Two-way talk from the app", "Event clips in the timeline"],
    metrics: [{ label: "Devices", value: "2" }, { label: "Rings today", value: "3" }, { label: "Battery", value: "84%" }],
    feed: [{ icon: "🔔", title: "Front Door · ring", sub: "delivery · 35m ago" }, { icon: "🚶", title: "Front Door · motion", sub: "1h ago" }],
  },
  {
    id: "arlo", name: "Arlo / Eufy", desc: "Wireless security cameras and sensors.", icon: "🎥", color: "#4ADE80",
    category: "Security", connectLabel: "Connect Arlo / Eufy",
    whatYouGet: ["Wire-free battery cameras", "Local & cloud clip storage", "Person/vehicle detection"],
    metrics: [{ label: "Cameras", value: "3" }, { label: "Online", value: "3" }, { label: "Clips", value: "12" }],
    feed: [{ icon: "🎥", title: "Backyard · person", sub: "20m ago" }, { icon: "🚗", title: "Gate · vehicle", sub: "1h ago" }],
  },

  // ── Finance & Banking ─────────────────────────────────────────────────────
  {
    id: "revolut", name: "Revolut / Wise", desc: "Auto-import home expenses from your transactions.", icon: "💳", color: "#7C3AED",
    category: "Finance & Banking", connectLabel: "Connect account",
    whatYouGet: ["Auto-import home-related spend", "Categorize by zone & asset", "Monthly estate budget view"],
    metrics: [{ label: "This month", value: "€1,240" }, { label: "Imported", value: "38" }, { label: "Categories", value: "7" }],
    feed: [{ icon: "🔧", title: "Hornbach · €184.50", sub: "Maintenance · 2d ago" }, { icon: "🌱", title: "Garden Center · €62.10", sub: "Garden · 4d ago" }],
  },
  {
    id: "openbanking", name: "Open Banking", desc: "Connect your bank for automatic expense categorization.", icon: "🏦", color: "#22D3EE",
    category: "Finance & Banking", connectLabel: "Link your bank",
    whatYouGet: ["Secure read-only bank link", "Automatic categorization", "Estate cash-flow overview"],
    metrics: [{ label: "Accounts", value: "2" }, { label: "Inflow", value: "€4,800" }, { label: "Outflow", value: "€2,310" }],
    feed: [{ icon: "🏦", title: "Main Account", sub: "Linked · read-only" }, { icon: "💧", title: "Utilities · €210", sub: "Direct debit · 1d ago" }],
  },
  {
    id: "receipts", name: "Receipt Scanner", desc: "Scan and auto-categorize home improvement receipts.", icon: "🧾", color: "#4ADE80",
    category: "Finance & Banking", connectLabel: "Scan a receipt",
    whatYouGet: ["OCR scan of paper receipts", "Auto-categorize to zone/asset", "Attach to maintenance records"],
    metrics: [{ label: "Scanned", value: "14" }, { label: "Tracked", value: "€2,940" }, { label: "This month", value: "3" }],
    feed: [{ icon: "🧾", title: "Roof repair · €420", sub: "House · scanned today" }, { icon: "🧾", title: "Paint · €58", sub: "Garden shed · 3d ago" }],
  },

  // ── Rentals & Hospitality ─────────────────────────────────────────────────
  {
    id: "booking", name: "Booking.com", desc: "Manage short-term rental bookings and guest access.", icon: "🏨", color: "#22D3EE",
    category: "Rentals & Hospitality", connectLabel: "Connect Booking.com",
    whatYouGet: ["Sync reservations & calendar", "Guest check-in automation", "Occupancy & revenue tracking"],
    metrics: [{ label: "Upcoming", value: "4" }, { label: "Occupancy", value: "78%" }, { label: "Revenue", value: "€3,150" }],
    feed: [{ icon: "🧳", title: "Lake Cabin · 3 nights", sub: "Check-in Fri · €420" }, { icon: "🧳", title: "Guest House · 2 nights", sub: "Check-in Jun 28 · €260" }],
  },
  {
    id: "airbnb", name: "Airbnb", desc: "Sync Airbnb calendar and automate guest check-ins.", icon: "🏡", color: "#F97316",
    category: "Rentals & Hospitality", connectLabel: "Connect Airbnb",
    whatYouGet: ["Two-way calendar sync", "Smart-lock guest codes", "Reviews & messaging hub"],
    metrics: [{ label: "Upcoming", value: "5" }, { label: "Rating", value: "4.9" }, { label: "Revenue", value: "€4,720" }],
    feed: [{ icon: "🏡", title: "Orchard Loft · 4 nights", sub: "Check-in Sat · code set" }, { icon: "⭐", title: "New review · 5★", sub: "“Beautiful estate” · 1d ago" }],
  },
  {
    id: "vrbo", name: "VRBO / HomeAway", desc: "Track VRBO listings, occupancy and revenue.", icon: "🛏️", color: "#4ADE80",
    category: "Rentals & Hospitality", connectLabel: "Connect VRBO",
    whatYouGet: ["Listing & calendar sync", "Occupancy analytics", "Payout tracking"],
    metrics: [{ label: "Listings", value: "2" }, { label: "Occupancy", value: "64%" }, { label: "Payouts", value: "€2,080" }],
    feed: [{ icon: "🛏️", title: "Lakeside Suite", sub: "Booked Jul 1–5" }, { icon: "💶", title: "Payout · €640", sub: "Cleared · 2d ago" }],
  },

  // ── Energy & Environment ──────────────────────────────────────────────────
  {
    id: "energy", name: "Energy Tariff", desc: "Live day-ahead electricity prices for Belgium & Romania.", icon: "🔌", color: "#F59E0B",
    category: "Energy & Environment", connectLabel: "Connect tariff",
    live: "energy-tariff",
    whatYouGet: ["Live day-ahead spot prices (BE & RO)", "Cheapest-hour detection", "Drives charge-when-cheap automations"],
    metrics: [{ label: "Source", value: "Energy-Charts" }, { label: "Zones", value: "BE · RO" }, { label: "Update", value: "Hourly" }],
  },
  {
    id: "airquality", name: "Air Quality", desc: "European AQI & pollutants for your current location.", icon: "🫧", color: "#4ADE80",
    category: "Energy & Environment", connectLabel: "Connect air quality",
    live: "air-quality",
    whatYouGet: ["Real European AQI by location", "PM2.5 · PM10 · NO₂ · O₃ · SO₂", "Drives ventilation suggestions"],
    metrics: [{ label: "Source", value: "Open-Meteo" }, { label: "Scope", value: "Location" }, { label: "Update", value: "Hourly" }],
  },
  {
    id: "solar", name: "Solar / PV System", desc: "Monitor solar panel output and energy savings.", icon: "☀️", color: "#F59E0B",
    category: "Energy & Environment", defaultConnected: true,
    whatYouGet: ["Live solar production", "Self-consumption & export", "Savings vs grid"],
    metrics: [{ label: "Now", value: "6.5 kW" }, { label: "Today", value: "82 kWh" }, { label: "Self-use", value: "74%" }],
    actions: [{ label: "Open energy", href: "/twin/energy" }],
  },
  {
    id: "ev", name: "EV Charging", desc: "Track charging sessions and energy costs for your EV.", icon: "🚗", color: "#22D3EE",
    category: "Energy & Environment", defaultConnected: true,
    whatYouGet: ["Charging session history", "Charge-when-cheap scheduling", "Cost per session"],
    metrics: [{ label: "Battery", value: "69%" }, { label: "Session", value: "2.2 kW" }, { label: "Cost", value: "€4.10" }],
    actions: [{ label: "Open energy", href: "/twin/energy" }],
  },
  {
    id: "water", name: "Smart Water Meter", desc: "Monitor water consumption and detect leaks early.", icon: "💧", color: "#22D3EE",
    category: "Energy & Environment", connectLabel: "Connect water meter",
    whatYouGet: ["Real-time flow monitoring", "Leak & burst alerts", "Daily usage trends"],
    metrics: [{ label: "Today", value: "312 L" }, { label: "Flow", value: "0 L/min" }, { label: "Leaks", value: "0" }],
    feed: [{ icon: "💧", title: "Irrigation cycle", sub: "180 L · 06:00" }, { icon: "✅", title: "No leaks detected", sub: "Last check 5m ago" }],
  },
  {
    id: "weather", name: "OpenWeather", desc: "Forecast & climate data for the estate.", icon: "🌤️", color: "#F59E0B",
    category: "Energy & Environment", defaultConnected: true,
    whatYouGet: ["Hyper-local forecast", "Severe-weather alerts", "Drives seasonal tasks"],
    metrics: [{ label: "Now", value: "22°" }, { label: "High", value: "26°" }, { label: "Rain", value: "10%" }],
    actions: [{ label: "Open dashboard", href: "/" }],
  },
  {
    id: "rachio", name: "Rachio Irrigation", desc: "Smart irrigation with weather-aware scheduling.", icon: "🌱", color: "#4ADE80",
    category: "Energy & Environment", defaultConnected: true,
    whatYouGet: ["Weather-skip watering", "Per-zone schedules", "Water-usage savings"],
    metrics: [{ label: "Zones", value: "4" }, { label: "Next run", value: "06:00" }, { label: "Saved", value: "18%" }],
    actions: [{ label: "Automations", href: "/automations" }],
  },
];

export const CATEGORIES: IntegrationCategory[] = [
  "Smart Home & Standards",
  "Security",
  "Finance & Banking",
  "Rentals & Hospitality",
  "Energy & Environment",
];

export function getIntegration(id: string): Integration | undefined {
  return INTEGRATIONS.find((i) => i.id === id);
}

/** Merge persisted connection overrides over the catalog defaults (pure). */
export function resolveConnections(overrides: Record<string, boolean>): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const i of INTEGRATIONS) out[i.id] = i.id in overrides ? overrides[i.id] : Boolean(i.defaultConnected);
  return out;
}

const STORAGE_KEY = "prvio-integrations-v1";

type Ctx = {
  ready: boolean;
  connected: Record<string, boolean>;
  isConnected: (id: string) => boolean;
  connect: (id: string) => void;
  disconnect: (id: string) => void;
  connectedCount: number;
};

const IntegrationsContext = createContext<Ctx>({
  ready: false,
  connected: {},
  isConnected: () => false,
  connect: () => {},
  disconnect: () => {},
  connectedCount: 0,
});

export function IntegrationsProvider({ children }: { children: React.ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore */
    }
  }, [overrides, ready]);

  const connected = useMemo(() => resolveConnections(overrides), [overrides]);
  const isConnected = useCallback((id: string) => connected[id] ?? false, [connected]);
  const connect = useCallback((id: string) => setOverrides((o) => ({ ...o, [id]: true })), []);
  const disconnect = useCallback((id: string) => setOverrides((o) => ({ ...o, [id]: false })), []);
  const connectedCount = useMemo(() => Object.values(connected).filter(Boolean).length, [connected]);

  return (
    <IntegrationsContext.Provider value={{ ready, connected, isConnected, connect, disconnect, connectedCount }}>
      {children}
    </IntegrationsContext.Provider>
  );
}

export const useIntegrations = () => useContext(IntegrationsContext);
