/**
 * Insights engine (pure, testable).
 *
 * Fuses the estate's live conditions, possible faults and active smart rules
 * into a single ranked, actionable feed — the prototype stand-in for the AI
 * Layer's "predictive insights". The /insights screen renders the result.
 */
import type { Conditions } from "./automationRules";
import type { EvaluatedRule } from "./automationRules";
import type { PossibleFault } from "./diagnostics";

export type InsightKind = "action" | "warning" | "info" | "good";

export type Insight = {
  id: string;
  icon: string;
  title: string;
  detail: string;
  kind: InsightKind;
  color: string;
  href?: string;
};

const KIND_RANK: Record<InsightKind, number> = { action: 0, warning: 1, info: 2, good: 3 };

export const INSIGHT_COLOR: Record<InsightKind, string> = {
  action: "#22D3EE",
  warning: "#F59E0B",
  info: "#9CA3AF",
  good: "#4ADE80",
};

export function buildInsights(
  conditions: Conditions,
  faults: PossibleFault[],
  rules: EvaluatedRule[],
): Insight[] {
  const out: Insight[] = [];

  // 1. Critical/warning faults become high-priority insights.
  for (const f of faults) {
    if (f.severity === "watch") continue;
    out.push({
      id: `insight-fault-${f.id}`,
      icon: f.icon,
      title: f.title,
      detail: f.suggestions[0] ?? f.symptom,
      kind: f.severity === "critical" ? "warning" : "info",
      color: f.severity === "critical" ? "#EF4444" : "#F59E0B",
      href: "/diagnostics",
    });
  }

  // 2. Active smart rules become actionable insights.
  for (const r of rules) {
    if (!r.active) continue;
    out.push({
      id: `insight-rule-${r.id}`,
      icon: r.icon,
      title: r.action,
      detail: r.reason,
      kind: "action",
      color: INSIGHT_COLOR.action,
      href: "/automations",
    });
  }

  // 3. Condition-driven advice.
  if (conditions.rainSoon) {
    out.push({ id: "insight-rain", icon: "🌧️", title: "Rain expected", detail: `${conditions.condition} — outdoor tasks may be affected.`, kind: "info", color: INSIGHT_COLOR.info });
  }
  if (conditions.tariffAvg > 0 && conditions.tariffNow >= conditions.tariffAvg * 1.2) {
    out.push({ id: "insight-expensive", icon: "💸", title: "Power is expensive now", detail: `${conditions.tariffNow.toFixed(1)} ct/kWh — defer heavy loads.`, kind: "warning", color: INSIGHT_COLOR.warning, href: "/settings/integrations/energy" });
  }

  // 4. Positive signals when all is well.
  if (faults.length === 0) {
    out.push({ id: "insight-healthy", icon: "✅", title: "No faults detected", detail: "All sensors are within range.", kind: "good", color: INSIGHT_COLOR.good, href: "/diagnostics" });
  }
  if (conditions.aqi > 0 && conditions.aqi <= 40) {
    out.push({ id: "insight-air-good", icon: "🫧", title: "Air quality is good", detail: `AQI ${conditions.aqi} — safe to ventilate.`, kind: "good", color: INSIGHT_COLOR.good, href: "/settings/integrations/airquality" });
  }

  return out.sort((a, b) => KIND_RANK[a.kind] - KIND_RANK[b.kind]);
}
