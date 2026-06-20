import { describe, it, expect } from "vitest";
import { buildInsights } from "../app/lib/insights";
import { evaluateRules, type Conditions } from "../app/lib/automationRules";
import { deriveFaults, type SensorReading } from "../app/lib/diagnostics";

const calm: Conditions = {
  tempC: 22, condition: "Clear", uv: 3, rainSoon: false,
  aqi: 30, pollenMax: 10, tariffNow: 12, tariffAvg: 12, tariffMin: 6,
};

describe("buildInsights", () => {
  it("returns positive insights when all is well", () => {
    const insights = buildInsights(calm, [], evaluateRules(calm));
    expect(insights.some((i) => i.kind === "good")).toBe(true);
  });

  it("surfaces a fault as a prioritized warning with a fix", () => {
    const sensors: SensorReading[] = [{ id: "p", name: "Inverter", zone: "Estate", category: "Power", status: "error" }];
    const faults = deriveFaults(sensors);
    const insights = buildInsights(calm, faults, evaluateRules(calm));
    const fault = insights.find((i) => i.id.startsWith("insight-fault-"))!;
    expect(fault.kind).toBe("warning");
    expect(fault.detail.length).toBeGreaterThan(0);
  });

  it("turns active smart rules into action insights", () => {
    const hostile: Conditions = { ...calm, aqi: 85, rainSoon: true, condition: "Rain" };
    const insights = buildInsights(hostile, [], evaluateRules(hostile));
    expect(insights.some((i) => i.kind === "action")).toBe(true);
  });

  it("ranks actions ahead of good news", () => {
    const cheap: Conditions = { ...calm, tariffNow: 6, tariffMin: 6, tariffAvg: 14 };
    const insights = buildInsights(cheap, [], evaluateRules(cheap));
    const firstAction = insights.findIndex((i) => i.kind === "action");
    const firstGood = insights.findIndex((i) => i.kind === "good");
    expect(firstAction).toBeGreaterThanOrEqual(0);
    if (firstGood >= 0) expect(firstAction).toBeLessThan(firstGood);
  });
});
