"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useStore } from "../lib/store";

const zoneTypes = ["All", "Natural", "Agriculture", "Infrastructure", "Built"];

const seedZones = [
  {
    href: "/zones/lake",
    name: "Lake",
    subtitle: "Freshwater Ecosystem",
    type: "Natural",
    status: "Excellent",
    statusColor: "#22D3EE",
    health: 95,
    icon: "💧",
    accentColor: "#22D3EE",
    metrics: [{ label: "Water Quality", value: "Excellent" }, { label: "Temp", value: "18.4°C" }],
  },
  {
    href: "/zones/forest",
    name: "Forest",
    subtitle: "Mixed Forest Zone",
    type: "Natural",
    status: "Good",
    statusColor: "#4ADE80",
    health: 91,
    icon: "🌲",
    accentColor: "#4ADE80",
    metrics: [{ label: "Trees", value: "2,543" }, { label: "Biodiversity", value: "High" }],
  },
  {
    href: "/zones/greenhouse",
    name: "Greenhouse",
    subtitle: "Main Greenhouse",
    type: "Agriculture",
    status: "Optimal",
    statusColor: "#4ADE80",
    health: 98,
    icon: "🏡",
    accentColor: "#4ADE80",
    metrics: [{ label: "Temp", value: "24.3°C" }, { label: "Humidity", value: "65%" }],
  },
  {
    href: "/zones/orchard",
    name: "Orchard",
    subtitle: "Apple Orchard",
    type: "Agriculture",
    status: "Good",
    statusColor: "#4ADE80",
    health: 88,
    icon: "🍎",
    accentColor: "#F59E0B",
    metrics: [{ label: "Harvest", value: "23 days" }, { label: "Yield", value: "12.4 t" }],
  },
  {
    href: "/zones/smart-pond",
    name: "Smart Pond",
    subtitle: "Koi & Aquatic Garden",
    type: "Natural",
    status: "Excellent",
    statusColor: "#22D3EE",
    health: 96,
    icon: "🐟",
    accentColor: "#22D3EE",
    metrics: [{ label: "pH", value: "7.4" }, { label: "O₂", value: "8.2 mg/L" }],
  },
  {
    href: "/zones/garden",
    name: "Garden",
    subtitle: "Main Garden",
    type: "Natural",
    status: "Good",
    statusColor: "#4ADE80",
    health: 84,
    icon: "🌿",
    accentColor: "#4ADE80",
    metrics: [{ label: "Plants", value: "87" }, { label: "Irrigation", value: "Active" }],
  },
  {
    href: "/zones/house",
    name: "House",
    subtitle: "Main Residence",
    type: "Built",
    status: "Good",
    statusColor: "#7C3AED",
    health: 90,
    icon: "🏠",
    accentColor: "#7C3AED",
    metrics: [{ label: "Rooms", value: "8" }, { label: "Temp", value: "22.1°C" }],
  },
  {
    href: "/zones/driveway",
    name: "Driveway",
    subtitle: "Gate & Access Control",
    type: "Built",
    status: "Secured",
    statusColor: "#9CA3AF",
    health: 100,
    icon: "🚗",
    accentColor: "#9CA3AF",
    metrics: [{ label: "Cameras", value: "4" }, { label: "Gate", value: "Closed" }],
  },
  {
    href: "/zones/smart-home",
    name: "Smart Home",
    subtitle: "Home Automation Hub",
    type: "Built",
    status: "Active",
    statusColor: "#4ADE80",
    health: 97,
    icon: "🤖",
    accentColor: "#4ADE80",
    metrics: [{ label: "Devices", value: "12" }, { label: "Active", value: "8" }],
  },
];

export default function ZonesPage() {
  const [activeType, setActiveType] = useState("All");
  const { addedZones } = useStore();

  const zones = [...addedZones, ...seedZones];
  const filtered = zones.filter((z) => activeType === "All" || z.type === activeType);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>Zones</h1>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </button>
          <Link href="/zones/new" aria-label="Add zone" className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-transform" style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </div>

      {/* Estate overview */}
      <div className="px-4 mb-4">
        <div className="rounded-3xl p-4 flex items-center justify-between" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)" }}>
          <div>
            <p className="text-text-secondary text-xs">Estate Health</p>
            <p className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>87 <span className="text-sm font-normal text-text-secondary">/ 100</span></p>
            <p className="text-accent-green text-xs font-medium">Very Good</p>
          </div>
          <div className="flex gap-5">
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{zones.length}</p>
              <p className="text-text-secondary text-[10px]">Zones</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>26</p>
              <p className="text-text-secondary text-[10px]">Sensors</p>
            </div>
            <div className="text-center">
              <p className="text-accent-green font-bold text-lg">All OK</p>
              <p className="text-text-secondary text-[10px]">Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {zoneTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={
              activeType === type
                ? { background: "#4ADE80", color: "#050A14" }
                : { background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }
            }
          >
            {type}
          </button>
        ))}
      </div>

      {/* Zone cards */}
      <div className="px-4 space-y-3">
        {filtered.map((zone) => {
          const r = 20;
          const circ = 2 * Math.PI * r;
          const zOffset = circ - (zone.health / 100) * circ;

          return (
            <Link key={zone.href} href={zone.href}>
              <div
                className="liquid-glass rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${zone.accentColor}12`, border: `1px solid ${zone.accentColor}25` }}
                >
                  {zone.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-base leading-tight" style={{ color: "var(--text-1)" }}>{zone.name}</h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${zone.statusColor}18`, color: zone.statusColor }}>
                      {zone.status}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mb-2">{zone.subtitle}</p>
                  <div className="flex gap-3">
                    {zone.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="text-text-tertiary text-[10px]">{m.label}: </span>
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-1)" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                    <circle cx="24" cy="24" r={r} fill="none" stroke={zone.accentColor} strokeWidth="3.5"
                      strokeDasharray={circ} strokeDashoffset={zOffset} strokeLinecap="round" transform="rotate(-90 24 24)" />
                    <text x="24" y="28" textAnchor="middle" fill="var(--text-1)" fontSize="10" fontWeight="bold">{zone.health}</text>
                  </svg>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
