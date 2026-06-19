/**
 * Widget data model — the web-prototype stand-in for the native iOS widget set
 * described in the master spec (Widgets & iOS Experience).
 *
 * Framework-free and deterministic so the same content can drive the on-device
 * Widget Gallery preview AND be unit-tested. Native SwiftUI WidgetKit timelines
 * (Phase 8) will reuse these shapes via the versioned backend contracts; here we
 * derive them from the live estate state.
 */

export type WidgetSize = "small" | "medium" | "large";

export type WidgetKind =
  | "tasks"
  | "propertyStatus"
  | "weather"
  | "seasonal"
  | "maintenance"
  | "propertyValue"
  | "security";

/** A single rendered widget snapshot, sized-agnostic; the view decides density. */
export type WidgetData = {
  kind: WidgetKind;
  title: string;
  icon: string;
  accent: string;
  /** Hero value (e.g. "87", "€2.4M", "22°"). */
  primary: string;
  /** Supporting line under the hero. */
  secondary?: string;
  /** Detail rows surfaced on medium/large sizes. */
  items?: { label: string; value?: string; done?: boolean; color?: string }[];
  /** Deep link opened when the widget is tapped. */
  href: string;
};

/** Compact Lock Screen / Notification Center complication. */
export type LockWidget = {
  id: string;
  icon: string;
  label: string;
  value: string;
  color: string;
  href: string;
};

/** A Live Activity timeline entry (maintenance jobs, deliveries, incidents…). */
export type LiveActivity = {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  /** 0–1 progress for the activity bar. */
  progress: number;
  state: "active" | "scheduled" | "alert";
  color: string;
  href: string;
};

export type EstateSnapshot = {
  estateName: string;
  healthScore: number;
  zones: number;
  objects: number;
  openTasks: number;
  alerts: number;
  maintenanceDue: number;
  /** Days until the next maintenance job. */
  nextMaintenanceDays: number;
  propertyValue: number;
  appreciationPct: number;
  weather: { tempC: number; condition: string; icon: string; high: number; low: number };
  security: { armed: boolean; cameras: number; camerasOnline: number; openDoors: number };
  /** Month index 0–11, used to pick the seasonal checklist. */
  month: number;
};

const ACCENT = "#4ADE80";
const CYAN = "#22D3EE";
const AMBER = "#F59E0B";
const ORANGE = "#F97316";

/** Compact currency for hero values: €2.4M / €860K / €4.2K. */
export function formatValue(value: number): string {
  if (value >= 1_000_000) return `€${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}M`;
  if (value >= 1_000) return `€${Math.round(value / 1_000)}K`;
  return `€${value}`;
}

/** Northern-hemisphere seasonal estate checklist, keyed by month. */
export function seasonalChecklist(month: number): { season: string; icon: string; items: { label: string; done: boolean }[] } {
  const seasons = [
    { months: [11, 0, 1], season: "Winter", icon: "❄️", items: [
      { label: "Insulate exposed pipes", done: true },
      { label: "Service heating / heat-pump", done: true },
      { label: "Clear gutters of debris", done: false },
      { label: "Check roof after storms", done: false },
    ] },
    { months: [2, 3, 4], season: "Spring", icon: "🌱", items: [
      { label: "Prune orchard & vines", done: true },
      { label: "Test irrigation system", done: false },
      { label: "Inspect greenhouse seals", done: false },
      { label: "Lake water-quality check", done: false },
    ] },
    { months: [5, 6, 7], season: "Summer", icon: "☀️", items: [
      { label: "Pool / pond maintenance", done: true },
      { label: "Solar panel cleaning", done: true },
      { label: "Fire-break clearing", done: false },
      { label: "AC filter replacement", done: false },
    ] },
    { months: [8, 9, 10], season: "Autumn", icon: "🍂", items: [
      { label: "Harvest orchard", done: true },
      { label: "Leaf clearing & mulching", done: false },
      { label: "Winterize outdoor taps", done: false },
      { label: "Chimney sweep & service", done: false },
    ] },
  ];
  return seasons.find((s) => s.months.includes(month)) ?? seasons[0];
}

function healthLabel(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 65) return "Good";
  if (score >= 50) return "Fair";
  return "Needs attention";
}

/** Build a single home-screen widget snapshot from the estate state. */
export function buildWidget(kind: WidgetKind, s: EstateSnapshot): WidgetData {
  switch (kind) {
    case "tasks":
      return {
        kind, title: "Open Tasks", icon: "✅", accent: ACCENT,
        primary: String(s.openTasks),
        secondary: s.openTasks === 0 ? "All clear" : `${s.openTasks} to do · ${s.alerts} alerts`,
        items: [
          { label: "Irrigation maintenance", value: "3d" },
          { label: "Greenhouse CO₂ check", value: "Today", color: ORANGE },
          { label: "Orchard inspection", value: "1w" },
        ],
        href: "/tasks",
      };
    case "propertyStatus":
      return {
        kind, title: s.estateName, icon: "🏡", accent: ACCENT,
        primary: String(s.healthScore),
        secondary: `${healthLabel(s.healthScore)} · ${s.zones} zones`,
        items: [
          { label: "Zones", value: String(s.zones) },
          { label: "Objects", value: String(s.objects) },
          { label: "Alerts", value: String(s.alerts), color: s.alerts > 0 ? ORANGE : ACCENT },
        ],
        href: "/",
      };
    case "weather":
      return {
        kind, title: "Estate Weather", icon: s.weather.icon, accent: CYAN,
        primary: `${s.weather.tempC}°`,
        secondary: `${s.weather.condition} · H:${s.weather.high}° L:${s.weather.low}°`,
        href: "/",
      };
    case "seasonal": {
      const sc = seasonalChecklist(s.month);
      return {
        kind, title: `${sc.season} Checklist`, icon: sc.icon, accent: AMBER,
        primary: `${sc.items.filter((i) => i.done).length}/${sc.items.length}`,
        secondary: "Seasonal estate tasks",
        items: sc.items.map((i) => ({ label: i.label, done: i.done })),
        href: "/maintenance",
      };
    }
    case "maintenance":
      return {
        kind, title: "Maintenance Due", icon: "🔧", accent: s.maintenanceDue > 0 ? ORANGE : ACCENT,
        primary: String(s.maintenanceDue),
        secondary: s.maintenanceDue === 0 ? "Nothing scheduled" : `Next in ${s.nextMaintenanceDays}d`,
        items: [
          { label: "HVAC filter", value: `${s.nextMaintenanceDays}d`, color: ORANGE },
          { label: "Pool service", value: "2w" },
        ],
        href: "/maintenance",
      };
    case "propertyValue":
      return {
        kind, title: "Property Value", icon: "📈", accent: ACCENT,
        primary: formatValue(s.propertyValue),
        secondary: `${s.appreciationPct >= 0 ? "▲" : "▼"} ${Math.abs(s.appreciationPct).toFixed(1)}% est. appreciation`,
        href: "/properties",
      };
    case "security":
      return {
        kind, title: "Security", icon: s.security.armed ? "🛡️" : "🔓", accent: s.security.armed ? ACCENT : ORANGE,
        primary: s.security.armed ? "Armed" : "Disarmed",
        secondary: `${s.security.camerasOnline}/${s.security.cameras} cameras · ${s.security.openDoors} open`,
        items: [
          { label: "Cameras online", value: `${s.security.camerasOnline}/${s.security.cameras}` },
          { label: "Open doors", value: String(s.security.openDoors), color: s.security.openDoors > 0 ? ORANGE : ACCENT },
        ],
        href: "/settings/security",
      };
  }
}

/** Lock Screen / Notification Center complications derived from the snapshot. */
export function buildLockWidgets(s: EstateSnapshot): LockWidget[] {
  return [
    { id: "health", icon: "🏡", label: "Health", value: String(s.healthScore), color: ACCENT, href: "/" },
    { id: "tasks", icon: "✅", label: "Tasks", value: String(s.openTasks), color: CYAN, href: "/tasks" },
    { id: "weather", icon: s.weather.icon, label: s.weather.condition, value: `${s.weather.tempC}°`, color: CYAN, href: "/" },
    { id: "alerts", icon: "⚠️", label: "Alerts", value: String(s.alerts), color: s.alerts > 0 ? ORANGE : ACCENT, href: "/notifications" },
    { id: "security", icon: s.security.armed ? "🛡️" : "🔓", label: "Security", value: s.security.armed ? "On" : "Off", color: s.security.armed ? ACCENT : ORANGE, href: "/settings/security" },
  ];
}

/** Live Activities — long-running estate operations (spec: Live Activities). */
export function buildLiveActivities(s: EstateSnapshot): LiveActivity[] {
  const out: LiveActivity[] = [
    { id: "maint", icon: "🔧", title: "HVAC filter replacement", subtitle: `Scheduled · next in ${s.nextMaintenanceDays}d`, progress: 0.25, state: "scheduled", color: AMBER, href: "/maintenance" },
    { id: "delivery", icon: "📦", title: "Garden supplies delivery", subtitle: "Out for delivery · ~2h", progress: 0.7, state: "active", color: CYAN, href: "/notifications" },
    { id: "inspection", icon: "🔍", title: "Roof inspection", subtitle: "Inspector on site", progress: 0.55, state: "active", color: ACCENT, href: "/maintenance" },
  ];
  if (s.security.openDoors > 0) {
    out.unshift({ id: "security", icon: "🚪", title: "Door left open", subtitle: `${s.security.openDoors} entry point(s) unsecured`, progress: 1, state: "alert", color: ORANGE, href: "/settings/security" });
  }
  return out;
}

/** Which widget kinds make sense at each size (small = 1 metric, large = rich). */
export function widgetsForSize(size: WidgetSize): WidgetKind[] {
  if (size === "small") return ["propertyStatus", "tasks", "weather", "maintenance", "propertyValue", "security"];
  if (size === "medium") return ["propertyStatus", "maintenance", "security", "propertyValue"];
  return ["tasks", "seasonal", "security"];
}
