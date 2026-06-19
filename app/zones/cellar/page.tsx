"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import CameraWall from "../../components/cameras/CameraWall";
import { CELLAR } from "../../lib/monitor/presets";

const SPACES = [
  { name: "Cramă", icon: "🍷", detail: "248 sticle · 12.5 °C", color: "#A78BFA" },
  { name: "Atelier", icon: "🛠️", detail: "Scule & unelte", color: "#22D3EE" },
  { name: "Depozit", icon: "📦", detail: "84 articole", color: "#4ADE80" },
  { name: "Cameră tehnică", icon: "⚙️", detail: "Tablouri · pompe · UPS", color: "#F59E0B" },
];

const INVENTORY = [
  { name: "Rezervă vin · Cabernet 2019", qty: "36 sticle", tag: "QR-0301" },
  { name: "Pompă submersibilă", qty: "1", tag: "QR-0302" },
  { name: "UPS rack", qty: "1", tag: "QR-0303" },
];

export default function CellarPage() {
  // Flood sensor at 0 mm → no leak; banner appears when the framework reports water.
  const flood = false;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #14101C 0%, #1B1426 45%, #120E1A 100%)" }} />
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl p-4 flex flex-col items-center gap-1" style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.30)", backdropFilter: "blur(10px)" }}>
            <span className="text-4xl">🍷</span>
            <span className="text-white font-bold text-sm">Subsol</span>
          </div>
        </div>
      </div>

      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <h1 className="text-white text-2xl font-bold mb-1">Subsol</h1>
        <p className="text-text-secondary text-sm mb-5">Cramă · atelier · depozit · tehnic</p>

        {flood && (
          <div className="rounded-2xl p-3.5 mb-5 flex items-center gap-3" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)" }}>
            <span className="text-lg">🌊</span>
            <p className="text-sm font-medium" style={{ color: "#F97316" }}>Inundație detectată — verifică camera tehnică</p>
          </div>
        )}

        <div className="mb-6">
          <MonitorGrid zoneType="cellar" specs={CELLAR} title="Mediu & inundație" columns={2} />
        </div>

        {/* Spaces */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Spații</p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {SPACES.map((s) => (
            <div key={s.name} className="rounded-2xl p-3.5 liquid-glass">
              <span className="text-xl">{s.icon}</span>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--text-1)" }}>{s.name}</p>
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{s.detail}</p>
            </div>
          ))}
        </div>

        {/* Inventory QR */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-2)" }}>Inventar QR</p>
          <Link href="/inventory" className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>Vezi tot</Link>
        </div>
        <div className="space-y-2 mb-6">
          {INVENTORY.map((it) => (
            <div key={it.tag} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>📦</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{it.name}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{it.qty} · {it.tag}</p>
              </div>
              <span className="text-base">▦</span>
            </div>
          ))}
        </div>

        <div>
          <CameraWall zone="cellar" title="Camere subsol · AI" />
        </div>
      </div>
    </div>
  );
}
