"use client";

/**
 * Drop-in monitoring section for any module: binds a MetricSpec[] to a zone's
 * live sensors and renders a titled grid of MonitorCards with a Live / Simulat
 * source badge. A module instantiates a whole dashboard panel with one tag.
 */
import { useZoneSensors } from "../../lib/monitor/useZoneSensors";
import type { MetricSpec } from "../../lib/monitor/types";
import MonitorCard from "./MonitorCard";
import { useT } from "../../lib/i18n";

export default function MonitorGrid({
  zoneType,
  specs,
  title,
  columns = 2,
}: {
  zoneType: string;
  specs: MetricSpec[];
  title?: string;
  columns?: 2 | 3;
}) {
  const t = useT();
  const { metrics, source } = useZoneSensors(zoneType, specs);
  const live = source === "live";
  return (
    <div>
      {title && (
        <div className="flex items-center gap-2 mb-2.5 px-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-2)" }}>{title}</p>
          <span className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: live ? "#4ADE80" : "#9CA3AF" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-glow" style={{ background: live ? "#4ADE80" : "#9CA3AF" }} />
            {live ? t("mon.live") : t("mon.simulated")}
          </span>
        </div>
      )}
      <div className={`grid gap-2.5 ${columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {metrics.map((m) => (
          <MonitorCard key={m.key} m={m} />
        ))}
      </div>
    </div>
  );
}
