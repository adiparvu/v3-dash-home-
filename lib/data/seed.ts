/**
 * Estate provisioning & seeding (onboarding).
 *
 * When a signed-in user finishes onboarding we create their owned `properties`
 * row and seed the property-scoped tables that power the live surfaces — zones,
 * the gateway device registry, room presence, automation schedules and a day of
 * energy readings. Everything goes through the RLS server client, so the owner's
 * own `auth.uid()` authorizes each insert (no service role, no orphan rows that
 * RLS would just hide). Idempotent: if the user already owns a property we return
 * it untouched.
 */
import { createClient } from "../supabase/server";
import { listProperties, createProperty } from "./estate";
import type { Property, ZoneType, TablesInsert } from "../types/database.types";

export type ProvisionOptions = {
  name: string;
  zones?: string[]; // zone ids selected during onboarding (best-effort mapped to zone_type)
};

const ZONE_TYPES: ReadonlySet<ZoneType> = new Set<ZoneType>([
  "forest", "greenhouse", "orchard", "lake", "garden", "house", "driveway", "smart_home", "custom",
]);
const ZONE_ICON: Record<string, string> = {
  lake: "💧", forest: "🌲", greenhouse: "🏡", orchard: "🍎",
  garden: "🌿", house: "🏠", driveway: "🚗", smart_home: "🏠",
};
const asZoneType = (id: string): ZoneType => (ZONE_TYPES.has(id as ZoneType) ? (id as ZoneType) : "custom");

// ── Default seed fixtures (mirror the in-app demo data) ───────────────────────
const SEED_DEVICES: Omit<TablesInsert<"device_registry">, "property_id">[] = [
  { name: "Living Room Lights", domain: "light", zone: "living", protocol: "Matter", is_local: true, is_online: true },
  { name: "Front Door Lock", domain: "lock", zone: "entry", protocol: "Thread", is_local: true, is_online: true },
  { name: "Kitchen Thermostat", domain: "climate", zone: "kitchen", protocol: "Wi-Fi", is_local: false, is_online: true },
  { name: "Garage Door", domain: "cover", zone: "driveway", protocol: "Z-Wave", is_local: true, is_online: true },
  { name: "Office Motion Sensor", domain: "binary_sensor", zone: "office", protocol: "Zigbee", is_local: true, is_online: true },
];
const SEED_PRESENCE: Omit<TablesInsert<"presence_events">, "property_id">[] = [
  { person: "alex", room: "living", present: true },
  { person: "maria", room: "kitchen", present: true },
  { person: "sofia", room: "office", present: true },
];
const SEED_SCHEDULES: Omit<TablesInsert<"automation_schedules">, "property_id">[] = [
  { automation_id: "Morning lights", area: "living", at_time: "07:00", enabled: true },
  { automation_id: "Away mode", area: "all", at_time: "09:00", enabled: true },
  { automation_id: "Evening scene", area: "living", at_time: "Sunset", enabled: true },
  { automation_id: "Night lock-up", area: "all", at_time: "23:00", enabled: true },
];

// One day of half-hourly energy readings via a sun curve (matches the edge fn).
function seedEnergyReadings(propertyId: string): TablesInsert<"energy_readings">[] {
  const out: TablesInsert<"energy_readings">[] = [];
  let pct = 62;
  const now = Date.now();
  for (let i = 47; i >= 0; i--) {
    const t = new Date(now - i * 30 * 60 * 1000);
    const h = t.getHours() + t.getMinutes() / 60;
    const sun = Math.max(0, Math.cos(((h - 13) / 12) * Math.PI));
    const solar = Math.round(6.8 * 0.72 * sun * 10) / 10;
    const home = Math.round((0.6 + Math.random() * 0.8) * 10) / 10;
    const vehicle = h > 1 && h < 5 ? 1.4 : 0; // overnight charge window
    const net = solar - home - vehicle;
    let battery = 0;
    if (net > 0) { battery = Math.min(net, 5); pct = Math.min(100, pct + battery * 0.12); }
    else { battery = -Math.min(-net, 5); pct = Math.max(15, pct + battery * 0.12); }
    const grid = Math.round((home + vehicle - solar + battery) * 10) / 10;
    out.push({
      property_id: propertyId,
      solar, home, vehicle, battery: Math.round(battery * 10) / 10, grid,
      battery_pct: Math.round(pct * 10) / 10,
      car_pct: Math.min(100, 55 + (47 - i) * 0.6),
      recorded_at: t.toISOString(),
    });
  }
  return out;
}

/**
 * Provision (or return) the signed-in user's estate. `ownerId` must be the
 * authenticated user's id so RLS authorizes the inserts.
 */
export async function provisionEstate(ownerId: string, opts: ProvisionOptions): Promise<{ property: Property; created: boolean }> {
  const existing = await listProperties();
  if (existing.length > 0) return { property: existing[0], created: false };

  const property = await createProperty(ownerId, { name: opts.name || "My Estate" });
  const supabase = await createClient();
  const pid = property.id;

  // Zones from onboarding selection (deduped), best-effort.
  const zoneIds = Array.from(new Set(opts.zones ?? ["house", "garden", "driveway"]));
  const zoneRows: TablesInsert<"zones">[] = zoneIds.map((id, i) => ({
    property_id: pid,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    type: asZoneType(id),
    icon: ZONE_ICON[id] ?? "📍",
    sort_order: i,
  }));

  // Seed everything; each insert is best-effort so a single failure (e.g. a
  // partially-applied schema) does not abort the whole provisioning.
  await Promise.allSettled([
    zoneRows.length ? supabase.from("zones").insert(zoneRows) : Promise.resolve(),
    supabase.from("device_registry").insert(SEED_DEVICES.map((d) => ({ ...d, property_id: pid }))),
    supabase.from("presence_events").insert(SEED_PRESENCE.map((p) => ({ ...p, property_id: pid }))),
    supabase.from("automation_schedules").insert(SEED_SCHEDULES.map((s) => ({ ...s, property_id: pid }))),
    supabase.from("energy_readings").insert(seedEnergyReadings(pid)),
  ]);

  return { property, created: true };
}
