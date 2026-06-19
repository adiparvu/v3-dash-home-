"use client";

/**
 * Live energy feed for /twin/energy.
 *
 * Prefers the real event bus: when Supabase is configured the hook subscribes to
 * the `prvio-energy` Supabase Realtime broadcast channel (published by the
 * backend / Home Assistant gateway) and drives the readings from it. When no
 * realtime data is flowing — or Supabase is unconfigured (localStorage prototype
 * mode) — it falls back to the on-device power-balance simulation. A `source`
 * flag ("live" | "sim") lets the UI show which feed is active.
 */
import { useEffect, useRef, useState } from "react";
import { SCENARIOS, simulate, type EnergyState } from "./energy";

const START: EnergyState = { solar: 6.5, home: 0.8, vehicle: 2.2, battery: 4.9, grid: 0, batteryPct: 89 };

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type EnergySource = "live" | "sim";

const num = (v: unknown): number | undefined => (typeof v === "number" && isFinite(v) ? v : undefined);

export function useEnergyLive(): { s: EnergyState; carPct: number; source: EnergySource } {
  const [s, setS] = useState<EnergyState>(START);
  const [carPct, setCarPct] = useState(69);
  const [source, setSource] = useState<EnergySource>("sim");
  // While realtime data is fresh, the simulation tick stands down.
  const liveUntil = useRef(0);

  // Baseline simulation (also the fallback when realtime is silent).
  useEffect(() => {
    const id = setInterval(() => {
      if (Date.now() < liveUntil.current) return;
      setS((prev) => simulate(prev, SCENARIOS[0], "self_powered", 20));
      setCarPct((p) => Math.min(100, Math.round((p + 0.4) * 10) / 10));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // Real event bus (Supabase Realtime broadcast) when configured.
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    let cancelled = false;
    let flip: ReturnType<typeof setTimeout> | undefined;
    let unsubscribe: (() => void) | undefined;

    (async () => {
      const { createClient } = await import("../../../lib/supabase/client");
      const supabase = createClient();
      const channel = supabase
        .channel("prvio-energy")
        .on("broadcast", { event: "state" }, (msg: { payload?: Record<string, unknown> }) => {
          if (cancelled) return;
          const p = msg.payload ?? {};
          setS((prev) => ({
            solar: num(p.solar) ?? prev.solar,
            home: num(p.home) ?? prev.home,
            vehicle: num(p.vehicle) ?? prev.vehicle,
            battery: num(p.battery) ?? prev.battery,
            grid: num(p.grid) ?? prev.grid,
            batteryPct: num(p.batteryPct) ?? prev.batteryPct,
          }));
          const cp = num(p.carPct);
          if (cp !== undefined) setCarPct(cp);
          setSource("live");
          liveUntil.current = Date.now() + 6000;
          clearTimeout(flip);
          flip = setTimeout(() => setSource("sim"), 6500);
        })
        .subscribe();
      unsubscribe = () => { supabase.removeChannel(channel); };
    })();

    return () => { cancelled = true; clearTimeout(flip); unsubscribe?.(); };
  }, []);

  return { s, carPct, source };
}
