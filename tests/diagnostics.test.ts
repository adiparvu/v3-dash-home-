import { describe, it, expect } from "vitest";
import { deriveFaults, faultSummary, type SensorReading } from "../app/lib/diagnostics";

const ok: SensorReading = { id: "s1", name: "Lake pH", zone: "Lake", category: "Water", status: "ok", battery: 90, lastSeenMins: 1 };

describe("deriveFaults", () => {
  it("returns no faults for a healthy estate", () => {
    expect(deriveFaults([ok, { ...ok, id: "s2" }])).toEqual([]);
  });

  it("flags an errored sensor as critical with causes and suggestions", () => {
    const [fault] = deriveFaults([{ ...ok, id: "s3", status: "error" }]);
    expect(fault.severity).toBe("critical");
    expect(fault.likelyCauses.length).toBeGreaterThan(0);
    expect(fault.suggestions.length).toBeGreaterThan(0);
  });

  it("flags a warning sensor as a warning fault", () => {
    const [fault] = deriveFaults([{ ...ok, id: "s4", status: "warning" }]);
    expect(fault.severity).toBe("warning");
  });

  it("detects offline and low-battery conditions", () => {
    const faults = deriveFaults([
      { ...ok, id: "s5", status: "offline" },
      { ...ok, id: "s6", battery: 8 },
    ]);
    const ids = faults.map((f) => f.id);
    expect(ids).toContain("fault-s5-offline");
    expect(ids).toContain("fault-s6-batt");
  });

  it("flags stale data as a watch-level fault", () => {
    const [fault] = deriveFaults([{ ...ok, id: "s7", lastSeenMins: 120 }]);
    expect(fault.severity).toBe("watch");
    expect(fault.symptom).toContain("120");
  });

  it("uses category-specific power advice", () => {
    const [fault] = deriveFaults([{ id: "p1", name: "Inverter", zone: "Estate", category: "Power", status: "error" }]);
    expect(fault.suggestions.join(" ")).toMatch(/inverter/i);
  });

  it("sorts critical faults ahead of watch faults", () => {
    const faults = deriveFaults([
      { ...ok, id: "a", lastSeenMins: 90 },     // watch
      { ...ok, id: "b", status: "error" },       // critical
    ]);
    expect(faults[0].severity).toBe("critical");
  });
});

describe("faultSummary", () => {
  it("rolls up counts by severity", () => {
    const faults = deriveFaults([
      { ...ok, id: "x", status: "error" },
      { ...ok, id: "y", status: "warning" },
      { ...ok, id: "z", lastSeenMins: 90 },
    ]);
    const sum = faultSummary(faults);
    expect(sum.critical).toBe(1);
    expect(sum.warning).toBe(1);
    expect(sum.watch).toBe(1);
    expect(sum.total).toBe(3);
  });
});
