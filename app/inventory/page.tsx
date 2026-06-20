"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useAssets } from "../lib/useAssets";
import { useT, type MessageKey } from "../lib/i18n";

const categories = ["All", "Devices", "Plants", "Equipment", "Vehicles"];

const CAT_KEY: Record<string, MessageKey> = {
  All: "inv.catAll", Devices: "inv.catDevices", Plants: "inv.catPlants", Equipment: "inv.catEquipment", Vehicles: "inv.catVehicles",
};
const LOC_KEY: Record<string, MessageKey> = {
  Lake: "inv.locLake", Forest: "inv.locForest", Greenhouse: "inv.locGreenhouse", Orchard: "inv.locOrchard", Garden: "inv.locGarden", House: "inv.locHouse", Driveway: "inv.locDriveway",
};
const STATUS_KEY: Record<string, MessageKey> = {
  Active: "inv.statusActive", Idle: "inv.statusIdle", Offline: "inv.statusOffline",
};

export default function InventoryPage() {
  const t = useT();
  const tx = (map: Record<string, MessageKey>, v: string) => (map[v] ? t(map[v]) : v);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const { assets, source } = useAssets();

  const filtered = assets.filter((a) => {
    const matchesCategory = activeCategory === "All" || a.category === activeCategory;
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.inventory")}</h1>
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-full"
            style={
              source === "remote"
                ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }
                : { background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }
            }
          >
            {source === "remote" ? `● ${t("inv.synced")}` : source === "loading" ? "…" : t("inv.demo")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/inventory/new"
            aria-label={t("inv.addAssetAria")}
            className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div
          className="rounded-2xl flex items-center gap-2 px-3.5 py-2.5"
          style={{ background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ color: "var(--text-3)", flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" />
            <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder={t("inv.searchAssets")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-1)" }}
          />
        </div>
      </div>

      {/* Stats strip */}
      <div className="px-4 mb-4 flex gap-2">
        {[
          { label: t("inv.totalAssets"), value: String(assets.length), color: "var(--text-1)" },
          { label: t("inv.statActive"), value: String(assets.filter((a) => a.statusColor === "#4ADE80").length), color: "#4ADE80" },
          { label: t("inv.statMaintenance"), value: String(assets.filter((a) => a.status === "Idle").length), color: "#F59E0B" },
          { label: t("inv.statOffline"), value: String(assets.filter((a) => a.status === "Offline" || a.statusColor === "#EF4444").length), color: "#EF4444" },
        ].map((s) => (
          <div key={s.label} className="liquid-glass flex-1 rounded-2xl p-2.5 text-center">
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
                : { background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }
            }
          >
            {tx(CAT_KEY, cat)}
          </button>
        ))}
      </div>

      {/* Assets list */}
      <div className="px-4 space-y-2.5">
        {filtered.map((asset) => (
          <Link key={asset.href} href={asset.href}>
            <div className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3.5 active:scale-[0.98] transition-transform">
              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${asset.accentColor}10`, border: `1px solid ${asset.accentColor}20` }}
              >
                {asset.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-1)" }}>{asset.name}</p>
                <p className="text-text-secondary text-xs mt-0.5">{tx(CAT_KEY, asset.category)} · {tx(LOC_KEY, asset.location)}</p>
              </div>

              {/* Status */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: asset.statusColor }} />
                <span className="text-xs font-medium" style={{ color: asset.statusColor }}>{tx(STATUS_KEY, asset.status)}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* QR Scanner FAB */}
      <div className="fixed bottom-24 right-5 z-40">
        <Link
          href="/inventory/qr"
          aria-label={t("inv.scanQrAria")}
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
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
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
