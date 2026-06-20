"use client";

/**
 * Floorplan — interactive house floorplan.
 *
 * Live per-room overlays (power, temperature, presence) on a floorplan grid,
 * mushroom-style quick-control chips, and a presence summary. On-device demo
 * model (jitters every few seconds); in the platform it is fed by the Home
 * Assistant gateway over the backend event bus.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import { useStore } from "../../lib/store";
import { useEnergyLive } from "../../lib/twin/energyLive";
import { usePresence } from "../../lib/useSmartHome";
import { FEATURES } from "../../lib/features";

type Person = { name: string; initial: string; color: string };
const PEOPLE: Record<string, Person> = {
  alex: { name: "Alex", initial: "A", color: "#4ADE80" },
  maria: { name: "Maria", initial: "M", color: "#22D3EE" },
  sofia: { name: "Sofia", initial: "S", color: "#F59E0B" },
};

type Room = {
  id: string;
  name: string;
  icon: string;
  area: string;
  baseW: number;
  baseTemp: number;
  lights: number;
  people: string[];
};

const ROOMS: Room[] = [
  { id: "living", name: "Living", icon: "🛋️", area: "living", baseW: 320, baseTemp: 22.4, lights: 4, people: ["alex"] },
  { id: "kitchen", name: "Bucătărie", icon: "🍳", area: "kitchen", baseW: 280, baseTemp: 23.1, lights: 2, people: ["maria"] },
  { id: "bath", name: "Baie & spa", icon: "🛁", area: "bath", baseW: 140, baseTemp: 24.5, lights: 1, people: [] },
  { id: "bedroom", name: "Dormitor principal", icon: "🛏️", area: "bedroom", baseW: 90, baseTemp: 21.2, lights: 0, people: [] },
  { id: "office", name: "Birou", icon: "💻", area: "office", baseW: 180, baseTemp: 22.0, lights: 1, people: ["sofia"] },
  { id: "garage", name: "Garaj", icon: "🚗", area: "garage", baseW: 1400, baseTemp: 18.6, lights: 1, people: [] },
];

const GRID_AREAS = `"living living kitchen" "living living bath" "bedroom office garage"`;

const jit = (v: number, f: number, seed: number) => v * (1 + (Math.sin(seed) * f));

function FloorplanScreen() {
  const [tick, setTick] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const { energy, setEnergy } = useStore();
  const { s, source } = useEnergyLive();
  const { byRoom } = usePresence();
  const peopleIn = (id: string) => byRoom[id] ?? [];

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 3000);
    return () => clearInterval(id);
  }, []);

  // Distribute the live house load across rooms by their base share.
  const totalBase = ROOMS.reduce((sum, r) => sum + r.baseW, 0);
  const liveTotalW = Math.max(0, s.home * 1000);
  const live = (r: Room) => ({
    watts: Math.round(jit((r.baseW / totalBase) * liveTotalW, 0.1, tick + r.id.length)),
    temp: Math.round(jit(r.baseTemp, 0.01, tick * 1.3 + r.name.length) * 10) / 10,
  });

  const totalW = ROOMS.reduce((s, r) => s + live(r).watts, 0);
  const occupied = ROOMS.filter((r) => peopleIn(r.id).length > 0);
  const sel = ROOMS.find((r) => r.id === selected);

  const climateOn = energy.hvacMode !== "Off";
  const CHIPS: { id: string; state: boolean; on: string; off: string; icon: string; label: string; toggle: () => void }[] = [
    { id: "lights", state: energy.lightsOn, on: "Aprinse", off: "Stinse", icon: "💡", label: "Lumini", toggle: () => setEnergy({ lightsOn: !energy.lightsOn }) },
    { id: "climate", state: climateOn, on: `${energy.hvacSetpoint}°C`, off: "Oprit", icon: "❄️", label: "Climă", toggle: () => setEnergy({ hvacMode: climateOn ? "Off" : "Auto" }) },
    { id: "doors", state: energy.doorsLocked, on: "Încuiat", off: "Descuiat", icon: "🔒", label: "Uși", toggle: () => setEnergy({ doorsLocked: !energy.doorsLocked }) },
    { id: "music", state: energy.musicOn, on: "Redă", off: "Oprit", icon: "🎵", label: "Muzică", toggle: () => setEnergy({ musicOn: !energy.musicOn }) },
  ];

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />
      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl flex-1" style={{ color: "var(--text-1)" }}>Floorplan</h1>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: source === "live" ? "#4ADE80" : "#9CA3AF" }}>
          <span style={{ width: 7, height: 7, borderRadius: 999, background: source === "live" ? "#4ADE80" : "#9CA3AF" }} /> {source === "live" ? "Live" : "Simulat"}
        </span>
      </div>

      {/* Quick-control chips (mushroom-style) */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {CHIPS.map((c) => {
          const on = c.state;
          return (
            <button key={c.id} onClick={c.toggle}
              className="flex items-center gap-2 px-3 py-2 rounded-2xl flex-shrink-0 transition-all"
              style={on ? { background: "rgba(74,222,128,0.14)", border: "1px solid rgba(74,222,128,0.3)" } : { background: "rgba(255,255,255,0.05)", border: "1px solid var(--glass-border)" }}>
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm" style={{ background: on ? "rgba(74,222,128,0.2)" : "rgba(255,255,255,0.06)" }}>{c.icon}</span>
              <div className="text-left">
                <p className="text-xs font-medium leading-tight" style={{ color: "var(--text-1)" }}>{c.label}</p>
                <p className="text-[10px]" style={{ color: on ? "#4ADE80" : "var(--text-3)" }}>{on ? c.on : c.off}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="px-4 mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-2xl p-2.5 text-center liquid-glass"><p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{(totalW / 1000).toFixed(1)} kW</p><p className="text-text-secondary text-[10px]">Consum casă</p></div>
        <div className="rounded-2xl p-2.5 text-center liquid-glass"><p className="font-bold text-lg" style={{ color: "#22D3EE" }}>{occupied.length}</p><p className="text-text-secondary text-[10px]">Camere ocupate</p></div>
        <div className="rounded-2xl p-2.5 text-center liquid-glass"><p className="font-bold text-lg" style={{ color: "#4ADE80" }}>{Object.keys(PEOPLE).filter((p) => ROOMS.some((r) => peopleIn(r.id).includes(p))).length}</p><p className="text-text-secondary text-[10px]">Persoane acasă</p></div>
      </div>

      {/* Floorplan grid */}
      <div className="px-4 mb-3">
        <div className="grid gap-2" style={{ gridTemplateAreas: GRID_AREAS, gridTemplateColumns: "1fr 1fr 1fr", gridAutoRows: "minmax(78px, auto)" }}>
          {ROOMS.map((r) => {
            const l = live(r);
            const active = peopleIn(r.id).length > 0;
            const isSel = selected === r.id;
            return (
              <button key={r.id} onClick={() => setSelected(isSel ? null : r.id)}
                className="rounded-2xl p-3 text-left transition-all relative overflow-hidden"
                style={{ gridArea: r.area, background: active ? "rgba(74,222,128,0.08)" : "rgba(255,255,255,0.04)", border: isSel ? "1px solid #22D3EE" : active ? "1px solid rgba(74,222,128,0.25)" : "1px solid var(--glass-border)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-lg">{r.icon}</span>
                  <div className="flex -space-x-1">
                    {peopleIn(r.id).map((p) => (
                      <span key={p} className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: PEOPLE[p].color, color: "#05210F", border: "1.5px solid var(--bg-1)" }}>{PEOPLE[p].initial}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold leading-tight" style={{ color: "var(--text-1)" }}>{r.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px]" style={{ color: "#A78BFA" }}>{l.watts} W</span>
                  <span className="text-[10px]" style={{ color: "#F59E0B" }}>{l.temp}°</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Room detail */}
      {sel && (
        <div className="px-4 mb-3">
          <div className="rounded-3xl p-4 liquid-glass">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{sel.icon}</span>
              <h2 className="text-lg font-bold flex-1" style={{ color: "var(--text-1)" }}>{sel.name}</h2>
              <button onClick={() => setSelected(null)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-1)" }}>✕</button>
            </div>
            {[
              { l: "Consum acum", v: `${live(sel).watts} W`, c: "#A78BFA" },
              { l: "Temperatură", v: `${live(sel).temp}°C`, c: "#F59E0B" },
              { l: "Lumini aprinse", v: `${sel.lights}`, c: "var(--text-1)" },
              { l: "Prezență", v: peopleIn(sel.id).length ? peopleIn(sel.id).map((p) => PEOPLE[p]?.name ?? p).join(", ") : "Nimeni", c: peopleIn(sel.id).length ? "#4ADE80" : "var(--text-3)" },
            ].map((row) => (
              <div key={row.l} className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-sm" style={{ color: "var(--text-3)" }}>{row.l}</span>
                <span className="text-sm font-semibold" style={{ color: row.c }}>{row.v}</span>
              </div>
            ))}
            <p className="text-[11px] mt-3" style={{ color: "var(--text-3)" }}>Sincronizat cu Home Assistant prin gateway-ul backend.</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

/**
 * Route guard: the spatial Digital Twin floorplan is disabled for now
 * (see `FEATURES.floorplan`). When off, redirect away so the route behaves as
 * if removed; entry points are hidden separately.
 */
export default function FloorplanPage() {
  const router = useRouter();

  useEffect(() => {
    if (!FEATURES.floorplan) router.replace("/more");
  }, [router]);

  if (!FEATURES.floorplan) return null;
  return <FloorplanScreen />;
}
