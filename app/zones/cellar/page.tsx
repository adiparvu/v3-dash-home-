"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import MonitorGrid from "../../components/monitor/MonitorGrid";
import CameraWall from "../../components/cameras/CameraWall";
import { CELLAR } from "../../lib/monitor/presets";
import { useT, type MessageKey } from "../../lib/i18n";

const SPACES: { nameKey: MessageKey; icon: string; detailKey: MessageKey; color: string }[] = [
  { nameKey: "zp.cellar.sp1", icon: "🍷", detailKey: "zp.cellar.sp1d", color: "#A78BFA" },
  { nameKey: "zp.cellar.sp2", icon: "🛠️", detailKey: "zp.cellar.sp2d", color: "#22D3EE" },
  { nameKey: "zp.cellar.sp3", icon: "📦", detailKey: "zp.cellar.sp3d", color: "#4ADE80" },
  { nameKey: "zp.cellar.sp4", icon: "⚙️", detailKey: "zp.cellar.sp4d", color: "#F59E0B" },
];

const INVENTORY: { nameKey: MessageKey; qty: string; qtyKey?: MessageKey; tag: string }[] = [
  { nameKey: "zp.cellar.inv1", qty: "", qtyKey: "zp.cellar.inv1q", tag: "QR-0301" },
  { nameKey: "zp.cellar.inv2", qty: "1", tag: "QR-0302" },
  { nameKey: "zp.cellar.inv3", qty: "1", tag: "QR-0303" },
];

export default function CellarPage() {
  const t = useT();
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
            <span className="text-white font-bold text-sm">{t("zp.cellar.name")}</span>
          </div>
        </div>
      </div>

      <div className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)", borderTop: "1px solid rgba(255,255,255,0.10)" }}>
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <h1 className="text-white text-2xl font-bold mb-1">{t("zp.cellar.name")}</h1>
        <p className="text-text-secondary text-sm mb-5">{t("zp.cellar.subtitle")}</p>

        {flood && (
          <div className="rounded-2xl p-3.5 mb-5 flex items-center gap-3" style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.35)" }}>
            <span className="text-lg">🌊</span>
            <p className="text-sm font-medium" style={{ color: "#F97316" }}>{t("zp.cellar.flood")}</p>
          </div>
        )}

        <div className="mb-6">
          <MonitorGrid zoneType="cellar" specs={CELLAR} title={t("zp.cellar.envTitle")} columns={2} />
        </div>

        {/* Spaces */}
        <p className="text-xs font-medium uppercase tracking-wide mb-2.5 px-1" style={{ color: "var(--text-2)" }}>{t("zp.spaces")}</p>
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          {SPACES.map((s) => (
            <div key={s.nameKey} className="rounded-2xl p-3.5 liquid-glass">
              <span className="text-xl">{s.icon}</span>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--text-1)" }}>{t(s.nameKey)}</p>
              <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t(s.detailKey)}</p>
            </div>
          ))}
        </div>

        {/* Inventory QR */}
        <div className="flex items-center justify-between mb-2.5 px-1">
          <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--text-2)" }}>{t("zp.inventoryQr")}</p>
          <Link href="/inventory" className="text-[11px] font-medium" style={{ color: "var(--accent)" }}>{t("zp.viewAll")}</Link>
        </div>
        <div className="space-y-2 mb-6">
          {INVENTORY.map((it) => (
            <div key={it.tag} className="flex items-center gap-3 rounded-2xl p-3.5 liquid-glass">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)" }}>📦</span>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(it.nameKey)}</p>
                <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{it.qtyKey ? t(it.qtyKey) : it.qty} · {it.tag}</p>
              </div>
              <span className="text-base">▦</span>
            </div>
          ))}
        </div>

        <div>
          <CameraWall zone="cellar" title={t("zp.cellar.camTitle")} />
        </div>
      </div>
    </div>
  );
}
