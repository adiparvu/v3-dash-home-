"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import ZoneMap, { type MapFeature } from "../../components/gis/ZoneMap";
import CameraWall from "../../components/cameras/CameraWall";
import { ORCHARD } from "../../lib/monitor/presets";

const radius = 42;
const circumference = 2 * Math.PI * radius;
const healthScore = 88;
const offset = circumference - (healthScore / 100) * circumference;

// Parcel polygons (stand in for parcels.boundary_geojson; ZoneMap auto-fits).
const PARCELS: MapFeature[] = [
  { id: "p1", label: "Parcela A", sub: "măr · 48 pomi", status: "ok", polygon: [[0, 5], [4, 5.5], [4.3, 1], [0.2, 0.6]] },
  { id: "p2", label: "Parcela B", sub: "păr · 36 pomi", status: "ok", polygon: [[4.6, 5.6], [8.5, 5.2], [8.2, 1.2], [4.5, 1]] },
  { id: "p3", label: "Parcela C", sub: "prun · 40 pomi", status: "warn", polygon: [[0.3, 0.2], [8, 0.6], [8.1, -2.6], [0.4, -2.8]] },
];

// AI vision (YOLO-style) — fruit counting + disease/pest detection.
const VISION = [
  { label: "Fructe numărate", value: "8,420", icon: "🍎", color: "#4ADE80" },
  { label: "Risc boli foliare", value: "Scăzut", icon: "🍃", color: "#4ADE80" },
  { label: "Dăunători detectați", value: "2 zone", icon: "🐛", color: "#F59E0B" },
];

const WORKLOG = [
  { date: "Azi 08:10", detail: "Irigare automată · Parcela A", icon: "🚿" },
  { date: "Ieri", detail: "Tăiere de formare · 12 pomi", icon: "✂️" },
  { date: "acum 3 zile", detail: "Tratament foliar · cupru", icon: "🧴" },
];

const TREATMENTS = [
  { when: "în 2 zile", name: "Tratament fungicid", area: "Parcela C", color: "#F59E0B" },
  { when: "în 9 zile", name: "Fertilizare foliară", area: "Toate parcelele", color: "#22D3EE" },
  { when: "în 23 zile", name: "Recoltare măr", area: "Parcela A", color: "#4ADE80" },
];

export default function OrchardPage() {
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
            <span className="text-white font-bold text-sm">Livadă</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Health + yield */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4 flex flex-col items-center liquid-glass">
            <span className="text-text-secondary text-xs mb-2">Health Score</span>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#F59E0B" strokeWidth="7" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{healthScore}</text>
            </svg>
          </div>
          <div className="rounded-2xl p-4 flex flex-col justify-between liquid-glass">
            <span className="text-text-secondary text-xs">Recoltă estimată</span>
            <div><span className="text-white font-bold text-4xl">12.4</span><span className="text-text-secondary text-base ml-1">t</span></div>
            <div><span className="text-text-secondary text-xs">Recoltare în</span><p className="text-white font-bold text-lg">23 zile</p></div>
          </div>
        </div>

        {/* Live agronomy monitoring */}
        <div className="mb-6">
          <MonitorGrid zoneType="orchard" specs={ORCHARD} title="Sol & microclimat" columns={2} />
        </div>

        {/* GIS parcels */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Hartă parcele</p>
        <div className="mb-6">
          <ZoneMap features={PARCELS} caption="Atinge o parcelă · contur din boundary_geojson" />
        </div>

        {/* AI vision */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>AI viziune · YOLO</p>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {VISION.map((v) => (
            <div key={v.label} className="rounded-2xl p-3 liquid-glass text-center">
              <span className="text-xl">{v.icon}</span>
              <p className="text-sm font-bold mt-1" style={{ color: v.color }}>{v.value}</p>
              <p className="text-[10px] mt-0.5" style={{ color: "var(--text-3)" }}>{v.label}</p>
            </div>
          ))}
        </div>

        {/* Cameras / AI detections */}
        <div className="mb-6">
          <CameraWall zone="orchard" title="Camere livadă · AI" />
        </div>

        {/* Treatment calendar */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Calendar tratamente</p>
        <div className="space-y-2 mb-6">
          {TREATMENTS.map((t) => (
            <div key={t.name} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-1.5 h-10 rounded-full flex-shrink-0" style={{ background: t.color }} />
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t.name}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t.area}</p>
              </div>
              <span className="text-[11px] font-semibold" style={{ color: t.color }}>{t.when}</span>
            </div>
          ))}
        </div>

        {/* Work log */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Jurnal lucrări</p>
        <div className="space-y-2">
          {WORKLOG.map((w, i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>{w.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{w.detail}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{w.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
