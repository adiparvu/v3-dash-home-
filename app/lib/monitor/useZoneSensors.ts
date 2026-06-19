"use client";

/**
 * Zone-Monitoring framework — live metrics hook.
 *
 * Binds a module's MetricSpec[] to live `sensors` for a zone: fetches the latest
 * values from /api/v1/twin/sensors and subscribes to `telemetry` INSERTs
 * (migration 009 publishes it on Realtime) so cards update live. When Supabase is
 * unconfigured, signed out, or the zone has no sensors yet, it returns the specs'
 * demo values. A `source` flag ("live" | "demo") badges which feed is active.
 */
import { useEffect, useRef, useState } from "react";
import { type MetricReading, type MetricSpec, statusOf, demoSeries } from "./types";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
const MAX_SERIES = 48;

type Source = "demo" | "live";

function bake(specs: MetricSpec[]): MetricReading[] {
  return specs.map((s) => ({
    ...s,
    value: s.demo,
    status: statusOf(s.demo, s),
    series: s.demoSeries ?? demoSeries(s.demo),
  }));
}

export function useZoneSensors(zoneType: string, specs: MetricSpec[]): {
  metrics: MetricReading[];
  source: Source;
} {
  const [metrics, setMetrics] = useState<MetricReading[]>(() => bake(specs));
  const [source, setSource] = useState<Source>("demo");
  // sensor_id → spec.key, so realtime telemetry can be routed to the right card.
  const sensorMap = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!CONFIGURED) return;
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const applyValue = (key: string, value: number) => {
      setMetrics((prev) =>
        prev.map((m) =>
          m.key === key
            ? { ...m, value, status: statusOf(value, m), series: [...m.series, value].slice(-MAX_SERIES) }
            : m,
        ),
      );
    };

    fetch(`/api/v1/twin/sensors?zone=${encodeURIComponent(zoneType)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((j) => {
        if (cancelled) return;
        const sensors: Array<{ id: string; type: string; value: number | null }> = j?.data?.sensors ?? [];
        if (!sensors.length) return;
        let matched = false;
        for (const sensor of sensors) {
          const spec = specs.find((s) => s.key === sensor.type);
          if (!spec) continue;
          sensorMap.current.set(sensor.id, spec.key);
          if (sensor.value !== null) { applyValue(spec.key, sensor.value); matched = true; }
        }
        if (matched) setSource("live");
      })
      .catch(() => {});

    (async () => {
      const { createClient } = await import("../../../lib/supabase/client");
      const supabase = createClient();
      const channel = supabase
        .channel(`zone-sensors-${zoneType}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "telemetry" },
          (msg: { new?: { sensor_id?: string; value?: number } }) => {
            if (cancelled || !msg.new?.sensor_id) return;
            const key = sensorMap.current.get(msg.new.sensor_id);
            if (key && typeof msg.new.value === "number") { applyValue(key, msg.new.value); setSource("live"); }
          },
        )
        .subscribe();
      unsubscribe = () => { supabase.removeChannel(channel); };
    })();

    return () => { cancelled = true; unsubscribe?.(); };
    // specs are module-level constants; zoneType identifies the binding.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoneType]);

  return { metrics, source };
}
