/**
 * Estate snapshot builder (pure, testable).
 *
 * Composes the single `EstateSnapshot` that powers widget timelines, the native
 * client and the Siri "estate health" intent — one shape, one source of truth.
 * The dynamic parts (weather) are injected; the rest are estate metrics that the
 * backend would assemble from the property/security/energy services.
 */
import type { EstateSnapshot } from "./widgets";
import type { WeatherReading } from "./weather";

export type SnapshotOverrides = Partial<Omit<EstateSnapshot, "weather">>;

export function buildEstateSnapshot(
  weather: WeatherReading,
  overrides: SnapshotOverrides = {},
  now: Date = new Date(),
): EstateSnapshot {
  return {
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
    security: { armed: true, cameras: 8, camerasOnline: 7, openDoors: 0 },
    month: now.getMonth(),
    ...overrides,
    weather: { tempC: weather.tempC, condition: weather.condition, icon: weather.icon, high: weather.high, low: weather.low },
  };
}
