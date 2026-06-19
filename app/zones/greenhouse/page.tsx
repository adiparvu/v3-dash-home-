"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import CameraWall from "../../components/cameras/CameraWall";
import { GREENHOUSE } from "../../lib/monitor/presets";

// Mycodo-style climate actuators — interactive control panel (local state).
type Ctl = { id: string; label: string; icon: string; modes: string[] };
const CONTROLS: Ctl[] = [
  { id: "vent", label: "Ventilație", icon: "🌀", modes: ["Auto", "On", "Off"] },
  { id: "heat", label: "Încălzire", icon: "🔥", modes: ["Auto", "On", "Off"] },
  { id: "lights", label: "Grow lights", icon: "💡", modes: ["Auto", "On", "Off"] },
  { id: "irrig", label: "Irigare", icon: "🚿", modes: ["Auto", "On", "Off"] },
  { id: "co2", label: "Dozare CO₂", icon: "🌫️", modes: ["Auto", "On", "Off"] },
  { id: "shade", label: "Umbrire", icon: "🪟", modes: ["Auto", "Open", "Closed"] },
];

const DOSING = [
  { label: "pH Down", value: "12 mL azi", color: "#22D3EE" },
  { label: "Nutrient A", value: "240 mL azi", color: "#4ADE80" },
  { label: "Nutrient B", value: "240 mL azi", color: "#4ADE80" },
];

export default function GreenhousePage() {
  const [modes, setModes] = useState<Record<string, number>>({});
  const cycle = (id: string, len: number) => setModes((m) => ({ ...m, [id]: ((m[id] ?? 0) + 1) % len }));

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0A1F0A 0%, #122212 35%, #0F280F 70%, #091808 100%)" }} />
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-25">
          <div className="relative"><div className="w-48 h-32 rounded-t-[80px]" style={{ border: "1.5px solid rgba(74,222,128,0.8)", borderBottom: "none" }} /></div>
        </div>
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
          <div className="rounded-2xl px-4 py-2 flex items-center gap-2" style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", backdropFilter: "blur(10px)" }}>
            <span className="w-2 h-2 rounded-full bg-accent-green" style={{ boxShadow: "0 0 6px #4ADE80" }} />
            <span className="text-accent-green font-semibold text-sm">Climat optim</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <h1 className="text-white text-2xl font-bold mb-1">Greenhouse</h1>
        <p className="text-text-secondary text-sm mb-5">Climă & hidroponie · control automat</p>

        {/* Live climate + nutrients */}
        <div className="mb-6">
          <MonitorGrid zoneType="greenhouse" specs={GREENHOUSE} title="Climat & nutrienți" columns={2} />
        </div>

        {/* Mycodo-style control panel */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Control mediu</p>
        <div className="grid grid-cols-3 gap-2.5 mb-6">
          {CONTROLS.map((c) => {
            const idx = modes[c.id] ?? 0;
            const mode = c.modes[idx];
            const on = mode !== "Off" && mode !== "Closed";
            const auto = mode === "Auto";
            const color = auto ? "#22D3EE" : on ? "#4ADE80" : "#9CA3AF";
            return (
              <button key={c.id} onClick={() => cycle(c.id, c.modes.length)} className="rounded-2xl p-3 liquid-glass text-center active:scale-95 transition-transform" style={{ borderColor: `${color}40` }}>
                <span className="text-xl">{c.icon}</span>
                <p className="text-[11px] font-medium mt-1 truncate" style={{ color: "var(--text-1)" }}>{c.label}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${color}22`, color }}>{mode}</span>
              </button>
            );
          })}
        </div>

        {/* Hydroponics dosing */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>Dozare hidroponie</p>
        <div className="space-y-2 mb-6">
          {DOSING.map((d) => (
            <div key={d.label} className="flex items-center justify-between rounded-2xl p-3.5 liquid-glass">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{d.label}</span>
              </div>
              <span className="text-sm" style={{ color: "var(--text-2)" }}>{d.value}</span>
            </div>
          ))}
        </div>

        {/* Cameras / AI */}
        <div>
          <CameraWall zone="greenhouse" title="Camere seră · AI" />
        </div>
      </div>
    </div>
  );
}
