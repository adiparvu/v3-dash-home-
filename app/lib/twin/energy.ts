/**
 * Tesla-style energy model for the PRVIO Energy module (/twin/energy).
 *
 * Framework-free: simulates a home energy system (Solar · Powerwall · Home ·
 * Grid · Vehicle) with a live power balance, derives directional flows for the
 * animated diagram, and provides the history / impact / tariff datasets behind
 * the Energie, Impact and Powerwall sub-tabs. In the platform these are fed by
 * the backend / Home Assistant gateway; here they are simulated on device.
 */

export type EnergyNodeId = "solar" | "battery" | "home" | "grid" | "vehicle";

export type EnergyScenario = {
  id: string;
  label: string;
  sub: string;
  icon: string;
  /** Fraction of peak solar produced (0–1). */
  solarFactor: number;
  /** Base home-load multiplier. */
  homeBias: number;
  storm?: boolean;
};

export const SCENARIOS: EnergyScenario[] = [
  { id: "morning", label: "Dimineață – însorit", sub: "Generare din energie solară", icon: "☀️", solarFactor: 0.72, homeBias: 0.85 },
  { id: "afternoon", label: "După-amiază – înnorat", sub: "Powerwall export în rețea", icon: "⛅", solarFactor: 0.34, homeBias: 1.0 },
  { id: "evening", label: "Seara – furtună puternică", sub: "Alerte furtuni pregătește sistemul", icon: "⛈️", solarFactor: 0.05, homeBias: 1.25, storm: true },
];

export type EnergyMode = "self_powered" | "time_based";

export type EnergyState = {
  solar: number;
  home: number;
  vehicle: number;
  /** Battery throughput kW; sign: + charging, − discharging. */
  battery: number;
  /** Grid kW; sign: + importing, − exporting. */
  grid: number;
  batteryPct: number;
};

const PEAK_SOLAR = 6.8; // kW
const MAX_BATTERY = 5.0; // kW charge/discharge

export const initialEnergyState: EnergyState = {
  solar: 4.9,
  home: 0.8,
  vehicle: 0.8,
  battery: 3.3,
  grid: 0,
  batteryPct: 89,
};

const jitter = (v: number, frac: number) => v * (1 + (Math.random() - 0.5) * frac);

/** One simulation step honoring the operational mode and backup reserve. */
export function simulate(prev: EnergyState, scenario: EnergyScenario, mode: EnergyMode, reserve: number): EnergyState {
  const solar = Math.max(0, Math.round(jitter(PEAK_SOLAR * scenario.solarFactor, 0.18) * 10) / 10);
  const home = Math.max(0.2, Math.round(jitter(0.9 * scenario.homeBias, 0.25) * 10) / 10);
  // Vehicle charges opportunistically when there is daytime surplus.
  const vehicle = scenario.solarFactor > 0.4 && prev.batteryPct > 40 ? Math.round(jitter(1.4, 0.2) * 10) / 10 : 0;

  const consumption = home + vehicle;
  const net = solar - consumption; // + surplus, − deficit

  let battery = 0; // + charging, − discharging
  let pct = prev.batteryPct;

  if (net > 0) {
    // Surplus: charge unless full; time-based mode charges more aggressively.
    const canCharge = pct < 100 ? Math.min(net, MAX_BATTERY) : 0;
    battery = canCharge;
    pct = Math.min(100, pct + canCharge * 0.12);
  } else if (net < 0) {
    const deficit = -net;
    // Self-powered discharges down to the reserve; time-based may hold for peak.
    const floor = mode === "self_powered" ? reserve : Math.max(reserve, 25);
    const canDischarge = pct > floor ? Math.min(deficit, MAX_BATTERY) : 0;
    battery = -canDischarge;
    pct = Math.max(0, pct - canDischarge * 0.12);
  }

  // Grid balances whatever the battery did not.
  const grid = Math.round((consumption - solar + battery) * 10) / 10;

  return {
    solar,
    home,
    vehicle,
    battery: Math.round(battery * 10) / 10,
    grid,
    batteryPct: Math.round(pct * 10) / 10,
  };
}

export type Flow = { from: EnergyNodeId; to: EnergyNodeId; kw: number };

/** Derive directional flows (home is the hub) from a state, for the diagram. */
export function computeFlows(s: EnergyState): Flow[] {
  const flows: Flow[] = [];
  const consumption = s.home + s.vehicle;
  const solarToLoad = Math.min(s.solar, consumption);
  const solarSurplus = Math.max(0, s.solar - solarToLoad);
  const loadDeficit = Math.max(0, consumption - solarToLoad);

  const toBattery = s.battery > 0 ? Math.min(solarSurplus, s.battery) : 0;
  const toGridExport = Math.max(0, solarSurplus - toBattery);
  const fromBattery = s.battery < 0 ? Math.min(loadDeficit, -s.battery) : 0;
  const fromGridImport = Math.max(0, loadDeficit - fromBattery);

  const push = (from: EnergyNodeId, to: EnergyNodeId, kw: number) => { if (kw > 0.05) flows.push({ from, to, kw: Math.round(kw * 10) / 10 }); };
  push("solar", "home", solarToLoad);
  push("solar", "battery", toBattery);
  push("solar", "grid", toGridExport);
  push("battery", "home", fromBattery);
  push("grid", "home", fromGridImport);
  push("home", "vehicle", s.vehicle);
  return flows;
}

// ── Static datasets for Energie / Impact / Powerwall tabs ────────────────────

/** Home usage per month (MWh) for the Energie bar chart. */
export const MONTHLY_USAGE = [0.95, 0.9, 0.82, 0.78, 0.8, 0.84, 0.92, 0.95, 0.8, 0.83, 0.96, 0.85];
export const MONTH_LABELS = ["I", "F", "M", "A", "M", "I", "I", "A", "S", "O", "N", "D"];

/** "Utilizat din" energy-source breakdown (Energie tab). */
export const ENERGY_SOURCES = [
  { id: "battery", label: "Powerwall", pct: 36, mwh: 3.6, color: "#4ADE80", icon: "🔋" },
  { id: "solar", label: "Solar", pct: 33, mwh: 3.3, color: "#F59E0B", icon: "☀️" },
  { id: "grid", label: "Grilă", pct: 31, mwh: 3.1, color: "#9CA3AF", icon: "🏛️" },
];

/** Autonomy split (Impact donut). */
export const AUTONOMY = { total: 70, solar: 33, battery: 37, grid: 30 };

/** Time-of-use breakdown (Durata utilizării). */
export const TOU_PERIODS = [
  { id: "peak", label: "Vârf", mwh: 2.42, solar: 2, battery: 96, grid: 2 },
  { id: "partial", label: "Vârf parțial", mwh: 1.22, solar: 28, battery: 64, grid: 8 },
  { id: "offpeak", label: "În afara perioadei", mwh: 1.9, solar: 41, battery: 47, grid: 12 },
];

/** Solar value in currency per month (Impact). */
export const SOLAR_VALUE = [120, 150, 190, 280, 330, 410, 603, 470, 250, 180, 150, 70];
export const SOLAR_VALUE_TOTAL = 3796;

/** Solar offset: generation vs consumption (Impact). */
export const OFFSET = { solarMwh: 15.0, homeMwh: 10.1, pct: 148 };

/** Backup outage history (Impact / Off-grid). */
export const BACKUP_EVENTS = [
  { date: "7 dec.", window: "02:34 – 02:35", duration: "câteva secunde" },
  { date: "12 nov.", window: "11:25 – 11:27", duration: "2 minute" },
  { date: "11 nov.", window: "18:05 – 22:45", duration: "5 ore" },
];
export const BACKUP_SUMMARY = { events: 22, total: "10 ore", longest: "5 ore" };

/** Hourly tariff series (RON/kWh) for the plan summary. */
export const TARIFF_SERIES = [
  0.18, 0.17, 0.16, 0.16, 0.17, 0.19, 0.24, 0.28, 0.26, 0.22, 0.2, 0.19,
  0.19, 0.2, 0.21, 0.23, 0.27, 0.32, 0.34, 0.31, 0.27, 0.24, 0.21, 0.19,
];
export const TARIFF = { buy: 0.24, sell: 0.24, provider: "Tibber", currency: "RON" };

/** kW string with a fixed decimal. */
export const kw = (v: number) => `${Math.abs(v).toFixed(1)} kW`;
