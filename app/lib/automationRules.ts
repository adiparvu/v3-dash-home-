/**
 * Real-data automation engine (pure, testable).
 *
 * Evaluates smart rules against the live estate conditions (energy tariff, air
 * quality, weather, UV, pollen) and returns which would fire now + the action
 * and reason. The automations screen renders these as live-status cards; the
 * insights feed reuses the same evaluation.
 */

export type Conditions = {
  tempC: number;
  condition: string;
  uv: number;
  /** Rain expected soon (from the current condition). */
  rainSoon: boolean;
  aqi: number;
  pollenMax: number;
  /** ct/kWh. */
  tariffNow: number;
  tariffAvg: number;
  tariffMin: number;
};

export type SmartRule = {
  id: string;
  name: string;
  icon: string;
  /** When the rule applies (human-readable). */
  when: string;
  /** What it does. */
  action: string;
  evaluate: (c: Conditions) => { active: boolean; reason: string };
};

/** A price is "cheap" when at/near the day's minimum or well below average. */
export function isCheapNow(c: Conditions): boolean {
  if (c.tariffAvg <= 0) return false;
  return c.tariffNow <= c.tariffMin * 1.15 || c.tariffNow < c.tariffAvg * 0.8;
}

export const SMART_RULES: SmartRule[] = [
  {
    id: "charge-cheap",
    name: "Charge EV when cheap",
    icon: "🚗",
    when: "Tariff at/near the daily low",
    action: "Start EV & Powerwall charging",
    evaluate: (c) => ({
      active: isCheapNow(c),
      reason: isCheapNow(c)
        ? `Now ${c.tariffNow.toFixed(1)} ct/kWh vs avg ${c.tariffAvg.toFixed(1)} — charging`
        : `Now ${c.tariffNow.toFixed(1)} ct/kWh — waiting for a cheaper window`,
    }),
  },
  {
    id: "air-protect",
    name: "Air quality protection",
    icon: "🫧",
    when: "AQI is poor (> 60)",
    action: "Close vents & run air purifier",
    evaluate: (c) => ({
      active: c.aqi > 60,
      reason: c.aqi > 60 ? `AQI ${c.aqi} — sealing & purifying` : `AQI ${c.aqi} — air is fine`,
    }),
  },
  {
    id: "pollen-guard",
    name: "Pollen guard",
    icon: "🌼",
    when: "Pollen is high",
    action: "Keep windows closed, alert allergy sufferers",
    evaluate: (c) => ({
      active: c.pollenMax >= 50,
      reason: c.pollenMax >= 50 ? `Pollen ${c.pollenMax} grains/m³ — high` : `Pollen ${c.pollenMax} grains/m³ — low`,
    }),
  },
  {
    id: "skip-irrigation",
    name: "Skip irrigation on rain",
    icon: "🌧️",
    when: "Rain expected",
    action: "Pause scheduled watering",
    evaluate: (c) => ({
      active: c.rainSoon,
      reason: c.rainSoon ? `${c.condition} expected — saving water` : "No rain — watering as scheduled",
    }),
  },
  {
    id: "uv-shade",
    name: "UV sun protection",
    icon: "🧴",
    when: "UV index ≥ 6",
    action: "Extend awnings, alert outdoor activity",
    evaluate: (c) => ({
      active: c.uv >= 6,
      reason: c.uv >= 6 ? `UV ${c.uv} — high exposure` : `UV ${c.uv} — moderate`,
    }),
  },
  {
    id: "precool",
    name: "Smart pre-cool",
    icon: "❄️",
    when: "Hot day + cheap power",
    action: "Pre-cool the house",
    evaluate: (c) => ({
      active: c.tempC >= 28 && isCheapNow(c),
      reason: c.tempC >= 28 && isCheapNow(c) ? `${c.tempC}° & cheap power — pre-cooling` : `${c.tempC}° — no pre-cool needed`,
    }),
  },
];

export type EvaluatedRule = SmartRule & { active: boolean; reason: string };

export function evaluateRules(c: Conditions, rules: SmartRule[] = SMART_RULES): EvaluatedRule[] {
  return rules
    .map((r) => ({ ...r, ...r.evaluate(c) }))
    .sort((a, b) => Number(b.active) - Number(a.active));
}
