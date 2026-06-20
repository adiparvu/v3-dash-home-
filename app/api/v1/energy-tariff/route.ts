/**
 * GET /api/v1/energy-tariff?zone=BE|RO — day-ahead spot electricity prices.
 *
 * Sources Energy-Charts (Fraunhofer ISE, no key) for the requested bidding zone
 * and returns ct/kWh stats + the cheapest hour. Degrades to a deterministic
 * fallback curve so the UI always renders.
 */
import { NextResponse } from "next/server";
import { ZONES, tariffStats, tariffFallback, type TariffZone, type Tariff } from "@/app/lib/energyTariff";

export const dynamic = "force-dynamic";
const API_VERSION = "1.0.0";

function isZone(v: string | null): v is TariffZone {
  return v === "BE" || v === "RO" || v === "DE" || v === "FR" || v === "NL" || v === "ES" || v === "AT";
}

export async function GET(request: Request) {
  const zoneParam = new URL(request.url).searchParams.get("zone");
  const zone: TariffZone = isZone(zoneParam) ? zoneParam : "BE";

  try {
    const today = new Date();
    const iso = (d: Date) => d.toISOString().slice(0, 10);
    const tomorrow = new Date(today.getTime() + 24 * 3600 * 1000);
    const url = `https://api.energy-charts.info/price?bzn=${ZONES[zone].bzn}&start=${iso(today)}&end=${iso(tomorrow)}`;

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch(url, { signal: ctrl.signal, cache: "no-store" });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`upstream ${res.status}`);

    const j = await res.json();
    const unix: number[] = Array.isArray(j?.unix_seconds) ? j.unix_seconds : [];
    const price: number[] = Array.isArray(j?.price) ? j.price : [];
    if (unix.length === 0 || price.length === 0) throw new Error("empty series");

    const s = tariffStats(unix, price);
    const payload: Tariff = { zone, ...s, source: "live" };
    return NextResponse.json(
      { apiVersion: API_VERSION, data: payload },
      { headers: { "Cache-Control": "public, max-age=900, stale-while-revalidate=3600" } },
    );
  } catch {
    return NextResponse.json({ apiVersion: API_VERSION, data: tariffFallback(zone) });
  }
}
