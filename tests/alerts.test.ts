import { describe, it, expect } from "vitest";
import { deriveAlerts } from "../app/lib/twin/alerts";
import type { EnergyState } from "../app/lib/twin/energy";

const base: EnergyState = { solar: 1, home: 0.8, vehicle: 0, battery: 0, grid: 0, batteryPct: 80 };
const prefs = { backupReserve: 20, offGrid: false, stormWatch: true };

describe("live alert engine", () => {
  it("raises a low-battery alert near the reserve", () => {
    const a = deriveAlerts({ ...base, batteryPct: 22 }, 60, prefs);
    expect(a.some((x) => x.id === "live-batt-low" && x.severity === "alert")).toBe(true);
  });

  it("flags high grid import", () => {
    const a = deriveAlerts({ ...base, grid: 3.2 }, 60, prefs);
    expect(a.some((x) => x.id === "live-grid-import")).toBe(true);
  });

  it("celebrates a full EV", () => {
    const a = deriveAlerts(base, 100, prefs);
    expect(a.some((x) => x.id === "live-ev-full")).toBe(true);
  });

  it("is quiet under nominal conditions", () => {
    const a = deriveAlerts(base, 60, prefs);
    expect(a.length).toBe(0);
  });
});
