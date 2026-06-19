"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import ZoneMap, { type MapFeature } from "../../components/gis/ZoneMap";
import { POND_WATER } from "../../lib/monitor/presets";

// Demo basin geometry (stands in for zones.boundary_geojson until real polygons
// are drawn). Coordinates are arbitrary planar units; ZoneMap auto-fits them.
const BASINS: MapFeature[] = [
  { id: "b1", label: "Bazin 1", sub: "crap · 1,250 m³", status: "ok", polygon: [[0, 6], [5, 7], [6, 3], [3, 0], [0, 1]] },
  { id: "b2", label: "Bazin 2", sub: "păstrăv · 820 m³", status: "ok", polygon: [[6.4, 7], [11, 6.5], [11.5, 2.5], [7, 2.8]] },
  { id: "b3", label: "Bazin 3", sub: "alevini · 240 m³", status: "warn", polygon: [[3.2, -0.4], [6.6, 2.4], [8.5, 0.2], [6, -2.4]] },
];

const POPULATION = [
  { species: "Crap", count: "≈ 3,400", biomass: "1,180 kg", color: "#4ADE80" },
  { species: "Păstrăv", count: "≈ 1,900", biomass: "540 kg", color: "#22D3EE" },
  { species: "Alevini", count: "≈ 12,000", biomass: "—", color: "#A78BFA" },
];

const FEEDING = [
  { time: "06:30", detail: "Furajare automată · 18 kg", done: true },
  { time: "12:30", detail: "Furajare automată · 18 kg", done: true },
  { time: "18:30", detail: "Furajare automată · 18 kg", done: false },
];

const EQUIPMENT = [
  { name: "Aerator B1", power: "0.8 kW", state: "Pornit", color: "#4ADE80" },
  { name: "Pompă recirculare", power: "1.2 kW", state: "Pornit", color: "#4ADE80" },
  { name: "Pompă rezervă", power: "0 kW", state: "Standby", color: "#9CA3AF" },
];

const actions = ["History", "Tasks", "Documents", "Sensors"];

export default function LakePage() {
  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #041828 0%, #072040 30%, #0A2E5A 60%, #082444 100%)" }} />
        {[80, 140, 200, 260].map((size, i) => (
          <div key={size} className="absolute rounded-full" style={{ left: "50%", top: "56%", width: size, height: size * 0.4, transform: "translate(-50%, -50%)", border: `1px solid rgba(34,211,238,${0.3 - i * 0.06})` }} />
        ))}
        <div className="absolute rounded-3xl p-4 flex items-center justify-center" style={{ left: "50%", top: "46%", transform: "translate(-50%, -50%)", background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.35)", boxShadow: "0 0 30px rgba(34,211,238,0.25)" }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" fill="#22D3EE" opacity="0.9" />
          </svg>
        </div>
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      </div>

      {/* Sheet */}
      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-28" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-2xl font-bold">Heleșteu</h1>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}>Excellent</span>
        </div>
        <p className="text-text-secondary text-sm mb-5">Ecosistem de acvacultură · 3 bazine · 2,310 m³</p>

        {/* Water quality — live monitoring framework */}
        <div className="mb-6">
          <MonitorGrid zoneType="lake" specs={POND_WATER} title="Calitatea apei" columns={2} />
        </div>

        {/* GIS — basins */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Hartă bazine</p>
        <div className="mb-6">
          <ZoneMap features={BASINS} caption="Atinge un bazin pentru detalii · contur din boundary_geojson" />
        </div>

        {/* Fish population */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Populație pești</p>
        <div className="space-y-2 mb-6">
          {POPULATION.map((p) => (
            <div key={p.species} className="flex items-center justify-between rounded-2xl p-3.5 liquid-glass">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{p.species}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{p.count}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{p.biomass}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Feeding schedule */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Furajare · azi</p>
        <div className="space-y-2 mb-6">
          {FEEDING.map((f) => (
            <div key={f.time} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: f.done ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.06)", border: `1px solid ${f.done ? "rgba(74,222,128,0.3)" : "var(--glass-border)"}` }}>{f.done ? "✅" : "🐟"}</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{f.time}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{f.detail}</p>
              </div>
              {!f.done && <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B" }}>programat</span>}
            </div>
          ))}
        </div>

        {/* Equipment / energy */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Echipamente · pompe & aeratoare</p>
        <div className="space-y-2 mb-6">
          {EQUIPMENT.map((e) => (
            <div key={e.name} className="flex items-center justify-between rounded-2xl p-3.5 liquid-glass">
              <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{e.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm" style={{ color: "var(--text-2)" }}>{e.power}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${e.color}22`, color: e.color }}>{e.state}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2">
          {actions.map((label) => (
            <button key={label} className="rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
              <span className="text-text-secondary text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
