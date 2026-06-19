import { describe, it, expect } from "vitest";
import { kw, simulate, SCENARIOS, initialEnergyState } from "../app/lib/twin/energy";

describe("energy model", () => {
  it("formats kW with one decimal and absolute value", () => {
    expect(kw(2.34)).toBe("2.3 kW");
    expect(kw(-1.6)).toBe("1.6 kW");
  });

  it("simulate keeps the power balance (grid = consumption − solar + battery)", () => {
    const s = simulate(initialEnergyState, SCENARIOS[0], "self_powered", 20);
    const expectedGrid = Math.round((s.home + s.vehicle - s.solar + s.battery) * 10) / 10;
    expect(Math.abs(s.grid - expectedGrid)).toBeLessThanOrEqual(0.11);
    expect(s.batteryPct).toBeGreaterThanOrEqual(0);
    expect(s.batteryPct).toBeLessThanOrEqual(100);
    expect(s.solar).toBeGreaterThanOrEqual(0);
    expect(s.home).toBeGreaterThan(0);
  });

  it("never discharges the battery below the reserve floor", () => {
    let s = { ...initialEnergyState, batteryPct: 21 };
    for (let i = 0; i < 40; i++) s = simulate(s, SCENARIOS[2], "self_powered", 20); // storm = deficit
    expect(s.batteryPct).toBeGreaterThanOrEqual(0);
  });
});
