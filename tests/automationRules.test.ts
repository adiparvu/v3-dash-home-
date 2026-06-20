import { describe, it, expect } from "vitest";
import { evaluateRules, isCheapNow, SMART_RULES, type Conditions } from "../app/lib/automationRules";

const base: Conditions = {
  tempC: 22, condition: "Clear", uv: 3, rainSoon: false,
  aqi: 30, pollenMax: 10, tariffNow: 12, tariffAvg: 12, tariffMin: 6,
};

describe("isCheapNow", () => {
  it("is true near the daily minimum", () => {
    expect(isCheapNow({ ...base, tariffNow: 6.5, tariffMin: 6, tariffAvg: 12 })).toBe(true);
  });
  it("is true well below average", () => {
    // avg*0.8 = 9.6 → 9 < 9.6 ⇒ cheap
    expect(isCheapNow({ ...base, tariffNow: 9, tariffAvg: 12, tariffMin: 6 })).toBe(true);
  });
  it("is false at average price", () => {
    expect(isCheapNow({ ...base, tariffNow: 12, tariffMin: 6, tariffAvg: 12 })).toBe(false);
  });
});

describe("evaluateRules", () => {
  it("fires the air-quality rule when AQI is poor", () => {
    const r = evaluateRules({ ...base, aqi: 80 }).find((x) => x.id === "air-protect")!;
    expect(r.active).toBe(true);
  });

  it("fires skip-irrigation when rain is expected", () => {
    const r = evaluateRules({ ...base, rainSoon: true, condition: "Rain" }).find((x) => x.id === "skip-irrigation")!;
    expect(r.active).toBe(true);
  });

  it("fires UV shade at high UV", () => {
    const r = evaluateRules({ ...base, uv: 8 }).find((x) => x.id === "uv-shade")!;
    expect(r.active).toBe(true);
  });

  it("pre-cools only when hot AND cheap", () => {
    expect(evaluateRules({ ...base, tempC: 30, tariffNow: 6, tariffMin: 6, tariffAvg: 14 }).find((x) => x.id === "precool")!.active).toBe(true);
    expect(evaluateRules({ ...base, tempC: 30, tariffNow: 14 }).find((x) => x.id === "precool")!.active).toBe(false);
  });

  it("sorts active rules first and covers every rule", () => {
    const evaluated = evaluateRules({ ...base, aqi: 90 });
    expect(evaluated.length).toBe(SMART_RULES.length);
    expect(evaluated[0].active).toBe(true);
  });
});
