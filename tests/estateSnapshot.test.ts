import { describe, it, expect } from "vitest";
import { describeWeather, WEATHER_FALLBACK } from "../app/lib/weather";
import { buildEstateSnapshot } from "../app/lib/estateSnapshot";

describe("describeWeather", () => {
  it("maps WMO codes to condition + icon", () => {
    expect(describeWeather(0).condition).toBe("Clear");
    expect(describeWeather(3).condition).toBe("Overcast");
    expect(describeWeather(65).condition).toBe("Rain");
    expect(describeWeather(95).condition).toBe("Thunderstorm");
  });
});

describe("buildEstateSnapshot", () => {
  const weather = { ...WEATHER_FALLBACK, tempC: 19, condition: "Rain", icon: "🌧️", high: 21, low: 12 };

  it("merges live weather into the snapshot", () => {
    const s = buildEstateSnapshot(weather, {}, new Date("2026-06-20"));
    expect(s.weather).toEqual({ tempC: 19, condition: "Rain", icon: "🌧️", high: 21, low: 12 });
    expect(s.month).toBe(5); // June (0-indexed)
    expect(s.healthScore).toBe(87);
  });

  it("applies overrides over the defaults", () => {
    const s = buildEstateSnapshot(weather, { healthScore: 73, openTasks: 2 });
    expect(s.healthScore).toBe(73);
    expect(s.openTasks).toBe(2);
  });

  it("always carries a full security block", () => {
    const s = buildEstateSnapshot(weather);
    expect(s.security.cameras).toBeGreaterThan(0);
    expect(typeof s.security.armed).toBe("boolean");
  });
});
