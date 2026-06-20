import { describe, it, expect } from "vitest";
import { recommendSensors, CONNECTION_GUIDE, type SensorProtocol } from "../app/lib/sensorAdvisor";

const PROTOCOLS: SensorProtocol[] = ["Matter", "Thread", "Zigbee", "Z-Wave", "Wi-Fi"];

describe("recommendSensors", () => {
  it("returns recommendations for every zone type", () => {
    for (const type of ["Natural", "Agriculture", "Infrastructure", "Built"]) {
      const recs = recommendSensors(type);
      expect(recs.length).toBeGreaterThan(0);
    }
  });

  it("falls back to a sensible default for unknown zone types", () => {
    expect(recommendSensors("Unknown").length).toBeGreaterThan(0);
  });

  it("gives every recommendation a valid protocol and connect steps", () => {
    const recs = recommendSensors("Agriculture");
    for (const r of recs) {
      expect(PROTOCOLS).toContain(r.protocol);
      expect(r.connectSteps.length).toBeGreaterThan(0);
      expect(["add", "replace"]).toContain(r.intent);
    }
  });

  it("demotes already-covered measures so gaps surface first", () => {
    const recs = recommendSensors("Agriculture", ["CO₂"]);
    const co2Index = recs.findIndex((r) => r.id === "co2");
    // A covered sensor should not be first when uncovered gaps exist.
    expect(co2Index).toBeGreaterThan(0);
  });

  it("exposes a connection guide with steps and protocol notes", () => {
    expect(CONNECTION_GUIDE.steps.length).toBeGreaterThan(0);
    for (const p of PROTOCOLS) {
      expect(CONNECTION_GUIDE.protocolNotes[p].length).toBeGreaterThan(0);
    }
  });
});
