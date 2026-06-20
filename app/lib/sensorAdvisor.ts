/**
 * Sensor advisor — suggests which sensors to add or upgrade per zone type and
 * explains how to connect them through the backend-managed Home Assistant /
 * IoT gateway (clients never pair devices directly — see the integration spec).
 *
 * Framework-free + deterministic so it can be unit-tested and reused by the
 * zone detail sheet.
 */

/** Wireless protocols the gateway supports. */
export type SensorProtocol = "Matter" | "Thread" | "Zigbee" | "Z-Wave" | "Wi-Fi";

export type SensorRecommendation = {
  id: string;
  name: string;
  /** What the sensor measures. */
  measures: string;
  icon: string;
  /** Why it helps in this zone. */
  why: string;
  protocol: SensorProtocol;
  /** "add" a new capability, or "replace" an ageing/limited sensor. */
  intent: "add" | "replace";
  /** Step-by-step pairing via the gateway. */
  connectSteps: string[];
};

/** Generic connection flow shown once, above the per-sensor steps. */
export const CONNECTION_GUIDE = {
  intro:
    "All sensors join through the Home Assistant gateway — the app never talks to devices directly. Pair once, then assign the device to this zone.",
  steps: [
    "Open Settings → Integrations → Home Assistant.",
    "Tap “Add device” and choose the protocol below.",
    "Put the sensor in pairing mode (see its manual) and confirm when it appears.",
    "Assign the device to this zone and give it a name.",
    "Wait for the first reading — it then shows live in Sensors & the Digital Twin.",
  ],
  protocolNotes: {
    Matter: "Scan the Matter QR/code; works over Thread or Wi-Fi.",
    Thread: "Needs a Thread border router (HomePod/Apple TV or the gateway).",
    Zigbee: "Needs a Zigbee coordinator on the gateway.",
    "Z-Wave": "Needs a Z-Wave stick on the gateway; great range.",
    "Wi-Fi": "Joins your 2.4 GHz network directly; no hub required.",
  } as Record<SensorProtocol, string>,
};

function steps(protocol: SensorProtocol): string[] {
  return [
    "Settings → Integrations → Home Assistant → Add device",
    `Select ${protocol} and start pairing`,
    "Confirm the device, then assign it to this zone",
  ];
}

// Recommendations keyed by the four zone types used in the Zones screen.
const BY_TYPE: Record<string, SensorRecommendation[]> = {
  Natural: [
    { id: "soil-moisture", name: "Soil Moisture Probe", measures: "Volumetric water content", icon: "🌱", why: "Track ground saturation across forest/lake banks to prevent erosion and over/under-watering.", protocol: "Zigbee", intent: "add", connectSteps: steps("Zigbee") },
    { id: "water-level", name: "Ultrasonic Water Level", measures: "Lake/pond depth", icon: "📏", why: "Detect abnormal level changes (leaks, overflow, drought) early.", protocol: "Wi-Fi", intent: "add", connectSteps: steps("Wi-Fi") },
    { id: "water-quality", name: "Water Quality Multiprobe", measures: "pH · dissolved O₂ · temperature", icon: "💧", why: "Replace single-parameter probes with one multiprobe for richer water health.", protocol: "Wi-Fi", intent: "replace", connectSteps: steps("Wi-Fi") },
    { id: "wildlife-cam", name: "Wildlife / PIR Camera", measures: "Motion + AI object detection", icon: "📷", why: "Monitor wildlife and intrusions in remote natural zones.", protocol: "Wi-Fi", intent: "add", connectSteps: steps("Wi-Fi") },
  ],
  Agriculture: [
    { id: "soil-ph-ec", name: "Soil pH / EC Sensor", measures: "Acidity + nutrient salinity", icon: "🧪", why: "Dial in fertiliser and lime for orchard/greenhouse yield.", protocol: "Zigbee", intent: "add", connectSteps: steps("Zigbee") },
    { id: "co2", name: "CO₂ Sensor", measures: "Ambient CO₂ ppm", icon: "🌬️", why: "Optimise greenhouse growth and ventilation; replace ageing NDIR units for accuracy.", protocol: "Matter", intent: "replace", connectSteps: steps("Matter") },
    { id: "leaf-wetness", name: "Leaf Wetness Sensor", measures: "Foliage moisture", icon: "🍃", why: "Predict fungal disease risk and time treatments.", protocol: "Zigbee", intent: "add", connectSteps: steps("Zigbee") },
    { id: "par-light", name: "PAR / Light Sensor", measures: "Photosynthetic light (PPFD)", icon: "☀️", why: "Ensure crops get the right light; drive supplemental lighting.", protocol: "Thread", intent: "add", connectSteps: steps("Thread") },
  ],
  Infrastructure: [
    { id: "flow-meter", name: "Water Flow Meter", measures: "Pump/pipe flow rate", icon: "🌊", why: "Spot pump failures and leaks on irrigation/pond lines.", protocol: "Wi-Fi", intent: "add", connectSteps: steps("Wi-Fi") },
    { id: "leak", name: "Leak Detector", measures: "Water presence", icon: "💦", why: "Catch leaks around pumps, valves and tanks before damage.", protocol: "Zigbee", intent: "add", connectSteps: steps("Zigbee") },
    { id: "energy-clamp", name: "Energy Clamp Meter", measures: "Circuit power draw", icon: "⚡", why: "Sub-meter pumps/gates to find waste and faults.", protocol: "Wi-Fi", intent: "add", connectSteps: steps("Wi-Fi") },
    { id: "presence", name: "mmWave Presence Sensor", measures: "Presence + motion", icon: "📡", why: "Reliable presence at gates/driveways; replace flaky PIR units.", protocol: "Zigbee", intent: "replace", connectSteps: steps("Zigbee") },
  ],
  Built: [
    { id: "thermostat", name: "Smart Thermostat", measures: "Temperature + setpoint control", icon: "🌡️", why: "Zone-level climate control and scheduling for the house.", protocol: "Matter", intent: "add", connectSteps: steps("Matter") },
    { id: "contact", name: "Door / Window Contacts", measures: "Open / closed state", icon: "🚪", why: "Security + draft detection; basis for the open-door alerts.", protocol: "Thread", intent: "add", connectSteps: steps("Thread") },
    { id: "smoke-co", name: "Smoke / CO Alarm", measures: "Smoke + carbon monoxide", icon: "🔥", why: "Life-safety coverage, surfaced as Live Activities.", protocol: "Z-Wave", intent: "add", connectSteps: steps("Z-Wave") },
    { id: "air-quality", name: "Indoor Air Quality", measures: "VOC · PM2.5 · humidity", icon: "🫧", why: "Replace basic temp sensors with full IAQ for healthier rooms.", protocol: "Wi-Fi", intent: "replace", connectSteps: steps("Wi-Fi") },
  ],
};

/**
 * Recommend sensors for a zone. `existingMeasures` (lowercased substrings of
 * what the zone already monitors) demotes duplicates so suggestions favour gaps.
 */
export function recommendSensors(zoneType: string, existingMeasures: string[] = []): SensorRecommendation[] {
  const base = BY_TYPE[zoneType] ?? BY_TYPE.Infrastructure;
  const have = existingMeasures.map((m) => m.toLowerCase());
  const isCovered = (r: SensorRecommendation) =>
    have.some((h) => r.measures.toLowerCase().includes(h) || r.name.toLowerCase().includes(h));
  // Gaps first (add before replace), but always return the full list.
  return [...base].sort((a, b) => {
    const ca = isCovered(a) ? 1 : 0;
    const cb = isCovered(b) ? 1 : 0;
    if (ca !== cb) return ca - cb;
    return a.intent === b.intent ? 0 : a.intent === "add" ? -1 : 1;
  });
}
