"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../lib/i18n";

const radius = 52;
const circumference = 2 * Math.PI * radius;
const healthScore = 91;
const offset = circumference - (healthScore / 100) * circumference;

const metrics: { labelKey: MessageKey; value: string; icon: string }[] = [
  { labelKey: "zp.forest.mTrees", value: "2,543", icon: "🌲" },
  { labelKey: "zp.forest.mCarbon", value: "125.4 tCO₂", icon: "💨" },
  { labelKey: "zp.forest.mBiomass", value: "320.7 t", icon: "⚖️" },
  { labelKey: "zp.forest.mCanopy", value: "78%", icon: "🌿" },
];

const status: { labelKey: MessageKey; valueKey: MessageKey; color: string }[] = [
  { labelKey: "zp.forest.sBiodiversity", valueKey: "zp.forest.sBiodiversityV", color: "#4ADE80" },
  { labelKey: "zp.forest.sFire", valueKey: "zp.forest.sFireV", color: "#4ADE80" },
  { labelKey: "zp.forest.sDisease", valueKey: "zp.forest.sDiseaseV", color: "#4ADE80" },
  { labelKey: "zp.forest.sGrowth", valueKey: "zp.forest.sGrowthV", color: "#22D3EE" },
  { labelKey: "zp.forest.sSurvey", valueKey: "zp.forest.sSurveyV", color: "#9CA3AF" },
];

export default function ForestPage() {
  const t = useT();
  return (
    <div className="min-h-screen pb-8" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #071A10 0%, #0A2818 35%, #0C3020 70%, #081A0E 100%)",
          }}
        />
        {/* Tree silhouettes */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0 opacity-30">
          {[40, 55, 70, 85, 65, 75, 50, 60, 45, 70, 55].map((h, i) => (
            <div
              key={i}
              className="rounded-t-full flex-shrink-0"
              style={{
                width: 28,
                height: h,
                background: "linear-gradient(to top, #1A4020, #2A6030)",
                marginBottom: -2,
              }}
            />
          ))}
        </div>
        {/* Glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 300, height: 200,
            background: "radial-gradient(ellipse, rgba(74,222,128,0.10) 0%, transparent 70%)",
          }}
        />

        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="white" /><circle cx="12" cy="12" r="1.5" fill="white" /><circle cx="12" cy="19" r="1.5" fill="white" /></svg>
          </button>
        </div>

        {/* Center badge */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-3xl p-4 flex flex-col items-center gap-1"
            style={{ background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.25)", backdropFilter: "blur(10px)" }}
          >
            <span className="text-4xl">🌲</span>
            <span className="text-white font-bold text-sm">{t("zp.forest.name")}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <div className="flex items-start gap-4 mb-5">
          {/* Health ring */}
          <div className="flex flex-col items-center">
            <span className="text-text-secondary text-[10px] font-medium mb-2">{t("zp.forest.healthScore")}</span>
            <svg width="110" height="110" viewBox="0 0 120 120">
              <defs>
                <linearGradient id="forestGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle cx="60" cy="60" r={radius} fill="none" stroke="url(#forestGrad)" strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 60 60)" />
              <text x="60" y="65" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">{healthScore}</text>
            </svg>
          </div>

          {/* Metric cards */}
          <div className="flex-1 grid grid-cols-2 gap-2">
            {metrics.map((m) => (
              <div key={m.labelKey} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <span className="text-lg">{m.icon}</span>
                <p className="text-white font-bold text-sm mt-1 leading-tight">{m.value}</p>
                <p className="text-text-secondary text-[10px]">{t(m.labelKey)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Status list */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {status.map((row, i) => (
            <div
              key={row.labelKey}
              className="flex justify-between items-center px-4 py-3.5"
              style={{ borderBottom: i < status.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <span className="text-text-secondary text-sm">{t(row.labelKey)}</span>
              <span className="text-sm font-medium" style={{ color: row.color }}>{t(row.valueKey)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
