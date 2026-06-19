import { describe, it, expect } from "vitest";
import {
  formatValue,
  seasonalChecklist,
  buildWidget,
  buildLockWidgets,
  buildLiveActivities,
  widgetsForSize,
  type EstateSnapshot,
} from "../app/lib/widgets";

const snap: EstateSnapshot = {
  estateName: "Prvio Estate",
  healthScore: 87,
  zones: 26,
  objects: 142,
  openTasks: 7,
  alerts: 3,
  maintenanceDue: 1,
  nextMaintenanceDays: 3,
  propertyValue: 2_400_000,
  appreciationPct: 4.2,
  weather: { tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14 },
  security: { armed: true, cameras: 8, camerasOnline: 7, openDoors: 0 },
  month: 6,
};

describe("formatValue", () => {
  it("renders millions, thousands and units", () => {
    expect(formatValue(2_400_000)).toBe("€2.4M");
    expect(formatValue(3_000_000)).toBe("€3M");
    expect(formatValue(860_000)).toBe("€860K");
    expect(formatValue(420)).toBe("€420");
  });
});

describe("seasonalChecklist", () => {
  it("maps months to the four seasons", () => {
    expect(seasonalChecklist(0).season).toBe("Winter");
    expect(seasonalChecklist(3).season).toBe("Spring");
    expect(seasonalChecklist(6).season).toBe("Summer");
    expect(seasonalChecklist(9).season).toBe("Autumn");
  });
  it("always returns a non-empty item list", () => {
    for (let m = 0; m < 12; m++) {
      expect(seasonalChecklist(m).items.length).toBeGreaterThan(0);
    }
  });
});

describe("buildWidget", () => {
  it("derives the property status hero from the health score", () => {
    const w = buildWidget("propertyStatus", snap);
    expect(w.primary).toBe("87");
    expect(w.secondary).toContain("Very Good");
    expect(w.href).toBe("/");
  });

  it("flags maintenance accent when work is due", () => {
    const due = buildWidget("maintenance", snap);
    expect(due.primary).toBe("1");
    expect(due.accent).toBe("#F97316");
    const clear = buildWidget("maintenance", { ...snap, maintenanceDue: 0 });
    expect(clear.secondary).toBe("Nothing scheduled");
    expect(clear.accent).toBe("#4ADE80");
  });

  it("reflects armed/disarmed security state", () => {
    expect(buildWidget("security", snap).primary).toBe("Armed");
    expect(buildWidget("security", { ...snap, security: { ...snap.security, armed: false } }).primary).toBe("Disarmed");
  });

  it("formats the property value widget", () => {
    expect(buildWidget("propertyValue", snap).primary).toBe("€2.4M");
  });
});

describe("buildLockWidgets", () => {
  it("returns the five compact complications with deep links", () => {
    const lw = buildLockWidgets(snap);
    expect(lw.map((w) => w.id)).toEqual(["health", "tasks", "weather", "alerts", "security"]);
    expect(lw.every((w) => w.href.startsWith("/"))).toBe(true);
  });
});

describe("buildLiveActivities", () => {
  it("surfaces an alert activity when a door is open", () => {
    const open = buildLiveActivities({ ...snap, security: { ...snap.security, openDoors: 2 } });
    expect(open[0].state).toBe("alert");
    expect(open[0].id).toBe("security");
  });
  it("has no alert at the top when everything is secured", () => {
    expect(buildLiveActivities(snap)[0].state).not.toBe("alert");
  });
});

describe("widgetsForSize", () => {
  it("offers more kinds on small than large", () => {
    expect(widgetsForSize("small").length).toBeGreaterThan(widgetsForSize("large").length);
  });
});
