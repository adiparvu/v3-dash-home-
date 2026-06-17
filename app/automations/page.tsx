"use client";

import { useState } from "react";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const automations = [
  {
    id: 1,
    name: "Morning Irrigation",
    trigger: "Every day at 06:00",
    action: "Start drip irrigation in Orchard",
    zone: "Orchard",
    active: true,
    icon: "💧",
    accentColor: "#22D3EE",
    lastRun: "6h ago",
  },
  {
    id: 2,
    name: "Greenhouse Temperature Alert",
    trigger: "Temperature > 30°C",
    action: "Open vents + send notification",
    zone: "Greenhouse",
    active: true,
    icon: "🌡️",
    accentColor: "#F59E0B",
    lastRun: "2d ago",
  },
  {
    id: 3,
    name: "Security Night Mode",
    trigger: "Sunset",
    action: "Enable motion detection on all cameras",
    zone: "Driveway",
    active: true,
    icon: "🔒",
    accentColor: "#7C3AED",
    lastRun: "14h ago",
  },
  {
    id: 4,
    name: "Forest Sensor Report",
    trigger: "Every Monday at 09:00",
    action: "Generate health report + email summary",
    zone: "Forest",
    active: false,
    icon: "📊",
    accentColor: "#4ADE80",
    lastRun: "7d ago",
  },
  {
    id: 5,
    name: "Lake Pump Schedule",
    trigger: "Every day at 07:00 & 19:00",
    action: "Run water pump for 30 minutes",
    zone: "Lake",
    active: true,
    icon: "⚙️",
    accentColor: "#22D3EE",
    lastRun: "5h ago",
  },
];

export default function AutomationsPage() {
  const [items, setItems] = useState(automations);

  const toggle = (id: number) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const activeCount = items.filter((a) => a.active).length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">Automations</h1>
          <p className="text-text-secondary text-xs">{activeCount} of {items.length} active</p>
        </div>
        <button
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Summary */}
      <div className="px-4 mb-4">
        <div
          className="rounded-3xl p-4"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-xs">Automation Status</p>
              <p className="text-white font-bold text-xl mt-0.5">All Systems Active</p>
            </div>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(124,58,237,0.20)", border: "1px solid rgba(124,58,237,0.35)" }}
            >
              <span className="text-xl">⚡</span>
            </div>
          </div>
          <div className="flex gap-4 mt-3">
            <div><p className="text-white font-semibold text-sm">{activeCount}</p><p className="text-text-secondary text-[10px]">Running</p></div>
            <div><p className="text-white font-semibold text-sm">12</p><p className="text-text-secondary text-[10px]">Runs today</p></div>
            <div><p className="text-accent-green font-semibold text-sm">100%</p><p className="text-text-secondary text-[10px]">Success rate</p></div>
          </div>
        </div>
      </div>

      {/* Automations list */}
      <div className="px-4 space-y-2.5">
        {items.map((auto) => (
          <div
            key={auto.id}
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: `1px solid ${auto.active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`,
              opacity: auto.active ? 1 : 0.6,
            }}
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `${auto.accentColor}12`, border: `1px solid ${auto.accentColor}25` }}
              >
                {auto.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-sm">{auto.name}</p>
                  <span
                    className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: `${auto.accentColor}15`, color: auto.accentColor }}
                  >
                    {auto.zone}
                  </span>
                </div>
                <p className="text-text-secondary text-xs leading-snug">
                  <span style={{ color: "#9CA3AF" }}>When: </span>{auto.trigger}
                </p>
                <p className="text-text-secondary text-xs leading-snug mt-0.5">
                  <span style={{ color: "#9CA3AF" }}>Then: </span>{auto.action}
                </p>
                <p className="text-text-tertiary text-[10px] mt-1">Last run: {auto.lastRun}</p>
              </div>

              {/* Toggle */}
              <button
                onClick={() => toggle(auto.id)}
                className="w-11 h-6 rounded-full flex-shrink-0 relative transition-all duration-200"
                style={{ background: auto.active ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                  style={{
                    left: auto.active ? "calc(100% - 22px)" : "2px",
                    background: auto.active ? "#050A14" : "rgba(255,255,255,0.5)",
                  }}
                />
              </button>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
