import { describe, it, expect } from "vitest";
import { ECOSYSTEMS, searchEcosystems, ecosystemsByCategory } from "../app/lib/ecosystems";
import type { SensorProtocol } from "../app/lib/sensorAdvisor";

const PROTOCOLS: SensorProtocol[] = ["Matter", "Thread", "Zigbee", "Z-Wave", "Wi-Fi"];

describe("ecosystems catalog", () => {
  it("includes Philips Hue and IKEA", () => {
    const ids = ECOSYSTEMS.map((e) => e.id);
    expect(ids).toContain("hue");
    expect(ids).toContain("ikea");
  });

  it("gives every ecosystem valid protocols, a connection and examples", () => {
    for (const e of ECOSYSTEMS) {
      expect(e.protocols.length).toBeGreaterThan(0);
      expect(e.protocols.every((p) => PROTOCOLS.includes(p))).toBe(true);
      expect(e.connection.length).toBeGreaterThan(0);
      expect(e.examples.length).toBeGreaterThan(0);
    }
  });

  it("searches by name, category and example products", () => {
    expect(searchEcosystems("hue").map((e) => e.id)).toContain("hue");
    expect(searchEcosystems("DIRIGERA").map((e) => e.id)).toContain("ikea");
    expect(searchEcosystems("lighting").length).toBeGreaterThan(0);
    expect(searchEcosystems("").length).toBe(ECOSYSTEMS.length);
  });

  it("groups by category", () => {
    const grouped = ecosystemsByCategory();
    expect(Object.keys(grouped).length).toBeGreaterThan(1);
    const total = Object.values(grouped).reduce((n, arr) => n + arr.length, 0);
    expect(total).toBe(ECOSYSTEMS.length);
  });
});
