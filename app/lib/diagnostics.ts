/**
 * Diagnostics engine — derives **possible faults** and **suggestions** from the
 * estate's sensor readings (the web-prototype stand-in for the AI Layer's
 * "predictive insights and anomaly detection" + "maintenance recommendations").
 *
 * Framework-free and deterministic so it can be unit-tested and reused; the
 * Diagnostics screen renders each fault with a Detail Disclosure Button that
 * opens the likely causes + suggested fixes.
 */

export type FaultSeverity = "critical" | "warning" | "watch";

export type SensorReading = {
  id: string;
  name: string;
  zone: string;
  /** Water | Air | Soil | Power | … — drives category-specific advice. */
  category: string;
  status: "ok" | "warning" | "error" | "offline";
  /** Battery percentage, or null for mains-powered sensors. */
  battery?: number | null;
  /** Minutes since the last reading (freshness). */
  lastSeenMins?: number;
};

export type PossibleFault = {
  id: string;
  title: string;
  zone: string;
  icon: string;
  severity: FaultSeverity;
  /** What was observed. */
  symptom: string;
  /** Ranked likely root causes. */
  likelyCauses: string[];
  /** Recommended actions (the "suggestions"). */
  suggestions: string[];
  /** Diagnostic confidence, 0–1. */
  confidence: number;
};

const SEVERITY_RANK: Record<FaultSeverity, number> = { critical: 0, warning: 1, watch: 2 };

export const SEVERITY_META: Record<FaultSeverity, { label: string; color: string }> = {
  critical: { label: "Critical", color: "#EF4444" },
  warning: { label: "Warning", color: "#F59E0B" },
  watch: { label: "Watch", color: "#22D3EE" },
};

const CATEGORY_ICON: Record<string, string> = {
  Water: "💧",
  Air: "🌡️",
  Soil: "🌱",
  Power: "⚡",
};

/** Category-specific likely causes for an out-of-range / errored reading. */
const CATEGORY_CAUSES: Record<string, string[]> = {
  Water: ["Clogged filter or intake", "Pump losing prime", "Valve stuck or leaking"],
  Air: ["Ventilation blocked", "HVAC filter saturated", "Door/vent left open"],
  Soil: ["Irrigation emitter blocked", "Drainage issue", "Probe needs recalibration"],
  Power: ["Inverter fault", "String/panel shading or soiling", "Loose DC connection"],
};

const CATEGORY_FIXES: Record<string, string[]> = {
  Water: ["Inspect and clean the filter/intake", "Check the pump and re-prime if needed", "Verify valve positions and seals"],
  Air: ["Clear vents and check airflow", "Replace the HVAC/HEPA filter", "Confirm doors and vents are closed"],
  Soil: ["Flush the irrigation line and clear emitters", "Check drainage and runoff", "Recalibrate the soil probe"],
  Power: ["Check the inverter status/error codes", "Clean panels and check for shading", "Inspect DC wiring connections"],
};

function genericFix(category: string): string[] {
  return CATEGORY_FIXES[category] ?? ["Inspect the affected component", "Schedule a maintenance check", "Review recent sensor history"];
}
function genericCauses(category: string): string[] {
  return CATEGORY_CAUSES[category] ?? ["Component wear or fault", "Environmental change", "Calibration drift"];
}

/**
 * Derive possible faults from sensor readings. Each rule maps an anomalous
 * signal to a fault with likely causes + suggested fixes, sorted by severity.
 */
export function deriveFaults(sensors: SensorReading[]): PossibleFault[] {
  const out: PossibleFault[] = [];

  for (const s of sensors) {
    const icon = CATEGORY_ICON[s.category] ?? "📟";

    if (s.status === "error") {
      out.push({
        id: `fault-${s.id}-error`,
        title: `${s.name} reading out of range`,
        zone: s.zone,
        icon,
        severity: "critical",
        symptom: `${s.name} is reporting an error-level value.`,
        likelyCauses: genericCauses(s.category),
        suggestions: genericFix(s.category),
        confidence: 0.8,
      });
    } else if (s.status === "warning") {
      out.push({
        id: `fault-${s.id}-warn`,
        title: `${s.name} drifting from optimal`,
        zone: s.zone,
        icon,
        severity: "warning",
        symptom: `${s.name} is outside its optimal range.`,
        likelyCauses: genericCauses(s.category),
        suggestions: genericFix(s.category),
        confidence: 0.6,
      });
    }

    if (s.status === "offline") {
      out.push({
        id: `fault-${s.id}-offline`,
        title: `${s.name} is offline`,
        zone: s.zone,
        icon,
        severity: "critical",
        symptom: `No data received from ${s.name}.`,
        likelyCauses: ["Sensor lost power", "Out of wireless range", "Gateway/connectivity outage"],
        suggestions: ["Check the sensor's power/battery", "Verify it is within gateway range", "Restart the sensor and confirm it re-pairs"],
        confidence: 0.7,
      });
    } else if (typeof s.lastSeenMins === "number" && s.lastSeenMins > 30) {
      out.push({
        id: `fault-${s.id}-stale`,
        title: `${s.name} data is stale`,
        zone: s.zone,
        icon,
        severity: "watch",
        symptom: `Last reading was ${s.lastSeenMins} minutes ago.`,
        likelyCauses: ["Intermittent connectivity", "Low battery throttling reports", "Gateway congestion"],
        suggestions: ["Check signal strength near the sensor", "Inspect the battery level", "Reduce the reporting interval if congested"],
        confidence: 0.5,
      });
    }

    if (typeof s.battery === "number" && s.battery <= 15) {
      out.push({
        id: `fault-${s.id}-batt`,
        title: `${s.name} battery low`,
        zone: s.zone,
        icon,
        severity: s.battery <= 5 ? "warning" : "watch",
        symptom: `Battery at ${s.battery}%.`,
        likelyCauses: ["Battery near end of life", "Cold temperatures reducing capacity", "Increased reporting frequency"],
        suggestions: ["Replace or recharge the battery", "Keep a spare for this sensor", "Lower the reporting frequency to extend life"],
        confidence: 0.9,
      });
    }
  }

  return out.sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
}

/** Roll-up counts for the diagnostics header. */
export function faultSummary(faults: PossibleFault[]): { critical: number; warning: number; watch: number; total: number } {
  return {
    critical: faults.filter((f) => f.severity === "critical").length,
    warning: faults.filter((f) => f.severity === "warning").length,
    watch: faults.filter((f) => f.severity === "watch").length,
    total: faults.length,
  };
}

/**
 * Demo sensor readings (the prototype stand-in for the live feed). A few are
 * deliberately anomalous so the diagnostics engine surfaces possible faults.
 * Shared by the Diagnostics screen and the per-zone summary sheet.
 */
export const DEMO_READINGS: SensorReading[] = [
  { id: "s1", name: "Lake Water Quality", zone: "Lake", category: "Water", status: "ok", battery: 92, lastSeenMins: 0 },
  { id: "s3", name: "Greenhouse CO₂", zone: "Greenhouse", category: "Air", status: "warning", battery: 100, lastSeenMins: 0 },
  { id: "s7", name: "Orchard Soil pH", zone: "Orchard", category: "Soil", status: "ok", battery: 12, lastSeenMins: 10 },
  { id: "s10", name: "Smart Pond DO", zone: "Smart Pond", category: "Water", status: "ok", battery: 88, lastSeenMins: 95 },
  { id: "s12", name: "Solar Inverter", zone: "Estate", category: "Power", status: "error", battery: null, lastSeenMins: 0 },
  { id: "s15", name: "Driveway Gate Sensor", zone: "Driveway", category: "Power", status: "offline", battery: 40, lastSeenMins: 60 },
];

/** Possible faults for a single zone (matched by zone name). */
export function faultsForZone(zoneName: string, sensors: SensorReading[] = DEMO_READINGS): PossibleFault[] {
  return deriveFaults(sensors.filter((s) => s.zone.toLowerCase() === zoneName.toLowerCase()));
}
