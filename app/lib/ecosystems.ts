/**
 * Compatible ecosystems catalog — the smart-home brands the estate can connect
 * through the Home Assistant gateway. Each entry records how it joins (hub +
 * protocol) so the gateway screen can answer "can I connect Philips Hue / IKEA /
 * …?" concretely. Framework-free + testable.
 */
import type { SensorProtocol } from "./sensorAdvisor";

export type Ecosystem = {
  id: string;
  name: string;
  icon: string;
  category: string;
  /** Protocols this brand can use to reach the gateway. */
  protocols: SensorProtocol[];
  /** How it physically connects (hub / bridge / direct). */
  connection: string;
  /** Example products. */
  examples: string[];
  /** Whether it can run fully local (vs cloud-dependent). */
  local: boolean;
  note: string;
};

export const ECOSYSTEMS: Ecosystem[] = [
  {
    id: "hue", name: "Philips Hue", icon: "💡", category: "Lighting",
    protocols: ["Zigbee", "Matter"],
    connection: "Hue Bridge (Zigbee) — or add bulbs directly over Matter",
    examples: ["Hue bulbs", "Lightstrips", "Motion & contact sensors", "Smart plugs"],
    local: true,
    note: "Pair the Hue Bridge to Home Assistant for full local control; newer bulbs also expose Matter.",
  },
  {
    id: "ikea", name: "IKEA Home smart", icon: "🛋️", category: "Lighting & sensors",
    protocols: ["Zigbee", "Matter"],
    connection: "DIRIGERA (or older TRÅDFRI) hub over Zigbee — many devices also support Matter",
    examples: ["TRÅDFRI bulbs", "STYRBAR remotes", "VALLHORN motion", "PARASOLL door sensor", "Smart plugs"],
    local: true,
    note: "Add the DIRIGERA hub to Home Assistant, or join individual Zigbee devices to the gateway's coordinator.",
  },
  {
    id: "aqara", name: "Aqara", icon: "📡", category: "Sensors & security",
    protocols: ["Zigbee", "Matter"],
    connection: "Aqara hub (M2/M3) over Zigbee; M3 bridges to Matter",
    examples: ["Temp/humidity sensors", "Door & window contacts", "Presence (FP2)", "Smart locks", "Cameras"],
    local: true,
    note: "Great low-cost sensor coverage; the M3 hub exposes devices to Matter for the gateway.",
  },
  {
    id: "switchbot", name: "SwitchBot", icon: "🔘", category: "Switches & blinds",
    protocols: ["Wi-Fi", "Matter"],
    connection: "SwitchBot Hub (Bluetooth → Wi-Fi); Hub 2 supports Matter",
    examples: ["Bot button pusher", "Roller blinds", "Curtain", "Plug Mini", "Meters"],
    local: false,
    note: "Retrofit dumb devices; Matter via Hub 2 lets the gateway control them locally.",
  },
  {
    id: "sonos", name: "Sonos", icon: "🔊", category: "Audio",
    protocols: ["Wi-Fi"],
    connection: "Wi-Fi — local API discovered by Home Assistant",
    examples: ["Sonos One", "Arc", "Move", "Beam"],
    local: true,
    note: "Multi-room audio surfaces as media players; use it for announcements and automations.",
  },
  {
    id: "shelly", name: "Shelly", icon: "🔌", category: "Relays & energy",
    protocols: ["Wi-Fi"],
    connection: "Wi-Fi — local HTTP/MQTT (no cloud required)",
    examples: ["Shelly Plus 1", "Shelly Pro EM (energy)", "Dimmer", "Plug S"],
    local: true,
    note: "In-wall relays and clamp energy meters — ideal for the diagnostics & energy module.",
  },
  {
    id: "thermostats", name: "Smart thermostats", icon: "🌡️", category: "Climate",
    protocols: ["Wi-Fi", "Matter"],
    connection: "Wi-Fi or Matter (Tado, ecobee, Nest, Honeywell)",
    examples: ["Tado°", "ecobee", "Google Nest", "Honeywell"],
    local: false,
    note: "Drive per-zone heating/cooling; Matter models stay local.",
  },
  {
    id: "cameras", name: "Cameras (ONVIF/RTSP)", icon: "📷", category: "Security",
    protocols: ["Wi-Fi"],
    connection: "Wi-Fi/PoE — RTSP/ONVIF streams (Reolink, Ubiquiti, Hikvision)",
    examples: ["Reolink", "UniFi Protect", "Hikvision", "Amcrest"],
    local: true,
    note: "Feeds the Cameras & AI wall; pair with Frigate for local object detection.",
  },
  {
    id: "powerwall", name: "Tesla / inverters", icon: "🔋", category: "Energy",
    protocols: ["Wi-Fi"],
    connection: "Local/cloud API (Tesla Powerwall, SolarEdge, Fronius, Victron)",
    examples: ["Powerwall", "Tesla Wall Connector", "SolarEdge", "Fronius"],
    local: false,
    note: "Powers the Tesla-style energy module — solar, battery, grid flow.",
  },
  {
    id: "homekit", name: "Apple Home / Matter", icon: "🏠", category: "Hub & standard",
    protocols: ["Matter", "Thread"],
    connection: "Thread border router (HomePod/Apple TV) + Matter pairing",
    examples: ["HomePod (Thread)", "Apple TV", "Any Matter device"],
    local: true,
    note: "Matter-over-Thread is the forward-looking path; the gateway and Apple Home can share devices.",
  },
];

/** Group the catalog by category for display. */
export function ecosystemsByCategory(list: Ecosystem[] = ECOSYSTEMS): Record<string, Ecosystem[]> {
  return list.reduce<Record<string, Ecosystem[]>>((acc, e) => {
    (acc[e.category] ??= []).push(e);
    return acc;
  }, {});
}

/** Find ecosystems matching a free-text query (name, category or examples). */
export function searchEcosystems(query: string, list: Ecosystem[] = ECOSYSTEMS): Ecosystem[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.connection.toLowerCase().includes(q) ||
      e.note.toLowerCase().includes(q) ||
      e.examples.some((x) => x.toLowerCase().includes(q)),
  );
}
