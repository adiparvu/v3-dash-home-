"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const quickStats = [
  { label: "Property Value", value: "€2.4M", color: "#4ADE80", sub: "+33% since purchase" },
  { label: "Purchase Price", value: "€1.8M", color: "#22D3EE", sub: "Acquired 2019" },
  { label: "Appreciation", value: "+33%", color: "#7C3AED", sub: "Over 5 years" },
  { label: "Est. Income", value: "€12k/yr", color: "#F59E0B", sub: "Rental & yield" },
];

const recentActivity = [
  {
    icon: "🌱",
    title: "Zone health updated",
    desc: "Forest zone health improved to 91",
    time: "2h ago",
    color: "#4ADE80",
  },
  {
    icon: "🔔",
    title: "Sensor alert resolved",
    desc: "Temperature spike in Greenhouse — resolved",
    time: "Yesterday",
    color: "#F59E0B",
  },
  {
    icon: "📋",
    title: "Inspection completed",
    desc: "Annual property inspection logged",
    time: "3 days ago",
    color: "#22D3EE",
  },
];

const tabs = ["Overview", "Zones", "Parcels", "Value"];

// ── Property Value Tracking (spec §6) ────────────────────────────────────────
const valueHistory = [
  { year: "2019", value: 1.8 },
  { year: "2020", value: 1.95 },
  { year: "2021", value: 2.05 },
  { year: "2022", value: 2.2 },
  { year: "2023", value: 2.3 },
  { year: "2024", value: 2.4 },
];

const improvements = [
  { name: "Smart irrigation system", year: 2021, cost: "€85k" },
  { name: "Greenhouse expansion", year: 2022, cost: "€120k" },
  { name: "Solar + battery array", year: 2023, cost: "€140k" },
];

const marketNotes =
  "Comparable private estates in Cluj county have appreciated ~7%/yr over the last 3 years. Recent infrastructure improvements and the smart-home retrofit support an above-market valuation.";

/** Build an SVG sparkline path from the value history. */
function sparkline(points: { value: number }[], w: number, h: number, pad = 4) {
  const vals = points.map((p) => p.value);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = max - min || 1;
  const stepX = (w - pad * 2) / (points.length - 1);
  return points
    .map((p, i) => {
      const x = pad + i * stepX;
      const y = pad + (h - pad * 2) * (1 - (p.value - min) / span);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function PropertyDetailPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero section */}
      <div className="relative h-64">
        {/* Gradient background simulating satellite view */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #071428 0%, #0C1F3A 20%, #0A2540 40%, #092E42 60%, #071E30 80%, #050F1E 100%)",
          }}
        />
        {/* Radial overlays for depth / teal glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 60% 50%, rgba(34,211,238,0.10) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(74,222,128,0.08) 0%, transparent 60%), radial-gradient(ellipse 35% 35% at 80% 20%, rgba(124,58,237,0.07) 0%, transparent 55%)",
          }}
        />
        {/* Subtle topographic grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Contour-line rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
          <div
            className="w-48 h-32 rounded-[50%]"
            style={{ border: "1px solid rgba(34,211,238,0.8)" }}
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04]">
          <div
            className="w-64 h-44 rounded-[50%]"
            style={{ border: "1px solid rgba(34,211,238,0.8)" }}
          />
        </div>

        {/* StatusBar transparent over hero */}
        <div className="relative z-20">
          <StatusBar transparent />
        </div>

        {/* Back button + kebab */}
        <div className="absolute top-10 left-0 right-0 px-4 flex items-center justify-between z-20">
          <Link href="/properties">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl"
              style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-white text-sm font-medium">Properties</span>
            </button>
          </Link>
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.5" fill="white" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <circle cx="19" cy="12" r="1.5" fill="white" />
            </svg>
          </button>
        </div>

        {/* Hero property name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 z-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[rgba(255,255,255,0.5)] text-xs mb-1">Private Estate</p>
              <h1 className="text-white font-bold text-3xl">Prvio Estate</h1>
            </div>
            {/* Mini health ring */}
            <svg width="52" height="52" viewBox="0 0 52 52">
              <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="4" />
              <circle
                cx="26" cy="26" r="22" fill="none"
                stroke="#4ADE80" strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - 87 / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
              />
              <text x="26" y="30" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">87</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        className="relative z-10 -mt-6 pb-10"
        style={{
          background: "rgba(10,16,28,0.98)",
          backdropFilter: "blur(20px)",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
          border: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "none",
        }}
      >
        {/* Pull handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Name + status badge */}
        <div className="px-5 pt-1 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white font-bold text-xl">Prvio Estate</h2>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}
              >
                Active
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9CA3AF" />
              </svg>
              <p className="text-[#9CA3AF] text-sm">Cluj-Napoca, România · 45 ha</p>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="px-5 mb-4">
          <div
            className="rounded-2xl p-3 grid grid-cols-4 gap-1"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="text-center">
              <p className="text-[#4ADE80] font-bold text-lg">87</p>
              <p className="text-[#6B7280] text-[10px]">Health</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">26</p>
              <p className="text-[#6B7280] text-[10px]">Zones</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">142</p>
              <p className="text-[#6B7280] text-[10px]">Objects</p>
            </div>
            <div className="text-center">
              <p className="text-[#F59E0B] font-bold text-lg">3</p>
              <p className="text-[#6B7280] text-[10px]">Alerts</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-5 mb-4 flex gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
              style={
                activeTab === tab
                  ? { background: "#4ADE80", color: "#050A14" }
                  : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Overview" && (
          <div className="px-5 space-y-4">
            {/* Quick Stats 2x2 grid */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Quick Stats</p>
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl p-3"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <p className="text-[#9CA3AF] text-[11px] mb-1">{stat.label}</p>
                    <p className="font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                    <p className="text-[#6B7280] text-[10px] mt-0.5">{stat.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Trusted Persons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider">Trusted Persons</p>
                <button className="text-[#4ADE80] text-xs">+ Add</button>
              </div>
              <div
                className="rounded-2xl p-3 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {/* Avatar with ring */}
                <div className="relative">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold"
                    style={{
                      background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)",
                      boxShadow: "0 0 0 2px #050A14, 0 0 0 3.5px rgba(74,222,128,0.5)",
                    }}
                  >
                    M
                  </div>
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center"
                    style={{ background: "#050A14" }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: "#4ADE80" }} />
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">Maria Owner</p>
                  <p className="text-[#9CA3AF] text-xs">Primary Owner · Full access</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Ownership & Continuity */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Ownership & Continuity</p>
              <Link href="/properties/transfer">
                <div
                  className="rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)" }}>📜</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium leading-tight">Transfer Ownership</p>
                    <p className="text-[#9CA3AF] text-xs">Verified, legally-recorded estate transfer</p>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </Link>
            </div>

            {/* Recent Activity */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Recent Activity</p>
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 px-3 py-3 ${i < recentActivity.length - 1 ? "border-b" : ""}`}
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                      style={{ background: `${item.color}14` }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium leading-tight">{item.title}</p>
                      <p className="text-[#9CA3AF] text-xs mt-0.5 leading-tight">{item.desc}</p>
                    </div>
                    <span className="text-[#6B7280] text-[10px] flex-shrink-0 mt-1">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "Value" && (
          <div className="px-5 space-y-4">
            {/* Current value headline + sparkline */}
            <div
              className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p className="text-[#9CA3AF] text-[11px] mb-1">Current Property Value</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-white font-bold text-3xl leading-none">€2.4M</p>
                  <p className="text-[#4ADE80] text-xs mt-1.5 font-medium">▲ +33% since purchase (2019)</p>
                </div>
                <svg width="120" height="48" viewBox="0 0 120 48" fill="none">
                  <path d={sparkline(valueHistory, 120, 48)} stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`${sparkline(valueHistory, 120, 48)} L116,44 L4,44 Z`} fill="rgba(74,222,128,0.10)" stroke="none" />
                </svg>
              </div>
            </div>

            {/* Value breakdown */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Purchase Price", value: "€1.8M", sub: "Acquired 2019", color: "#22D3EE" },
                { label: "Improvements", value: "€345k", sub: "3 capital projects", color: "#7C3AED" },
                { label: "Est. Appreciation", value: "+33%", sub: "≈ €600k over 5 yrs", color: "#4ADE80" },
                { label: "Land Area", value: "45 ha", sub: "€53k / ha", color: "#F59E0B" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-[#9CA3AF] text-[11px] mb-1">{s.label}</p>
                  <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-[#6B7280] text-[10px] mt-0.5">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Historical value */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Historical Value</p>
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {valueHistory.slice().reverse().map((h, i, arr) => {
                  const prev = arr[i + 1];
                  const delta = prev ? ((h.value - prev.value) / prev.value) * 100 : 0;
                  return (
                    <div key={h.year} className={`flex items-center justify-between px-4 py-2.5 ${i < arr.length - 1 ? "border-b" : ""}`} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                      <span className="text-[#9CA3AF] text-sm">{h.year}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-white text-sm font-medium">€{h.value.toFixed(2)}M</span>
                        {prev && (
                          <span className="text-[10px] font-medium w-12 text-right" style={{ color: delta >= 0 ? "#4ADE80" : "#EF4444" }}>
                            {delta >= 0 ? "+" : ""}{delta.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Improvements */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Improvements</p>
              <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {improvements.map((imp, i) => (
                  <div key={imp.name} className={`flex items-center justify-between px-4 py-3 ${i < improvements.length - 1 ? "border-b" : ""}`} style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-white text-sm font-medium leading-tight">{imp.name}</p>
                      <p className="text-[#6B7280] text-xs">{imp.year}</p>
                    </div>
                    <span className="text-[#7C3AED] text-sm font-semibold">{imp.cost}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Market notes */}
            <div>
              <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wider mb-2">Market Notes</p>
              <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-[#C9CDD6] text-sm leading-relaxed">{marketNotes}</p>
              </div>
            </div>
          </div>
        )}

        {(activeTab === "Zones" || activeTab === "Parcels") && (
          <div className="px-5 py-8 flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6B7280" strokeWidth="1.75" />
                <path d="M9 9h6M9 12h6M9 15h4" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-white font-semibold text-base mb-1">{activeTab}</p>
            <p className="text-[#6B7280] text-sm text-center mb-4">Explore zones and parcels spatially in the Digital Twin.</p>
            <Link href="/twin" className="px-4 py-2.5 rounded-2xl text-sm font-semibold" style={{ background: "#4ADE80", color: "#050A14" }}>Open Digital Twin</Link>
          </div>
        )}

        {/* Bottom spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
}
