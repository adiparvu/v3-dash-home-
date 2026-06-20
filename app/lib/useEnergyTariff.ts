"use client";

/** Energy-tariff hook — fetches /api/v1/energy-tariff for a bidding zone. */
import { useEffect, useState } from "react";
import { tariffFallback, type Tariff, type TariffZone } from "./energyTariff";

export function useEnergyTariff(zone: TariffZone): { data: Tariff; loading: boolean } {
  const [data, setData] = useState<Tariff>(() => tariffFallback(zone));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/v1/energy-tariff?zone=${zone}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (!cancelled && j?.data) setData(j.data as Tariff);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [zone]);

  return { data, loading };
}
