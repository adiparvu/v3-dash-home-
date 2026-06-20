import { describe, it, expect } from "vitest";
import { quakeSeverity, distanceKm } from "../app/lib/earthquakes";

describe("quakeSeverity", () => {
  it("maps magnitude to a band", () => {
    expect(quakeSeverity(2).label).toBe("Minor");
    expect(quakeSeverity(3.5).label).toBe("Light");
    expect(quakeSeverity(4.5).label).toBe("Moderate");
    expect(quakeSeverity(5.5).label).toBe("Strong");
    expect(quakeSeverity(6.5).label).toBe("Major");
  });
});

describe("distanceKm", () => {
  it("is zero for the same point", () => {
    expect(distanceKm(45, 25, 45, 25)).toBe(0);
  });
  it("approximates a known distance (Bucharest→Brussels ≈ 1750 km)", () => {
    const d = distanceKm(44.43, 26.10, 50.85, 4.35);
    expect(d).toBeGreaterThan(1600);
    expect(d).toBeLessThan(1900);
  });
});
