"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import CameraWall from "../../components/cameras/CameraWall";
import { GARAGE } from "../../lib/monitor/presets";
import { useT, type MessageKey } from "../../lib/i18n";

// TeslaMate-style vehicle telemetry (demo until the Tesla / Traccar bridge feeds it).
const VEHICLES = [
  { name: "Tesla Model Y", soc: 78, range: 412, charging: true, power: 11.0, tires: "2.6 bar", color: "#22D3EE" },
  { name: "Porsche Taycan", soc: 54, range: 268, charging: false, power: 0, tires: "2.7 bar", color: "#4ADE80" },
];

const TOOLS: { nameKey: MessageKey; qty: string; qtyKey?: MessageKey; tag: string }[] = [
  { nameKey: "zp.gar.t1", qty: "", qtyKey: "zp.gar.t1q", tag: "QR-0142" },
  { nameKey: "zp.gar.t2", qty: "1", tag: "QR-0143" },
  { nameKey: "zp.gar.t3", qty: "2", tag: "QR-0144" },
];

export default function GaragePage() {
  const t = useT();
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-60 overflow-hidden">
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0B0F1A 0%, #101626 40%, #0C1320 100%)" }} />
        <div className="absolute inset-0 flex items-center justify-center opacity-25">
          <svg width="160" height="120" viewBox="0 0 24 24" fill="none" stroke="rgba(34,211,238,0.7)" strokeWidth="1"><path d="M3 13l2-5a2 2 0 0 1 2-1h10a2 2 0 0 1 2 1l2 5" /><rect x="2" y="13" width="20" height="6" rx="1" /><circle cx="7" cy="19" r="1.5" /><circle cx="17" cy="19" r="1.5" /></svg>
        </div>
        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-3xl p-4 flex flex-col items-center gap-1" style={{ background: "rgba(34,211,238,0.10)", border: "1px solid rgba(34,211,238,0.25)", backdropFilter: "blur(10px)" }}>
            <span className="text-4xl">🚗</span>
            <span className="text-white font-bold text-sm">{t("zp.gar.name")}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <h1 className="text-white text-2xl font-bold mb-1">{t("zp.gar.name")}</h1>
        <p className="text-text-secondary text-sm mb-5">{t("zp.gar.subtitle")}</p>

        {/* Vehicles (TeslaMate) */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.gar.telemetry")}</p>
        <div className="space-y-3 mb-6">
          {VEHICLES.map((v) => (
            <div key={v.name} className="rounded-2xl p-4 liquid-glass">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{v.name}</span>
                {v.charging
                  ? <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>⚡ {v.power} kW</span>
                  : <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(156,163,175,0.15)", color: "#9CA3AF" }}>{t("zp.gar.parked")}</span>}
              </div>
              {/* SOC bar */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl font-bold" style={{ color: "var(--text-1)" }}>{v.soc}%</span>
                <div className="flex-1">
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${v.soc}%`, background: v.color }} />
                  </div>
                  <p className="text-[11px] mt-1" style={{ color: "var(--text-3)" }}>{v.range} {t("zp.gar.range")}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <span style={{ color: "var(--text-3)" }}>📍 {t("zp.gar.locHome")}</span>
                <span className="text-right" style={{ color: "var(--text-3)" }}>🛞 {v.tires}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ambient climate */}
        <div className="mb-6">
          <MonitorGrid zoneType="garage" specs={GARAGE} title={t("zp.gar.monTitle")} columns={2} />
        </div>

        {/* Tools inventory (QR) */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-2)" }}>{t("zp.gar.toolsQr")}</p>
          <Link href="/inventory" className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>{t("zp.viewAll")}</Link>
        </div>
        <div className="space-y-2 mb-6">
          {TOOLS.map((tool) => (
            <div key={tool.tag} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>🔧</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(tool.nameKey)}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{tool.qtyKey ? t(tool.qtyKey) : tool.qty} · {tool.tag}</p>
              </div>
              <span className="text-base">▦</span>
            </div>
          ))}
        </div>

        {/* Cameras / AI */}
        <div>
          <CameraWall zone="garage" title={t("zp.gar.camTitle")} />
        </div>
      </div>
    </div>
  );
}
