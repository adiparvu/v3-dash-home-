import { describe, it, expect } from "vitest";
import { INTEGRATIONS, CATEGORIES, getIntegration, resolveConnections } from "../app/lib/integrations";

describe("integrations catalog", () => {
  it("has unique ids and valid categories", () => {
    const ids = INTEGRATIONS.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const i of INTEGRATIONS) {
      expect(CATEGORIES).toContain(i.category);
    }
  });

  it("gives every integration the data its detail screen needs", () => {
    for (const i of INTEGRATIONS) {
      expect(i.whatYouGet.length).toBeGreaterThan(0);
      expect(i.metrics.length).toBeGreaterThan(0);
      expect(i.name.length).toBeGreaterThan(0);
    }
  });

  it("includes the integrations from the design (Hue/IKEA, Revolut, Airbnb, EV…)", () => {
    const ids = INTEGRATIONS.map((i) => i.id);
    for (const id of ["hue", "matter", "revolut", "openbanking", "receipts", "booking", "airbnb", "vrbo", "energy", "ev", "water"]) {
      expect(ids).toContain(id);
    }
  });

  it("getIntegration resolves by id", () => {
    expect(getIntegration("airbnb")?.name).toBe("Airbnb");
    expect(getIntegration("nope")).toBeUndefined();
  });
});

describe("resolveConnections", () => {
  it("applies catalog defaults when there are no overrides", () => {
    const c = resolveConnections({});
    expect(c.ha).toBe(true); // defaultConnected
    expect(c.airbnb).toBe(false); // not connected by default
  });

  it("lets overrides flip the default state", () => {
    const c = resolveConnections({ airbnb: true, ha: false });
    expect(c.airbnb).toBe(true);
    expect(c.ha).toBe(false);
  });

  it("covers every catalog integration", () => {
    const c = resolveConnections({});
    expect(Object.keys(c).sort()).toEqual(INTEGRATIONS.map((i) => i.id).sort());
  });
});
