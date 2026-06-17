"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const categories = ["All", "Devices", "Plants", "Equipment", "Vehicles"];

const assets = [
  {
    href: "/inventory/water-pump",
    name: "Water Pump",
    category: "Equipment",
    location: "Lake",
    status: "On",
    statusColor: "#4ADE80",
    icon: "⚙️",
    accentColor: "#22D3EE",
  },
  {
    href: "/inventory/ficus-tree",
    name: "Ficus Tree",
    category: "Plants",
    location: "Living Room",
    status: "Healthy",
    statusColor: "#4ADE80",
    icon: "🌱",
    accentColor: "#4ADE80",
  },
  {
    href: "/inventory/air-conditioner",
    name: "Air Conditioner",
    category: "Devices",
    location: "House",
    status: "On",
    statusColor: "#4ADE80",
    icon: "❄️",
    accentColor: "#22D3EE",
  },
  {
    href: "/inventory/lawn-mower",
    name: "Lawn Mower",
    category: "Equipment",
    location: "Garden",
    status: "Idle",
    statusColor: "#9CA3AF",
    icon: "🌿",
    accentColor: "#4ADE80",
  },
  {
    href: "/inventory/security-camera",
    name: "Security Camera",
    category: "Devices",
    location: "Driveway",
    status: "3 Active",
    statusColor: "#FFFFFF",
    icon: "📷",
    accentColor: "#7C3AED",
  },
  {
    href: "/inventory/irrigation-system",
    name: "Irrigation System",
    category: "Equipment",
    location: "Orchard",
    status: "Active",
    statusColor: "#4ADE80",
    icon: "💧",
    accentColor: "#22D3EE",
  },
];

export default function InventoryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = assets.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <h1 className="text-white font-bold text-2xl">Inventory</h1>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div
          className="rounded-2xl flex items-center gap-2 px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#9CA3AF" strokeWidth="1.75" />
            <path d="M16.5 16.5L21 21" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm placeholder-text-secondary outline-none"
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 mb-4 flex gap-2">
        {[
          { label: "Total Assets", value: "142", color: "#FFFFFF" },
          { label: "Active", value: "118", color: "#4ADE80" },
          { label: "Maintenance", value: "7", color: "#F59E0B" },
          { label: "Offline", value: "3", color: "#EF4444" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-2xl p-2.5 text-center"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="font-bold text-base leading-tight" style={{ color: s.color }}>{s.value}</p>
            <p className="text-text-tertiary text-[9px] leading-tight mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={
              activeCategory === cat
                ? { background: "#4ADE80", color: "#050A14" }
                : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.09)" }
            }
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Assets list */}
      <div className="px-4 space-y-2.5">
        {filtered.map((asset) => (
          <Link key={asset.href} href={asset.href}>
            <div
              className="rounded-2xl p-3.5 flex items-center gap-3.5 active:scale-[0.98] transition-transform"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${asset.accentColor}10`, border: `1px solid ${asset.accentColor}20` }}
              >
                {asset.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-tight">{asset.name}</p>
                <p className="text-text-secondary text-xs mt-0.5">{asset.category} · {asset.location}</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: asset.statusColor }} />
                <span className="text-xs font-medium" style={{ color: asset.statusColor }}>{asset.status}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* QR Scanner FAB */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
            boxShadow: "0 4px 20px rgba(74,222,128,0.4)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" rx="1" stroke="#050A14" strokeWidth="2" />
            <rect x="14" y="3" width="7" height="7" rx="1" stroke="#050A14" strokeWidth="2" />
            <rect x="3" y="14" width="7" height="7" rx="1" stroke="#050A14" strokeWidth="2" />
            <path d="M14 14h2v2h-2zM18 14h3v3h-3M14 18h3v3h-3" stroke="#050A14" strokeWidth="2" />
          </svg>
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
