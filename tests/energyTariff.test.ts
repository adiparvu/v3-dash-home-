import { describe, it, expect } from "vitest";
import { toCentsPerKwh, tariffStats, tariffFallback, ZONES } from "../app/lib/energyTariff";

describe("toCentsPerKwh", () => {
  it("converts EUR/MWh to ct/kWh", () => {
    expect(toCentsPerKwh(80)).toBe(8);
    expect(toCentsPerKwh(123)).toBe(12.3);
  });
});

describe("tariffStats", () => {
  const t0 = 1_700_000_000;
  const unix = [t0, t0 + 3600, t0 + 7200, t0 + 10800];
  const eur = [100, 50, 200, 80]; // EUR/MWh

  it("computes min/max/avg in ct/kWh", () => {
    const s = tariffStats(unix, eur, t0 + 7200);
    expect(s.min).toBe(5); // 50 €/MWh
    expect(s.max).toBe(20); // 200 €/MWh
    expect(s.avg).toBeCloseTo(10.75, 2); // (100+50+200+80)/4 = 107.5 €/MWh
  });

  it("picks the current price at-or-before now", () => {
    const s = tariffStats(unix, eur, t0 + 7200);
    expect(s.current).toBe(20); // 200 €/MWh at t0+7200
  });

  it("finds the cheapest hour", () => {
    const s = tariffStats(unix, eur, t0);
    expect(s.cheapestAt).toBe(t0 + 3600); // 50 €/MWh
  });

  it("handles an empty series safely", () => {
    const s = tariffStats([], []);
    expect(s.points).toEqual([]);
    expect(s.current).toBe(0);
  });
});

describe("tariffFallback", () => {
  it("produces a usable curve for each zone", () => {
    for (const zone of Object.keys(ZONES) as Array<keyof typeof ZONES>) {
      const t = tariffFallback(zone);
      expect(t.zone).toBe(zone);
      expect(t.points.length).toBeGreaterThan(0);
      expect(t.source).toBe("fallback");
      expect(t.max).toBeGreaterThanOrEqual(t.min);
    }
  });
});
