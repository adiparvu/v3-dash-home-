"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import { useStore } from "../../lib/store";
import { seriesPath } from "../../lib/twin/telemetry";
import {
  SCENARIOS, simulate, EnergyState, kw,
  MONTHLY_USAGE, MONTH_LABELS, ENERGY_SOURCES, AUTONOMY, TOU_PERIODS,
  SOLAR_VALUE, SOLAR_VALUE_TOTAL, OFFSET, BACKUP_EVENTS, BACKUP_SUMMARY,
  TARIFF_SERIES, TARIFF,
} from "../../lib/twin/energy";

const TABS = ["Live", "Energie", "Impact", "Powerwall"] as const;
type Tab = (typeof TABS)[number];

// Starts at the render's values, then drifts live.
const START: EnergyState = { solar: 6.5, home: 0.8, vehicle: 2.2, battery: 4.9, grid: 0, batteryPct: 89 };

// Hybrid clone: the reference render (text + lines + font baked in) is the base;
// only the numeric values are masked out (with a clean-plate "window") and
// redrawn live. VALUES below define each value's mask rect and text center (% of
// the 853×1844 image), measured from the reference.
const GREEN = "#4ADE80";

export default function EnergyPage() {
  const [tab, setTab] = useState<Tab>("Live");

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/twin" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl flex-1" style={{ color: "var(--text-1)" }}>Energy</h1>
      </div>

      {/* Sub-tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={tab === t ? { background: "var(--accent)", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "var(--text-3)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Live" && <LiveTab onGoTab={setTab} />}
      {tab === "Energie" && <EnergieTab />}
      {tab === "Impact" && <ImpactTab />}
      {tab === "Powerwall" && <PowerwallTab />}

      <BottomNav />
    </div>
  );
}

// ── Live tab ─────────────────────────────────────────────────────────────────
function LiveTab({ onGoTab }: { onGoTab: (t: Tab) => void }) {
  const [s, setS] = useState<EnergyState>(START);
  const [carPct, setCarPct] = useState(69);

  useEffect(() => {
    const id = setInterval(() => {
      setS((prev) => simulate(prev, SCENARIOS[0], "self_powered", 20));
      setCarPct((p) => Math.min(100, Math.round((p + 0.4) * 10) / 10));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // System font (SF Pro on iOS) to match the render's baked text.
  const ff = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';

  // Each value: mask rect [l,t,w,h] (% of image) and text center [x,y] (%).
  const VALUES: { id: string; rect: [number, number, number, number]; c: [number, number]; align: "center" | "left"; fs: number; node: React.ReactNode }[] = [
    { id: "solar", rect: [45.5, 22.6, 13.5, 2.2], c: [52.46, 23.76], align: "center", fs: 3.6, node: <>{kw(s.solar)}</> },
    { id: "home", rect: [77.2, 28.3, 13, 2.1], c: [83.65, 29.26], align: "center", fs: 3.6, node: <>{kw(s.home)}</> },
    { id: "battery", rect: [40.5, 71.7, 23.5, 3.2], c: [52.34, 73.3], align: "center", fs: 3.6, node: <>{kw(s.battery)} <span style={{ color: GREEN }}>▲</span> {Math.round(s.batteryPct)}%</> },
    { id: "grid", rect: [78.5, 72.9, 10, 2.1], c: [83.47, 73.83], align: "center", fs: 3.6, node: <>{Math.round(Math.abs(s.grid))} kW</> },
    { id: "vch", rect: [0.5, 47.8, 14, 2.3], c: [1.8, 48.9], align: "left", fs: 3.4, node: <span style={{ color: GREEN }}>{kw(s.vehicle)}</span> },
    { id: "vb", rect: [0.5, 54, 10, 2.3], c: [1.8, 55.1], align: "left", fs: 3.4, node: <>{Math.round(carPct)}%</> },
  ];

  return (
    <div>
      {/* Hybrid: reference render as base; only the values are masked + redrawn live */}
      <div className="px-4 mb-3">
        <div className="relative w-full rounded-3xl overflow-hidden" style={{ aspectRatio: "853 / 1844", border: "1px solid rgba(255,255,255,0.08)", background: "#0a0e16", containerType: "size" }}>
          {/* base: reference render (text, lines, font all baked in) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/estate-live.png" alt="PRVIO Estate — energy" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} draggable={false} />

          {/* mask each baked value with a clean-plate window */}
          {VALUES.map((v) => (
            <div key={v.id + "m"} style={{ position: "absolute", left: `${v.rect[0]}%`, top: `${v.rect[1]}%`, width: `${v.rect[2]}%`, height: `${v.rect[3]}%`, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/estate-clean.png" alt="" draggable={false} style={{ position: "absolute", width: "100cqw", height: "100cqh", left: `${-v.rect[0]}cqw`, top: `${-v.rect[1]}cqh`, maxWidth: "none" }} />
            </div>
          ))}

          {/* live values redrawn on top */}
          {VALUES.map((v) => (
            <div key={v.id + "t"} style={{ position: "absolute", left: `${v.c[0]}%`, top: `${v.c[1]}%`, transform: `translate(${v.align === "left" ? "0" : "-50%"}, -50%)`, fontFamily: ff, fontWeight: 600, fontSize: `${v.fs}cqw`, color: "#fff", whiteSpace: "nowrap", lineHeight: 1, zIndex: 2 }}>
              {v.node}
            </div>
          ))}
        </div>
      </div>

      {/* shortcuts */}
      <div className="px-4 space-y-2">
        {[
          { label: "Energie", desc: "Generare & consum", icon: "📈", go: () => onGoTab("Energie") },
          { label: "Impact", desc: "Autonomie & economii", icon: "🌿", go: () => onGoTab("Impact") },
          { label: "Powerwall & rețea", desc: "Rezervă, mod, tarife, off-grid", icon: "🔋", go: () => onGoTab("Powerwall") },
        ].map((s, i, arr) => (
          <button key={s.label} onClick={s.go} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left liquid-glass" style={{ marginBottom: i === arr.length - 1 ? 0 : undefined }}>
            <span className="text-xl w-7 text-center flex-shrink-0">{s.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{s.label}</p>
              <p className="text-text-secondary text-xs">{s.desc}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Energie tab ──────────────────────────────────────────────────────────────
function EnergieTab() {
  const total = MONTHLY_USAGE.reduce((s, v) => s + v, 0);
  const max = Math.max(...MONTHLY_USAGE);
  return (
    <div className="px-4 space-y-4">
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-text-secondary text-[11px] mb-0.5">Total utilizat · anul acesta</p>
        <p className="font-bold text-3xl" style={{ color: "var(--text-1)" }}>{total.toFixed(1)} <span className="text-lg" style={{ color: "var(--text-3)" }}>MWh</span></p>
        <div className="flex items-end justify-between gap-1 mt-4 h-32">
          {MONTHLY_USAGE.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md" style={{ height: `${(v / max) * 100}%`, background: "linear-gradient(180deg, #4ADE80, #22D3EE)" }} />
              <span className="text-text-tertiary text-[9px]">{MONTH_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Flux de energie · Utilizat din</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {ENERGY_SOURCES.map((s, i) => (
            <div key={s.id} className="px-4 py-3" style={{ borderBottom: i < ENERGY_SOURCES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-1)" }}><span>{s.icon}</span>{s.label}</span>
                <span className="text-sm" style={{ color: "var(--text-2)" }}>{s.pct}% · {s.mwh} MWh</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Impact tab ───────────────────────────────────────────────────────────────
function ImpactTab() {
  const [touIdx, setTouIdx] = useState(0);
  const tou = TOU_PERIODS[touIdx];
  const r = 42, c = 2 * Math.PI * r;
  const segs = [
    { v: AUTONOMY.solar, color: "#F59E0B" },
    { v: AUTONOMY.battery, color: "#4ADE80" },
    { v: AUTONOMY.grid, color: "#6B7280" },
  ];
  let acc = 0;
  const maxVal = Math.max(...SOLAR_VALUE);

  return (
    <div className="px-4 space-y-4">
      {/* Autonomy donut */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>Autonomie energetică</p>
        <div className="flex items-center gap-5">
          <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0">
            <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            {segs.map((s, i) => {
              const len = (s.v / 100) * c;
              const el = (
                <circle key={i} cx="55" cy="55" r={r} fill="none" stroke={s.color} strokeWidth="9"
                  strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} transform="rotate(-90 55 55)" strokeLinecap="butt" />
              );
              acc += len;
              return el;
            })}
            <text x="55" y="52" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">{AUTONOMY.total}</text>
            <text x="55" y="68" textAnchor="middle" fontSize="10" fill="#9CA3AF">% autonom</text>
          </svg>
          <div className="space-y-2">
            {[{ l: "Solar", v: AUTONOMY.solar, c: "#F59E0B" }, { l: "Powerwall", v: AUTONOMY.battery, c: "#4ADE80" }, { l: "Grilă", v: AUTONOMY.grid, c: "#6B7280" }].map((x) => (
              <div key={x.l} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{x.v}%</span>
                <span className="text-text-secondary text-xs">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time of use */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>Durata utilizării</p>
        <div className="flex gap-2 mb-3">
          {TOU_PERIODS.map((p, i) => (
            <button key={p.id} onClick={() => setTouIdx(i)} className="flex-1 rounded-xl py-2 text-center transition-all" style={touIdx === i ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-2)" }}>{p.label}</p>
              <p className="text-sm font-bold" style={{ color: touIdx === i ? "var(--accent)" : "var(--text-1)" }}>{p.mwh} MWh</p>
            </button>
          ))}
        </div>
        {[{ l: "Solar", v: tou.solar, c: "#F59E0B" }, { l: "Powerwall", v: tou.battery, c: "#4ADE80" }, { l: "Grilă", v: tou.grid, c: "#6B7280" }].map((x) => (
          <div key={x.l} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-1"><span className="text-sm" style={{ color: "var(--text-1)" }}>{x.l}</span><span className="text-sm" style={{ color: "var(--text-2)" }}>{x.v}%</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-full rounded-full" style={{ width: `${x.v}%`, background: x.c }} /></div>
          </div>
        ))}
      </div>

      {/* Solar value */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>Valoare solară</p>
        <div className="flex items-end justify-between gap-1 h-28">
          {SOLAR_VALUE.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-1.5 rounded-full" style={{ height: `${(v / maxVal) * 100}%`, background: "#4ADE80" }} />
              <span className="text-text-tertiary text-[8px]">{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-bold text-2xl mt-2" style={{ color: "#4ADE80" }}>{SOLAR_VALUE_TOTAL.toLocaleString()} $</p>
        <p className="text-center text-text-tertiary text-[11px]">Anul acesta · estimare {TARIFF.provider}</p>
      </div>

      {/* Solar offset */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>Compensare cu energie solară</p>
        <div className="flex items-end justify-center gap-10 h-32">
          {[{ l: "Solar", v: OFFSET.solarMwh, c: "#F59E0B" }, { l: "Acasă", v: OFFSET.homeMwh, c: "#3B82F6" }].map((x) => (
            <div key={x.l} className="flex flex-col items-center justify-end h-full">
              <div className="w-14 rounded-t-lg" style={{ height: `${(x.v / OFFSET.solarMwh) * 100}%`, background: x.c }} />
              <p className="text-sm font-semibold mt-1.5" style={{ color: "var(--text-1)" }}>{x.v} MWh</p>
              <p className="text-xs" style={{ color: x.c }}>{x.l}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-2" style={{ color: "var(--text-2)" }}><b style={{ color: "var(--accent)" }}>{OFFSET.pct}%</b> compensare energie</p>
      </div>

      {/* Backup history */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">Istoric rezervă</p>
          <span className="text-text-tertiary text-[10px]">{BACKUP_SUMMARY.events} ev · {BACKUP_SUMMARY.total} · max {BACKUP_SUMMARY.longest}</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {BACKUP_EVENTS.map((e, i) => (
            <div key={e.date} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < BACKUP_EVENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div><p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{e.date}</p><p className="text-text-tertiary text-[11px]">{e.window}</p></div>
              <span className="text-text-secondary text-xs">{e.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Powerwall tab ────────────────────────────────────────────────────────────
function PowerwallTab() {
  const { energy, setEnergy } = useStore();
  const reserve = energy.backupReserve;
  const reserveLabel = reserve <= 20 ? "scăzută" : reserve >= 100 ? "maximă" : "echilibrată";
  // Rough off-grid runtime estimate from reserve %.
  const hours = Math.max(1, Math.round((reserve / 100) * 13.5 + 2));

  return (
    <div className="px-4 space-y-4">
      {/* Backup reserve */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Rezervă backup</p>
        <p className="text-text-secondary text-xs mb-3">Rezervare energie pentru pene de curent</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>{reserve}% rezervă</span>
          <span className="text-sm font-bold" style={{ color: "#3B82F6" }}>{100 - reserve}% utilizare zilnică</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${reserve}%`, background: "#F59E0B" }} />
          <div className="absolute inset-y-0 rounded-full" style={{ left: `${reserve}%`, right: 0, background: "#3B82F6" }} />
          <input
            type="range" min={0} max={100} step={5} value={reserve}
            onChange={(e) => setEnergy({ backupReserve: Number(e.target.value) })}
            aria-label="Rezervă backup"
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-text-tertiary text-[11px]">Rezervă {reserveLabel} · Powerwall păstrează {reserve}% pentru pene de curent.</p>
        <button onClick={() => setEnergy({ backupReserve: 100 })} className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>Inițiați Rezervă maximă</button>
      </div>

      {/* Operational mode */}
      <div>
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Mod operațional</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {[
            { id: "self_powered" as const, label: "Autonomie energetică", desc: "Utilizați energia stocată pentru a alimenta locuința după asfințit. Reduce dependența de rețea." },
            { id: "time_based" as const, label: "Control temporizat", desc: "Utilizați energia pentru economii maxime, pe baza planului tarifar la utilitate." },
          ].map((m, i) => (
            <button key={m.id} onClick={() => setEnergy({ mode: m.id })} className="w-full flex items-start gap-3 px-4 py-3.5 text-left" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{m.label}</p>
                <p className="text-text-secondary text-xs">{m.desc}</p>
              </div>
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={energy.mode === m.id ? { background: "#3B82F6" } : { border: "1.5px solid var(--glass-border)" }}>
                {energy.mode === m.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tariff plan */}
      <div className="rounded-3xl p-4 liquid-glass">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Plan tarifar · {TARIFF.provider}</p>
          <span className="text-text-tertiary text-[11px]">azi</span>
        </div>
        <div className="flex gap-6 mb-3">
          <div><p className="text-text-tertiary text-[11px]">Preț achiziție</p><p className="text-base font-bold" style={{ color: "var(--text-1)" }}>{TARIFF.buy.toFixed(2)} {TARIFF.currency}</p></div>
          <div><p className="text-text-tertiary text-[11px]">Preț vânzare</p><p className="text-base font-bold" style={{ color: "var(--text-1)" }}>{TARIFF.sell.toFixed(2)} {TARIFF.currency}</p></div>
        </div>
        <svg viewBox="0 0 300 70" className="w-full" style={{ height: 70 }} preserveAspectRatio="none">
          <path d={`${seriesPath(TARIFF_SERIES, 300, 70, 4)} L296,66 L4,66 Z`} fill="rgba(74,222,128,0.10)" stroke="none" />
          <path d={seriesPath(TARIFF_SERIES, 300, 70, 4)} fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex justify-between text-text-tertiary text-[10px] mt-1"><span>6:00</span><span>12:00</span><span>18:00</span></div>
      </div>

      {/* Off-grid */}
      <div className="rounded-3xl p-4" style={{ background: energy.offGrid ? "rgba(245,158,11,0.07)" : "rgba(255,255,255,0.04)", border: energy.offGrid ? "1px solid rgba(245,158,11,0.22)" : "0.5px solid var(--glass-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Ieșire din rețea</p>
          <button onClick={() => setEnergy({ offGrid: !energy.offGrid })} aria-label="Off-grid" className="w-11 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: energy.offGrid ? "#F59E0B" : "rgba(255,255,255,0.15)" }}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: energy.offGrid ? "calc(100% - 22px)" : "2px", background: "#050A14" }} />
          </button>
        </div>
        <p className="text-text-secondary text-xs mb-3">Energie de rezervă rămasă: ~{hours} ore la rezerva curentă.</p>
        <div className="flex items-center justify-between text-[11px] mb-1"><span style={{ color: "var(--text-2)" }}>Limită energie sistem</span><span style={{ color: "var(--text-3)" }}>5.0 kW max</span></div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-full rounded-full" style={{ width: "62%", background: "#EF4444" }} /></div>
      </div>

      {/* Storm watch */}
      <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
        <div><p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Alerte furtuni</p><p className="text-text-secondary text-xs">Încarcă Powerwall înaintea furtunilor</p></div>
        <button onClick={() => setEnergy({ stormWatch: !energy.stormWatch })} aria-label="Storm watch" className="w-11 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: energy.stormWatch ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
          <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: energy.stormWatch ? "calc(100% - 22px)" : "2px", background: energy.stormWatch ? "#050A14" : "rgba(255,255,255,0.5)" }} />
        </button>
      </div>
    </div>
  );
}
