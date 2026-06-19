"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useStore } from "../lib/store";
import { useEnergyLive } from "../lib/twin/energyLive";
import { useCameras } from "../lib/useCameras";
import { useWeather } from "../lib/useWeather";
import { deriveAlerts } from "../lib/twin/alerts";
import {
  buildWidget,
  buildLockWidgets,
  buildLiveActivities,
  widgetsForSize,
  type EstateSnapshot,
  type WidgetData,
  type WidgetSize,
} from "../lib/widgets";

/**
 * Widget Gallery — an on-device preview of the native iOS widget set
 * (Widgets & iOS Experience). Renders Home Screen widgets at all three sizes,
 * Lock Screen complications and Live Activities from the live estate snapshot,
 * mirroring how WidgetKit timelines will look in the SwiftUI client (Phase 8).
 */

function useSnapshot(): EstateSnapshot {
  const { estateName, addedZones, addedAssets, energy, security } = useStore();
  const { s, carPct } = useEnergyLive();
  const { cameras } = useCameras();
  const weather = useWeather();

  // Live alert count from the same engine that feeds the notifications center.
  const alerts = deriveAlerts(s, carPct, {
    backupReserve: energy.backupReserve,
    offGrid: energy.offGrid,
    stormWatch: energy.stormWatch,
  }).filter((a) => a.severity === "alert" || a.severity === "warn").length;

  const camerasOnline = cameras.filter((c) => c.online).length;
  const openDoors = energy.doorsLocked ? 0 : 1;

  return {
    estateName: estateName || "Prvio Estate",
    healthScore: 87,
    zones: 26 + addedZones.length,
    objects: 142 + addedAssets.length,
    openTasks: 7,
    alerts,
    maintenanceDue: 1,
    nextMaintenanceDays: 3,
    propertyValue: 2_400_000,
    appreciationPct: 4.2,
    weather: { tempC: weather.tempC, condition: weather.condition, icon: weather.icon, high: weather.high, low: weather.low },
    security: { armed: security.passcodeLock || security.faceId, cameras: cameras.length, camerasOnline, openDoors },
    month: new Date().getMonth(),
  };
}

function SmallWidget({ w }: { w: WidgetData }) {
  return (
    <Link href={w.href}>
      <div
        className="rounded-3xl p-3.5 aspect-square flex flex-col justify-between liquid-glass active:scale-95 transition-transform"
        style={{ width: 150 }}
      >
        <div className="flex items-center justify-between">
          <span className="text-lg">{w.icon}</span>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: w.accent, boxShadow: `0 0 6px ${w.accent}` }} />
        </div>
        <div>
          <p className="font-bold leading-none" style={{ color: "var(--text-1)", fontSize: 30 }}>{w.primary}</p>
          <p className="text-[11px] font-medium mt-1.5 leading-tight" style={{ color: "var(--text-1)" }}>{w.title}</p>
          {w.secondary && <p className="text-[10px] mt-0.5 leading-snug" style={{ color: "var(--text-2)" }}>{w.secondary}</p>}
        </div>
      </div>
    </Link>
  );
}

function MediumWidget({ w }: { w: WidgetData }) {
  return (
    <Link href={w.href}>
      <div className="rounded-3xl p-4 liquid-glass active:scale-[0.98] transition-transform" style={{ width: 316 }}>
        <div className="flex items-start gap-4">
          <div className="flex flex-col justify-between" style={{ minWidth: 96 }}>
            <div className="flex items-center gap-1.5">
              <span className="text-base">{w.icon}</span>
              <span className="text-[11px] font-medium" style={{ color: "var(--text-2)" }}>{w.title}</span>
            </div>
            <p className="font-bold leading-none mt-2" style={{ color: "var(--text-1)", fontSize: 34 }}>{w.primary}</p>
            {w.secondary && <p className="text-[10px] mt-1.5 leading-snug" style={{ color: "var(--text-2)" }}>{w.secondary}</p>}
          </div>
          <div className="flex-1 space-y-1.5 pt-1">
            {(w.items ?? []).map((it, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span style={{ color: "var(--text-2)" }} className="truncate pr-2">{it.label}</span>
                <span className="font-medium flex-shrink-0" style={{ color: it.color ?? "var(--text-1)" }}>{it.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function LargeWidget({ w }: { w: WidgetData }) {
  return (
    <Link href={w.href}>
      <div className="rounded-3xl p-4 liquid-glass active:scale-[0.98] transition-transform" style={{ width: 316 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{w.icon}</span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{w.title}</span>
          </div>
          <span className="text-2xl font-bold" style={{ color: w.accent }}>{w.primary}</span>
        </div>
        {w.secondary && <p className="text-[11px] mb-3" style={{ color: "var(--text-2)" }}>{w.secondary}</p>}
        <div className="space-y-2">
          {(w.items ?? []).map((it, i) => (
            <div key={i} className="flex items-center gap-2.5 text-[12px]">
              {typeof it.done === "boolean" ? (
                <span
                  className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{ background: it.done ? `${w.accent}26` : "rgba(255,255,255,0.06)", border: `1px solid ${it.done ? w.accent : "var(--glass-border)"}` }}
                >
                  {it.done && <span style={{ color: w.accent, fontSize: 10 }}>✓</span>}
                </span>
              ) : (
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: it.color ?? w.accent }} />
              )}
              <span className="flex-1" style={{ color: "var(--text-1)", textDecoration: it.done ? "line-through" : undefined, opacity: it.done ? 0.55 : 1 }}>{it.label}</span>
              {it.value && <span className="font-medium" style={{ color: it.color ?? "var(--text-2)" }}>{it.value}</span>}
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

const SIZES: { key: WidgetSize; label: string }[] = [
  { key: "small", label: "Small" },
  { key: "medium", label: "Medium" },
  { key: "large", label: "Large" },
];

export default function WidgetsPage() {
  const snap = useSnapshot();
  const [size, setSize] = useState<WidgetSize>("small");
  const lock = buildLockWidgets(snap);
  const activities = buildLiveActivities(snap);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)", color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3">
        <Link href="/more" className="text-xs font-medium" style={{ color: "var(--accent)" }}>‹ More</Link>
        <h1 className="font-bold text-2xl mt-1" style={{ color: "var(--text-1)" }}>Widgets</h1>
        <p className="text-xs mt-1" style={{ color: "var(--text-2)" }}>
          Home Screen, Lock Screen & Live Activity previews · iOS WidgetKit (Phase 8)
        </p>
      </div>

      {/* Home Screen widgets ------------------------------------------------ */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="font-semibold text-sm">Home Screen</span>
        {/* Size segmented control */}
        <div className="flex gap-1 p-0.5 rounded-full" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
          {SIZES.map((s) => (
            <button
              key={s.key}
              onClick={() => setSize(s.key)}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full transition-colors"
              style={{ background: size === s.key ? "var(--accent)" : "transparent", color: size === s.key ? "var(--bg-1)" : "var(--text-2)" }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 mb-6">
        {size === "small" ? (
          <div className="grid grid-cols-2 gap-3">
            {widgetsForSize("small").map((k) => <SmallWidget key={k} w={buildWidget(k, snap)} />)}
          </div>
        ) : (
          <div className="space-y-3">
            {widgetsForSize(size).map((k) =>
              size === "medium"
                ? <MediumWidget key={k} w={buildWidget(k, snap)} />
                : <LargeWidget key={k} w={buildWidget(k, snap)} />,
            )}
          </div>
        )}
      </div>

      {/* Lock Screen complications ----------------------------------------- */}
      <div className="px-5 mb-2 font-semibold text-sm">Lock Screen</div>
      <div className="px-5 mb-6">
        <div
          className="rounded-3xl p-5"
          style={{ background: "linear-gradient(160deg, #0D1F35 0%, #071830 100%)", border: "0.5px solid var(--glass-border)" }}
        >
          <p className="text-white/90 text-center font-semibold" style={{ fontSize: 42, letterSpacing: "-1px" }}>9:41</p>
          <p className="text-white/55 text-center text-xs mb-4">Thursday, June 19</p>
          <div className="flex justify-center gap-2.5 flex-wrap">
            {lock.map((w) => (
              <Link key={w.id} href={w.href}>
                <div
                  className="rounded-2xl px-3 py-2 flex flex-col items-center gap-0.5 min-w-[60px] active:scale-95 transition-transform"
                  style={{ background: "rgba(255,255,255,0.10)", backdropFilter: "blur(8px)" }}
                >
                  <span className="text-sm">{w.icon}</span>
                  <span className="font-bold text-white leading-none" style={{ fontSize: 16 }}>{w.value}</span>
                  <span className="text-white/55 text-[9px] leading-none">{w.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activities --------------------------------------------------- */}
      <div className="px-5 mb-2 font-semibold text-sm">Live Activities</div>
      <div className="px-5 space-y-2.5">
        {activities.map((a) => (
          <Link key={a.id} href={a.href}>
            <div className="rounded-2xl p-3.5 liquid-glass active:scale-[0.98] transition-transform">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${a.color}1A`, border: `1px solid ${a.color}33` }}
                >
                  <span>{a.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight truncate" style={{ color: "var(--text-1)" }}>{a.title}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--text-2)" }}>{a.subtitle}</p>
                </div>
                <span
                  className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 uppercase tracking-wide"
                  style={{ background: `${a.color}1A`, color: a.color }}
                >
                  {a.state}
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${Math.round(a.progress * 100)}%`, background: a.color }} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
