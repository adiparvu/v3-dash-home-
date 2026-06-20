import { describe, it, expect } from "vitest";
import { aqiCategory, POLLUTANTS } from "../app/lib/airQuality";

describe("aqiCategory", () => {
  it("maps the European AQI to the six bands", () => {
    expect(aqiCategory(10).label).toBe("Good");
    expect(aqiCategory(30).label).toBe("Fair");
    expect(aqiCategory(50).label).toBe("Moderate");
    expect(aqiCategory(70).label).toBe("Poor");
    expect(aqiCategory(90).label).toBe("Very poor");
    expect(aqiCategory(140).label).toBe("Extremely poor");
  });

  it("gives each band a colour", () => {
    for (const v of [10, 30, 50, 70, 90, 140]) {
      expect(aqiCategory(v).color).toMatch(/^#/);
    }
  });

  it("lists the five tracked pollutants", () => {
    expect(POLLUTANTS.map((p) => p.key)).toEqual(["pm25", "pm10", "no2", "o3", "so2"]);
  });
});
