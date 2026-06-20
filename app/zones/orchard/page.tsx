"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import ZoneMap, { type MapFeature } from "../../components/gis/ZoneMap";
import CameraWall from "../../components/cameras/CameraWall";
import { ORCHARD } from "../../lib/monitor/presets";
import { useT, type MessageKey } from "../../lib/i18n";

const radius = 42;
const circumference = 2 * Math.PI * radius;
const healthScore = 88;
const offset = circumference - (healthScore / 100) * circumference;

// AI vision (YOLO-style) — fruit counting + disease/pest detection.
const VISION: { labelKey: MessageKey; value: string; valueKey?: MessageKey; icon: string; color: string }[] = [
  { labelKey: "zp.orch.vFruit", value: "8,420", icon: "🍎", color: "#4ADE80" },
  { labelKey: "zp.orch.vDisease", value: "", valueKey: "zp.orch.vDiseaseVal", icon: "🍃", color: "#4ADE80" },
  { labelKey: "zp.orch.vPests", value: "", valueKey: "zp.orch.vPestsVal", icon: "🐛", color: "#F59E0B" },
];

const WORKLOG: { dateKey: MessageKey; detailKey: MessageKey; icon: string }[] = [
  { dateKey: "zp.orch.wl1", detailKey: "zp.orch.wl1d", icon: "🚿" },
  { dateKey: "zp.orch.wl2", detailKey: "zp.orch.wl2d", icon: "✂️" },
  { dateKey: "zp.orch.wl3", detailKey: "zp.orch.wl3d", icon: "🧴" },
];

const TREATMENTS: { whenKey: MessageKey; nameKey: MessageKey; areaKey: MessageKey; color: string }[] = [
  { whenKey: "zp.orch.tr1when", nameKey: "zp.orch.tr1", areaKey: "zp.orch.tr1area", color: "#F59E0B" },
  { whenKey: "zp.orch.tr2when", nameKey: "zp.orch.tr2", areaKey: "zp.orch.tr2area", color: "#22D3EE" },
  { whenKey: "zp.orch.tr3when", nameKey: "zp.orch.tr3", areaKey: "zp.orch.tr3area", color: "#4ADE80" },
];

export default function OrchardPage() {
  const t = useT();
  // Parcel polygons (stand in for parcels.boundary_geojson; ZoneMap auto-fits).
  const PARCELS: MapFeature[] = [
    { id: "p1", label: t("zp.orch.p1"), sub: t("zp.orch.p1s"), status: "ok", polygon: [[0, 5], [4, 5.5], [4.3, 1], [0.2, 0.6]] },
    { id: "p2", label: t("zp.orch.p2"), sub: t("zp.orch.p2s"), status: "ok", polygon: [[4.6, 5.6], [8.5, 5.2], [8.2, 1.2], [4.5, 1]] },
    { id: "p3", label: t("zp.orch.p3"), sub: t("zp.orch.p3s"), status: "warn", polygon: [[0.3, 0.2], [8, 0.6], [8.1, -2.6], [0.4, -2.8]] },
  ];
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #1A0E05 0%, #2A1A08 35%, #1E1405 70%, #150E04 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 opacity-20 pb-2">
          {[50, 60, 55, 65, 58, 62, 50].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="rounded-full" style={{ background: "#5A3010", width: h * 0.6, height: h * 0.5 }} />
              <div className="w-2 rounded-full" style={{ height: h * 0.3, background: "#6B3D10" }} />
            </div>
          ))}
        </div>
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl p-4 flex flex-col items-center gap-1" style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)", backdropFilter: "blur(10px)" }}>
            <span className="text-4xl">🍎</span>
            <span className="text-white font-bold text-sm">{t("zp.orch.name")}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Health + yield */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4 flex flex-col items-center liquid-glass">
            <span className="text-text-secondary text-xs mb-2">{t("zp.orch.healthScore")}</span>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#F59E0B" strokeWidth="7" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{healthScore}</text>
            </svg>
          </div>
          <div className="rounded-2xl p-4 flex flex-col justify-between liquid-glass">
            <span className="text-text-secondary text-xs">{t("zp.orch.estYield")}</span>
            <div><span className="text-white font-bold text-4xl">12.4</span><span className="text-text-secondary text-base ml-1">t</span></div>
            <div><span className="text-text-secondary text-xs">{t("zp.orch.harvestIn")}</span><p className="text-white font-bold text-lg">{t("zp.orch.days23")}</p></div>
          </div>
        </div>

        {/* Live agronomy monitoring */}
        <div className="mb-6">
          <MonitorGrid zoneType="orchard" specs={ORCHARD} title={t("zp.orch.monTitle")} columns={2} />
        </div>

        {/* GIS parcels */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.orch.parcelMap")}</p>
        <div className="mb-6">
          <ZoneMap features={PARCELS} caption={t("zp.orch.mapCaption")} />
        </div>

        {/* AI vision */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.orch.aiVision")}</p>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {VISION.map((v) => (
            <div key={v.labelKey} className="rounded-2xl p-3 liquid-glass text-center">
              <span className="text-xl">{v.icon}</span>
              <p className="text-sm font-bold mt-1" style={{ color: v.color }}>{v.valueKey ? t(v.valueKey) : v.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>{t(v.labelKey)}</p>
            </div>
          ))}
        </div>

        {/* Cameras / AI detections */}
        <div className="mb-6">
          <CameraWall zone="orchard" title={t("zp.orch.camTitle")} />
        </div>

        {/* Treatment calendar */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.orch.treatCal")}</p>
        <div className="space-y-2 mb-6">
          {TREATMENTS.map((tr) => (
            <div key={tr.nameKey} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: tr.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(tr.nameKey)}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t(tr.areaKey)}</p>
              </div>
              <span className="text-[11px] font-semibold" style={{ color: tr.color }}>{t(tr.whenKey)}</span>
            </div>
          ))}
        </div>

        {/* Work log */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.orch.workLog")}</p>
        <div className="space-y-2">
          {WORKLOG.map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>{w.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(w.detailKey)}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t(w.dateKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
