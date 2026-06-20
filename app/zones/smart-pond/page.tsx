"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../lib/i18n";

const stats: { labelKey: MessageKey; value: string; valueKey?: MessageKey; color: string }[] = [
  { labelKey: "zp.sp.mTemp", value: "16.2 °C", color: "#FFFFFF" },
  { labelKey: "zp.sp.mPh", value: "7.4", color: "#FFFFFF" },
  { labelKey: "zp.sp.mO2", value: "8.2 mg/L", color: "#22D3EE" },
  { labelKey: "zp.sp.mTurbidity", value: "", valueKey: "zp.sp.mTurbidityV", color: "#4ADE80" },
];

const statusRows: { labelKey: MessageKey; valueKey: MessageKey; color: string }[] = [
  { labelKey: "zp.sp.sFish", valueKey: "zp.sp.sFishV", color: "#4ADE80" },
  { labelKey: "zp.sp.sAlgae", valueKey: "zp.sp.sAlgaeV", color: "#4ADE80" },
  { labelKey: "zp.sp.sFiltration", valueKey: "zp.sp.sFiltrationV", color: "#4ADE80" },
  { labelKey: "zp.sp.sUv", valueKey: "zp.sp.sUvV", color: "#22D3EE" },
  { labelKey: "zp.sp.sFed", valueKey: "zp.sp.sFedV", color: "#9CA3AF" },
  { labelKey: "zp.sp.sCleaned", valueKey: "zp.sp.sCleanedV", color: "#9CA3AF" },
];

const actions: { labelKey: MessageKey; icon: React.ReactNode }[] = [
  {
    labelKey: "zp.lake.actHistory",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    labelKey: "zp.lake.actTasks",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    labelKey: "zp.lake.actDocuments",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    labelKey: "zp.lake.actSensors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" fill="#9CA3AF" />
      </svg>
    ),
  },
];

export default function SmartPondPage() {
  const t = useT();
  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero area */}
      <div className="relative overflow-hidden" style={{ height: "288px" }}>
        {/* Deep blue gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #040E1A 0%, #061525 35%, #082035 70%, #041018 100%)",
          }}
        />

        {/* Radial glow at center */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "52%",
            transform: "translate(-50%, -50%)",
            width: 320,
            height: 180,
            background: "radial-gradient(ellipse, rgba(34,211,238,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Animated water ripple rings (4 concentric ellipses at bottom center) */}
        {[
          { w: 90, h: 36, opacity: 0.30 },
          { w: 160, h: 64, opacity: 0.20 },
          { w: 230, h: 92, opacity: 0.13 },
          { w: 300, h: 120, opacity: 0.07 },
        ].map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: "50%",
              bottom: "56px",
              width: ring.w,
              height: ring.h,
              transform: "translateX(-50%)",
              border: `1px solid rgba(34,211,238,${ring.opacity})`,
            }}
          />
        ))}

        {/* Fish icon badge */}
        <div
          className="absolute rounded-3xl flex items-center justify-center"
          style={{
            left: "50%",
            top: "46%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            background: "rgba(34,211,238,0.10)",
            border: "1px solid rgba(34,211,238,0.32)",
            boxShadow: "0 0 28px rgba(34,211,238,0.22)",
            fontSize: "28px",
          }}
        >
          🐟
        </div>

        {/* Status bar overlay */}
        <StatusBar transparent />

        {/* Header buttons */}
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link
            href="/zones"
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="white" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <circle cx="12" cy="19" r="1.5" fill="white" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-12"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Drag indicator */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Title row */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-2xl font-bold">{t("zp.sp.name")}</h1>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(34,211,238,0.15)",
              color: "#22D3EE",
              border: "1px solid rgba(34,211,238,0.25)",
            }}
          >
            {t("zp.sp.excellent")}
          </span>
        </div>
        <p className="text-sm mb-5" style={{ color: "#9CA3AF" }}>
          {t("zp.sp.subtitle")}
        </p>

        {/* Stats grid (2x2) */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {stats.map((s) => (
            <div
              key={s.labelKey}
              className="rounded-2xl p-3.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-[10px] mb-1" style={{ color: "#6B7280" }}>
                {t(s.labelKey)}
              </p>
              <p className="text-base font-bold" style={{ color: s.color }}>
                {s.valueKey ? t(s.valueKey) : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status rows */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {statusRows.map((row, i) => (
            <div
              key={row.labelKey}
              className="flex justify-between items-center px-4 py-3"
              style={{
                borderBottom: i < statusRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <span className="text-sm" style={{ color: "#9CA3AF" }}>
                {t(row.labelKey)}
              </span>
              <span className="text-sm font-medium" style={{ color: row.color }}>
                {t(row.valueKey)}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons row */}
        <div className="grid grid-cols-4 gap-2">
          {actions.map((action) => (
            <button
              key={action.labelKey}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {action.icon}
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                {t(action.labelKey)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
