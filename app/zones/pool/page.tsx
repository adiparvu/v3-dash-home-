"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import CameraWall from "../../components/cameras/CameraWall";
import { POOL } from "../../lib/monitor/presets";
import { useT, type MessageKey } from "../../lib/i18n";

type Ctl = { id: string; labelKey: MessageKey; icon: string; modes: string[] };
const CONTROLS: Ctl[] = [
  { id: "pump", labelKey: "zp.pool.cPump", icon: "🔄", modes: ["Auto", "On", "Off"] },
  { id: "filter", labelKey: "zp.pool.cFilter", icon: "🫧", modes: ["Auto", "On", "Off"] },
  { id: "heat", labelKey: "zp.pool.cHeat", icon: "🔥", modes: ["Auto", "On", "Off"] },
  { id: "lights", labelKey: "zp.pool.cLights", icon: "💡", modes: ["Auto", "On", "Off"] },
  { id: "cover", labelKey: "zp.pool.cCover", icon: "🪟", modes: ["Auto", "Open", "Closed"] },
  { id: "dose", labelKey: "zp.pool.cDose", icon: "🧴", modes: ["Auto", "On", "Off"] },
];
const MODE_KEY: Record<string, MessageKey> = { Auto: "zp.mAuto", On: "zp.mOn", Off: "zp.mOff", Open: "zp.mOpen", Closed: "zp.mClosed" };

const SCHEDULE: { timeKey: MessageKey; detailKey: MessageKey; color: string }[] = [
  { timeKey: "zp.pool.s1", detailKey: "zp.pool.s1d", color: "#22D3EE" },
  { timeKey: "zp.pool.s2", detailKey: "zp.pool.s2d", color: "#22D3EE" },
];

export default function PoolPage() {
  const t = useT();
  const [modes, setModes] = useState<Record<string, number>>({});
  const cycle = (id: string, len: number) => setModes((m) => ({ ...m, [id]: ((m[id] ?? 0) + 1) % len }));

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <div className="relative h-60 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #062338 0%, #0A3A5E 45%, #0C4E78 100%)" }} />
        {[100, 160, 220].map((size, i) => (
          <div key={size} className="absolute rounded-full" style={{ left: "50%", top: "58%", width: size, height: size * 0.4, transform: "translate(-50%, -50%)", border: `1px solid rgba(56,189,248,${0.3 - i * 0.07})` }} />
        ))}
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl p-4 flex flex-col items-center gap-1" style={{ background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.30)", backdropFilter: "blur(10px)" }}>
            <span className="text-4xl">🏊</span>
            <span className="text-white font-bold text-sm">{t("zp.pool.name")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <h1 className="text-white text-2xl font-bold mb-1">{t("zp.pool.name")}</h1>
        <p className="text-text-secondary text-sm mb-5">{t("zp.pool.subtitle")}</p>

        <div className="mb-6">
          <MonitorGrid zoneType="pool" specs={POOL} title={t("zp.pool.monTitle")} columns={2} />
        </div>

        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.pool.equipControl")}</p>
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
                <p className="text-[11px] font-medium mt-1 truncate" style={{ color: "var(--text-1)" }}>{t(c.labelKey)}</p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: `${color}22`, color }}>{MODE_KEY[mode] ? t(MODE_KEY[mode]) : mode}</span>
              </button>
            );
          })}
        </div>

        {/* Filtration schedule + cost */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="rounded-2xl p-4 liquid-glass">
            <p className="text-xs mb-2" style={{ color: "var(--text-2)" }}>{t("zp.pool.filterSchedule")}</p>
            {SCHEDULE.map((s) => (
              <div key={s.timeKey} className="mb-1.5">
                <p className="text-[13px] font-medium" style={{ color: "var(--text-1)" }}>{t(s.timeKey)}</p>
                <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{t(s.detailKey)}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl p-4 liquid-glass flex flex-col justify-between">
            <p className="text-xs" style={{ color: "var(--text-2)" }}>{t("zp.pool.monthlyCost")}</p>
            <div><span className="text-white font-bold text-3xl">€84</span></div>
            <p className="text-[10px]" style={{ color: "var(--text-3)" }}>{t("zp.pool.costNote")}</p>
          </div>
        </div>

        <div>
          <CameraWall zone="pool" title={t("zp.pool.camTitle")} />
        </div>
      </div>
    </div>
  );
}
