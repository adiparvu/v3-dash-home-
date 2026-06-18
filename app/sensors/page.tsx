"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const sensorCategories = ["All", "Water", "Air", "Soil", "Power"];

const sensors = [
  { id: "s1", name: "Lake Water Quality", zone: "Lake", category: "Water", status: "ok", value: "7.4 pH", sub: "18.4°C · DO 8.2 mg/L", icon: "💧", color: "#22D3EE", battery: 92, lastSeen: "now" },
  { id: "s2", name: "Lake Level", zone: "Lake", category: "Water", status: "ok", value: "2.4 m", sub: "Nominal depth", icon: "📊", color: "#22D3EE", battery: 78, lastSeen: "1m ago" },
  { id: "s3", name: "Greenhouse CO₂", zone: "Greenhouse", category: "Air", status: "warning", value: "780 ppm", sub: "Was 850 ppm · resolved", icon: "🌡️", color: "#F59E0B", battery: 100, lastSeen: "now" },
  { id: "s4", name: "Greenhouse Temp", zone: "Greenhouse", category: "Air", status: "ok", value: "24.3°C", sub: "Humidity 65%", icon: "🌡️", color: "#4ADE80", battery: 100, lastSeen: "now" },
  { id: "s5", name: "Greenhouse Humidity", zone: "Greenhouse", category: "Air", status: "ok", value: "65%", sub: "Optimal range 55–75%", icon: "💦", color: "#4ADE80", battery: 100, lastSeen: "now" },
  { id: "s6", name: "Forest Moisture", zone: "Forest", category: "Soil", status: "ok", value: "42%", sub: "Avg over 8 nodes", icon: "🌲", color: "#4ADE80", battery: 67, lastSeen: "5m ago" },
  { id: "s7", name: "Orchard Soil pH", zone: "Orchard", category: "Soil", status: "ok", value: "6.8", sub: "Optimal 6.5–7.0", icon: "🍎", color: "#4ADE80", battery: 55, lastSeen: "10m ago" },
  { id: "s8", name: "Orchard Soil Moisture", zone: "Orchard", category: "Soil", status: "ok", value: "38%", sub: "Post-irrigation", icon: "🌱", color: "#4ADE80", battery: 55, lastSeen: "10m ago" },
  { id: "s9", name: "Smart Pond pH", zone: "Smart Pond", category: "Water", status: "ok", value: "7.4", sub: "Ammonia 0.01 mg/L", icon: "🐟", color: "#22D3EE", battery: 88, lastSeen: "now" },
  { id: "s10", name: "Smart Pond DO", zone: "Smart Pond", category: "Water", status: "ok", value: "8.2 mg/L", sub: "Temp 22.1°C", icon: "🐠", color: "#22D3EE", battery: 88, lastSeen: "now" },
  { id: "s11", name: "Garden Moisture", zone: "Garden", category: "Soil", status: "ok", value: "51%", sub: "87 plants active", icon: "🌿", color: "#4ADE80", battery: 72, lastSeen: "3m ago" },
  { id: "s12", name: "Solar Production", zone: "Estate", category: "Power", status: "ok", value: "14.2 kW", sub: "Today: 82.4 kWh", icon: "☀️", color: "#F59E0B", battery: null, lastSeen: "now" },
  { id: "s13", name: "Grid Consumption", zone: "Estate", category: "Power", status: "ok", value: "3.1 kW", sub: "Battery 94%", icon: "⚡", color: "#4ADE80", battery: null, lastSeen: "now" },
  { id: "s14", name: "Rain Gauge", zone: "Estate", category: "Water", status: "ok", value: "0 mm", sub: "Last rain 4d ago", icon: "🌧️", color: "#22D3EE", battery: 91, lastSeen: "now" },
  { id: "s15", name: "Wind Speed", zone: "Estate", category: "Air", status: "ok", value: "12 km/h", sub: "NW direction", icon: "🌬️", color: "#9CA3AF", battery: 84, lastSeen: "now" },
];

const statusColors: Record<string, string> = { ok: "#4ADE80", warning: "#F59E0B", error: "#EF4444", offline: "#6B7280" };

export default function SensorsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = sensors.filter((s) => {
    const matchCat = category === "All" || s.category === category;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.zone.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const okCount = sensors.filter((s) => s.status === "ok").length;
  const warnCount = sensors.filter((s) => s.status === "warning").length;
  const errCount = sensors.filter((s) => s.status === "error").length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="text-white font-bold text-2xl">Sensors</h1>
        <div className="ml-auto flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4ADE80" }} />
          <span className="text-accent-green text-xs font-medium">Live</span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Online", value: okCount, color: "#4ADE80" },
            { label: "Warning", value: warnCount, color: "#F59E0B" },
            { label: "Offline", value: errCount, color: "#EF4444" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}20` }}>
              <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-text-secondary text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#6B7280" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" /></svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sensors…" className="flex-1 bg-transparent text-white text-sm placeholder-text-tertiary outline-none" />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {sensorCategories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={category === c ? { background: "#4ADE80", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.09)" }}>
            {c}
          </button>
        ))}
      </div>

      {/* Sensor list */}
      <div className="px-4 space-y-2">
        {filtered.map((sensor) => (
          <div key={sensor.id} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${sensor.color}15`, border: `1px solid ${sensor.color}25` }}>
              {sensor.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium truncate">{sensor.name}</p>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: statusColors[sensor.status] }} />
              </div>
              <p className="text-text-secondary text-xs">{sensor.zone} · {sensor.sub}</p>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <p className="text-white font-bold text-sm">{sensor.value}</p>
              <p className="text-text-tertiary text-[10px]">{sensor.lastSeen}</p>
              {sensor.battery !== null && (
                <div className="flex items-center gap-1">
                  <div className="w-8 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.12)" }}>
                    <div className="h-full rounded-full" style={{ width: `${sensor.battery}%`, background: sensor.battery > 20 ? "#4ADE80" : "#EF4444" }} />
                  </div>
                  <span className="text-text-tertiary text-[9px]">{sensor.battery}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
