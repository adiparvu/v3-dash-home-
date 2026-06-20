"use client";

/**
 * /twin/3d — interactive 3D digital-twin demo.
 *
 * A floating-island model of the estate (react-three-fiber) with framed camera
 * views, a day/night toggle and clickable hotspots that reveal asset metrics.
 * The heavy 3D canvas is loaded client-only.
 */
import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import { useT, type MessageKey } from "../../lib/i18n";
import SceneBoundary from "../../components/twin3d/SceneBoundary";
import type { HotspotId, TwinView, Hotspot } from "../../components/twin3d/TwinScene";

const TwinScene = dynamic(() => import("../../components/twin3d/TwinScene"), {
  ssr: false,
  loading: () => null,
});

type SpotInfo = {
  id: HotspotId;
  labelKey: MessageKey;
  color: string;
  icon: string;
  href: string;
  position: [number, number, number];
  metrics: { labelKey: MessageKey; value: string }[];
};

const SPOTS: SpotInfo[] = [
  {
    id: "house",
    labelKey: "twin3d.house",
    color: "#22D3EE",
    icon: "🏠",
    href: "/twin/floorplan",
    position: [-1.6, 1.85, -1.2],
    metrics: [
      { labelKey: "twin3d.mPower", value: "1.2 kW" },
      { labelKey: "twin3d.mTemp", value: "22.4 °C" },
      { labelKey: "twin3d.mHumidity", value: "48%" },
    ],
  },
  {
    id: "greenhouse",
    labelKey: "twin3d.greenhouse",
    color: "#4ADE80",
    icon: "🌿",
    href: "/zones/greenhouse",
    position: [1.6, 1.75, 1.3],
    metrics: [
      { labelKey: "twin3d.mTemp", value: "26.1 °C" },
      { labelKey: "twin3d.mHumidity", value: "72%" },
      { labelKey: "twin3d.mHealth", value: "92%" },
    ],
  },
  {
    id: "lake",
    labelKey: "twin3d.lake",
    color: "#38BDF8",
    icon: "💧",
    href: "/zones/lake",
    position: [-1.3, 1.05, 1.8],
    metrics: [
      { labelKey: "twin3d.mLevel", value: "78%" },
      { labelKey: "twin3d.mFlow", value: "240 L/min" },
      { labelKey: "twin3d.mTemp", value: "18.3 °C" },
    ],
  },
  {
    id: "solar",
    labelKey: "twin3d.solar",
    color: "#F59E0B",
    icon: "☀️",
    href: "/twin/energy",
    position: [1.8, 1.2, -1.7],
    metrics: [
      { labelKey: "twin3d.mOutput", value: "3.8 kWp" },
      { labelKey: "twin3d.mBattery", value: "82%" },
      { labelKey: "twin3d.mPower", value: "2.4 kW" },
    ],
  },
  {
    id: "pump",
    labelKey: "twin3d.pump",
    color: "#A78BFA",
    icon: "⚙️",
    href: "/inventory/water-pump",
    position: [-0.4, 1.55, 2.0],
    metrics: [
      { labelKey: "twin3d.mFlow", value: "240 L/min" },
      { labelKey: "twin3d.mPressure", value: "2.1 bar" },
      { labelKey: "twin3d.mPower", value: "0.9 kW" },
    ],
  },
];

const VIEW_CHIPS: { id: TwinView; labelKey: MessageKey }[] = [
  { id: "overview", labelKey: "twin3d.overview" },
  { id: "house", labelKey: "twin3d.house" },
  { id: "greenhouse", labelKey: "twin3d.greenhouse" },
  { id: "lake", labelKey: "twin3d.lake" },
  { id: "solar", labelKey: "twin3d.solar" },
  { id: "pump", labelKey: "twin3d.pump" },
];

export default function Twin3DPage() {
  const t = useT();
  const [view, setView] = useState<TwinView>("overview");
  const [night, setNight] = useState(false);
  const [selected, setSelected] = useState<HotspotId | null>(null);

  const hotspots: Hotspot[] = SPOTS.map((s) => ({ id: s.id, label: t(s.labelKey), position: s.position, color: s.color }));
  const sel = SPOTS.find((s) => s.id === selected) ?? null;

  const selectSpot = (id: HotspotId) => {
    setSelected(id);
    setView(id);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href="/twin/floorplan"
            aria-label="Back"
            className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass"
            style={{ color: "var(--text-1)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-xl truncate" style={{ color: "var(--text-1)" }}>{t("twin3d.title")}</h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.30)", color: "#A78BFA" }}>{t("twin3d.demo")}</span>
            </div>
            <p className="text-text-secondary text-xs truncate">{t("twin3d.subtitle")}</p>
          </div>
        </div>

        {/* Day / night toggle */}
        <button
          onClick={() => setNight((v) => !v)}
          aria-label={night ? t("twin3d.day") : t("twin3d.night")}
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform liquid-glass"
          style={{ color: night ? "#FBBF24" : "#38BDF8" }}
        >
          {night ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </button>
      </div>

      {/* 3D stage */}
      <div className="relative mx-4 rounded-3xl overflow-hidden" style={{ height: "calc(100vh - 320px)", minHeight: 360, border: "0.5px solid var(--glass-border)" }}>
        <SceneBoundary
          fallback={
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-8 text-center">
              <span className="text-4xl">🧊</span>
              <p className="text-sm" style={{ color: "var(--text-3)" }}>{t("twin3d.unsupported")}</p>
            </div>
          }
        >
          <TwinScene view={view} night={night} hotspots={hotspots} selected={selected} onSelect={selectSpot} />
        </SceneBoundary>

        {/* gradient loading shimmer behind the canvas */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
          <p className="text-sm animate-pulse" style={{ color: "var(--text-3)" }}>{t("twin3d.loading")}</p>
        </div>

        {/* hint */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-[11px] font-medium pointer-events-none" style={{ background: "rgba(8,17,30,0.55)", color: "#E5E7EB", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          {t("twin3d.hint")}
        </div>

        {/* selected hotspot card */}
        {sel && (
          <div className="absolute bottom-3 left-3 right-3 rounded-2xl p-4 animate-slide-up" style={{ background: "rgba(8,17,30,0.78)", backdropFilter: "blur(20px)", border: `1px solid ${sel.color}55` }}>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${sel.color}1F`, border: `1px solid ${sel.color}40` }}>{sel.icon}</div>
              <p className="font-bold text-base flex-1" style={{ color: "#F4F6F8" }}>{t(sel.labelKey)}</p>
              <button onClick={() => setSelected(null)} aria-label="Close" className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ color: "#9CA3AF" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {sel.metrics.map((m) => (
                <div key={m.labelKey} className="rounded-xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.10)" }}>
                  <p className="font-bold text-sm" style={{ color: sel.color }}>{m.value}</p>
                  <p className="text-[9px] mt-0.5" style={{ color: "#9CA3AF" }}>{t(m.labelKey)}</p>
                </div>
              ))}
            </div>
            <Link href={sel.href} className="block w-full py-2.5 rounded-xl text-sm font-semibold text-center active:scale-[0.98] transition-transform" style={{ background: sel.color, color: "#06101c" }}>
              {t("twin3d.open")}
            </Link>
          </div>
        )}
      </div>

      {/* View preset chips */}
      <div className="px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {VIEW_CHIPS.map((c) => {
          const active = view === c.id && (c.id === "overview" ? selected === null : true);
          return (
            <button
              key={c.id}
              onClick={() => { setView(c.id); setSelected(c.id === "overview" ? null : (c.id as HotspotId)); }}
              className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
              style={active
                ? { background: "var(--accent)", color: "#050A14" }
                : { background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}
            >
              {t(c.labelKey)}
            </button>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
