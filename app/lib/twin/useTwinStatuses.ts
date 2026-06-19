"use client";

/**
 * Derives a live status per Digital-Twin node from real sensor data.
 *
 * For each configured module it fetches /api/v1/twin/sensors?zone=<type>, matches
 * the readings to the module's MetricSpecs and reduces them to the worst status
 * (ok < warn < alert) — so a node lights amber/red when any of its metrics leaves
 * its healthy band. Falls back to the provided demo statuses when Supabase is
 * unconfigured / signed out / a zone has no sensors. `source` badges Live vs demo.
 */
import { useEffect, useState } from "react";
import { type MetricSpec, type MetricStatus, statusOf } from "../monitor/types";

const CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export type StatusConfig = { id: string; zoneType: string; specs: MetricSpec[] };

const worse = (a: MetricStatus, b: MetricStatus): MetricStatus => {
  const rank = { ok: 0, warn: 1, alert: 2 } as const;
  return rank[a] >= rank[b] ? a : b;
};

export function useTwinStatuses(
  configs: StatusConfig[],
  fallback: Record<string, MetricStatus>,
): { statuses: Record<string, MetricStatus>; source: "demo" | "live" } {
  const [statuses, setStatuses] = useState<Record<string, MetricStatus>>(fallback);
  const [source, setSource] = useState<"demo" | "live">("demo");

  useEffect(() => {
    if (!CONFIGURED) return;
    let cancelled = false;
    (async () => {
      const next: Record<string, MetricStatus> = { ...fallback };
      let any = false;
      await Promise.all(
        configs.map(async (cfg) => {
          try {
            const res = await fetch(`/api/v1/twin/sensors?zone=${encodeURIComponent(cfg.zoneType)}`);
            if (!res.ok) return;
            const j = await res.json();
            const sensors: Array<{ type: string; value: number | null }> = j?.data?.sensors ?? [];
            let worst: MetricStatus = "ok";
            let matched = false;
            for (const s of sensors) {
              const spec = cfg.specs.find((x) => x.key === s.type);
              if (!spec || s.value === null) continue;
              matched = true;
              worst = worse(worst, statusOf(s.value, spec));
            }
            if (matched) { next[cfg.id] = worst; any = true; }
          } catch {
            /* keep fallback for this node */
          }
        }),
      );
      if (!cancelled && any) { setStatuses(next); setSource("live"); }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { statuses, source };
}
