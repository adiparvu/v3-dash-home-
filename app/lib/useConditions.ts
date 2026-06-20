"use client";

/** Assembles live estate Conditions from the real weather / air / tariff feeds. */
import { useWeather } from "./useWeather";
import { useAirQuality } from "./useAirQuality";
import { useEnergyTariff } from "./useEnergyTariff";
import type { Conditions } from "./automationRules";
import type { TariffZone } from "./energyTariff";

const RAINY = ["rain", "drizzle", "shower", "thunder", "snow"];

export function useConditions(zone: TariffZone = "BE"): { conditions: Conditions; live: boolean } {
  const weather = useWeather();
  const { data: air } = useAirQuality();
  const { data: tariff } = useEnergyTariff(zone);

  const conditions: Conditions = {
    tempC: weather.tempC,
    condition: weather.condition,
    uv: weather.uv,
    rainSoon: RAINY.some((w) => weather.condition.toLowerCase().includes(w)),
    aqi: air.aqi,
    pollenMax: Math.max(...Object.values(air.pollen)),
    tariffNow: tariff.current,
    tariffAvg: tariff.avg,
    tariffMin: tariff.min,
  };

  const live = weather.source === "live" || air.source === "live" || tariff.source === "live";
  return { conditions, live };
}
