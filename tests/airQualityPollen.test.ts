import { describe, it, expect } from "vitest";
import { pollenRisk, POLLEN_TYPES, AIR_QUALITY_FALLBACK } from "../app/lib/airQuality";

describe("pollenRisk", () => {
  it("maps grain counts to risk bands", () => {
    expect(pollenRisk(0).label).toBe("None");
    expect(pollenRisk(10).label).toBe("Low");
    expect(pollenRisk(30).label).toBe("Moderate");
    expect(pollenRisk(70).label).toBe("High");
    expect(pollenRisk(150).label).toBe("Very high");
  });
});

describe("pollen surface", () => {
  it("tracks four pollen types", () => {
    expect(POLLEN_TYPES.map((p) => p.key)).toEqual(["grass", "birch", "alder", "ragweed"]);
  });
  it("fallback includes pollen", () => {
    expect(AIR_QUALITY_FALLBACK.pollen).toBeDefined();
  });
});
