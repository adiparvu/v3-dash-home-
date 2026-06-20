"use client";

import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useProperties, type UIProperty } from "../lib/useProperties";
import { useT } from "../lib/i18n";

export default function PropertiesPage() {
  const { source, properties } = useProperties();
  const t = useT();

  const count = properties.length;
  const totalHa = properties.reduce((sum, p) => sum + (p.areaHa ?? 0), 0);
  const healthVals = properties.map((p) => p.health).filter((h): h is number => h != null);
  const avgHealth = healthVals.length ? Math.round(healthVals.reduce((a, b) => a + b, 0) / healthVals.length) : null;
  const valueLabel = properties.find((p) => p.valueLabel !== "—")?.valueLabel ?? "—";

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-white font-bold text-2xl">{t("page.properties")}</h1>
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-full"
            style={
              source === "remote"
                ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "#4ADE80" }
                : { background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)", color: "#6B7280" }
            }
          >
            {source === "remote" ? `● ${t("common.synced")}` : source === "loading" ? "…" : t("auto.demo")}
          </span>
        </div>
        <Link href="/properties/new">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Link>
      </div>

      {/* Summary card */}
      <div className="px-4 mb-4">
        <div
          className="rounded-3xl p-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[#9CA3AF] text-xs mb-3">{t("props.portfolio")}</p>
          <div className="grid grid-cols-4 gap-2">
            <Stat value={String(count)} label={t("page.properties")} />
            <Stat value={totalHa ? `${Math.round(totalHa)}` : "—"} label={t("props.haTotal")} />
            <Stat value={valueLabel} label={t("props.value")} />
            <Stat value={avgHealth != null ? String(avgHealth) : "—"} label={t("props.healthAvg")} color={avgHealth != null ? "#4ADE80" : "#FFFFFF"} />
          </div>
        </div>
      </div>

      {/* Properties list */}
      <div className="px-4 mb-3">
        <p className="text-[#9CA3AF] text-xs font-medium mb-3 uppercase tracking-wider">{t("props.mine")}</p>
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      {/* Add Property button */}
      <div className="px-4 mb-6">
        <Link href="/properties/new">
          <button
            className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{ background: "transparent", border: "1.5px dashed rgba(255,255,255,0.15)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[#9CA3AF] text-sm font-medium">{t("props.add")}</span>
          </button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}

function Stat({ value, label, color = "#FFFFFF" }: { value: string; label: string; color?: string }) {
  return (
    <div className="text-center">
      <p className="font-bold text-xl" style={{ color }}>{value}</p>
      <p className="text-[#6B7280] text-[10px] leading-tight mt-0.5">{label}</p>
    </div>
  );
}

function PropertyCard({ property: p }: { property: UIProperty }) {
  const t = useT();
  return (
    <Link href={`/properties/${p.id}`}>
      <div className="rounded-3xl overflow-hidden active:scale-[0.98] transition-transform mb-3" style={{ border: "1px solid rgba(255,255,255,0.10)" }}>
        {/* Hero gradient */}
        <div
          className="h-36 relative flex items-end p-4"
          style={{ background: "linear-gradient(135deg, #0B1A2E 0%, #0D2137 25%, #0A1F35 50%, #0B2A3A 75%, #072030 100%)" }}
        >
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 70% 50% at 70% 40%, rgba(34,211,238,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 20% 60%, rgba(74,222,128,0.06) 0%, transparent 60%)" }}
          />
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
          />
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#4ADE80" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#4ADE80" }} />
            </span>
            <span className="text-[10px] text-[#4ADE80] font-medium">{t("notif.live")}</span>
          </div>
          {p.health != null && (
            <div className="absolute top-3 left-3">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.18)", border: "1px solid rgba(74,222,128,0.30)" }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#4ADE80" /></svg>
                <span className="text-[10px] font-semibold" style={{ color: "#4ADE80" }}>{p.health} · {t("props.veryGood")}</span>
              </div>
            </div>
          )}
          <div className="relative z-10">
            <p className="text-[#9CA3AF] text-xs mb-0.5">{t("props.estate")}</p>
            <h3 className="text-white font-bold text-lg leading-tight">{p.name}</h3>
          </div>
        </div>

        {/* Body */}
        <div className="p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9CA3AF" /></svg>
            <span className="text-[#9CA3AF] text-xs">{p.location}</span>
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Metric color="#22D3EE" value={p.zones != null ? String(p.zones) : "—"} unit={t("props.zones")} />
            <Metric color="#7C3AED" value={p.objects != null ? String(p.objects) : "—"} unit={t("props.objects")} />
            <Metric color="#4ADE80" value={p.areaHa != null ? `${p.areaHa} ha` : "—"} unit="" />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="1.75" /><path d="M12 7V12L15 15" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" /></svg>
              <span className="text-[#6B7280] text-[11px]">{t("props.tapToOpen")}</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function Metric({ color, value, unit }: { color: string; value: string; unit: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: color, opacity: 0.8 }} />
      <span className="text-[#9CA3AF] text-[11px]">
        <span className="text-white font-semibold">{value}</span>
        {unit ? ` ${unit}` : ""}
      </span>
    </div>
  );
}
