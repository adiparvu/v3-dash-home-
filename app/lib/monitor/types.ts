/**
 * Zone-Monitoring framework — metric model.
 *
 * A module (heleșteu, greenhouse, pool…) declares a list of MetricSpec; the
 * useZoneSensors hook binds each spec to a live `sensors` row by type and streams
 * its `telemetry`, falling back to the spec's demo value. Thresholds turn a raw
 * value into an ok / warn / alert status that drives the card colour.
 */
export type MetricStatus = "ok" | "warn" | "alert";

export type MetricSpec = {
  /** Matches a sensor by its `sensor_type` (e.g. "ph", "temperature"). */
  key: string;
  label: string;
  unit?: string;
  icon?: string;
  decimals?: number;
  /** Inclusive healthy band. Inside → ok. */
  okMin?: number;
  okMax?: number;
  /** Inclusive caution band (outside ok but inside warn → warn; else alert). */
  warnMin?: number;
  warnMax?: number;
  /** Fallback value + sparkline when no live reading is available. */
  demo: number;
  demoSeries?: number[];
};

export type MetricReading = MetricSpec & {
  value: number;
  status: MetricStatus;
  series: number[];
};

const inBand = (v: number, lo?: number, hi?: number): boolean =>
  (lo === undefined || v >= lo) && (hi === undefined || v <= hi);

/** Classify a value against a spec's thresholds. No thresholds → always ok. */
export function statusOf(v: number, s: MetricSpec): MetricStatus {
  if (s.okMin === undefined && s.okMax === undefined) return "ok";
  if (inBand(v, s.okMin, s.okMax)) return "ok";
  if ((s.warnMin !== undefined || s.warnMax !== undefined) && inBand(v, s.warnMin, s.warnMax)) return "warn";
  return "alert";
}

export const STATUS_COLOR: Record<MetricStatus, string> = {
  ok: "#4ADE80",
  warn: "#F59E0B",
  alert: "#F97316",
};

/** Deterministic gentle wander around a base value, for demo sparklines. */
export function demoSeries(base: number, n = 24, spread = 0.06): number[] {
  return Array.from({ length: n }, (_, i) =>
    Math.round((base * (1 + Math.sin(i / 2.3) * spread + Math.cos(i / 5) * spread * 0.5)) * 100) / 100,
  );
}
