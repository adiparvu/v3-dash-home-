"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

const automationTemplates = [
  { icon: "💧", name: "Irrigation Schedule", desc: "Auto-water zones on a timer" },
  { icon: "🌡️", name: "Climate Alert", desc: "Notify on temp/humidity threshold" },
  { icon: "🔒", name: "Security Mode", desc: "Enable cameras at sunset" },
  { icon: "📊", name: "Weekly Report", desc: "Generate and send estate report" },
];

const automations = [
  {
    id: "1",
    name: "Morning Irrigation",
    trigger: "Every day at 06:00",
    action: "Start drip irrigation in Orchard",
    zone: "Orchard",
    active: true,
    icon: "💧",
    accentColor: "#22D3EE",
    lastRun: "6h ago",
    runsToday: 1,
    successRate: 100,
  },
  {
    id: "2",
    name: "Greenhouse Temperature Alert",
    trigger: "Temperature > 30°C",
    action: "Open vents + send notification",
    zone: "Greenhouse",
    active: true,
    icon: "🌡️",
    accentColor: "#F59E0B",
    lastRun: "2d ago",
    runsToday: 0,
    successRate: 98,
  },
  {
    id: "3",
    name: "Security Night Mode",
    trigger: "Sunset",
    action: "Enable motion detection on all cameras",
    zone: "Driveway",
    active: true,
    icon: "🔒",
    accentColor: "#7C3AED",
    lastRun: "14h ago",
    runsToday: 1,
    successRate: 100,
  },
  {
    id: "4",
    name: "Forest Sensor Report",
    trigger: "Every Monday at 09:00",
    action: "Generate health report + email summary",
    zone: "Forest",
    active: false,
    icon: "📊",
    accentColor: "#4ADE80",
    lastRun: "7d ago",
    runsToday: 0,
    successRate: 100,
  },
  {
    id: "5",
    name: "Lake Pump Schedule",
    trigger: "Every day at 07:00 & 19:00",
    action: "Run water pump for 30 minutes",
    zone: "Lake",
    active: true,
    icon: "⚙️",
    accentColor: "#22D3EE",
    lastRun: "5h ago",
    runsToday: 1,
    successRate: 97,
  },
  {
    id: "6",
    name: "Smart Pond Feeding",
    trigger: "Every day at 08:00 & 17:00",
    action: "Activate auto-feeder for 30 seconds",
    zone: "Smart Pond",
    active: true,
    icon: "🐟",
    accentColor: "#22D3EE",
    lastRun: "3h ago",
    runsToday: 2,
    successRate: 100,
  },
];

export default function AutomationsPage() {
  const [items, setItems] = useState(automations);
  const [showTemplates, setShowTemplates] = useState(false);

  const toggle = (id: string) =>
    setItems((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));

  const activeCount = items.filter((a) => a.active).length;
  const runsToday = items.reduce((sum, a) => sum + a.runsToday, 0);

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="text-white font-bold text-2xl">Automations</h1>
          <p className="text-text-secondary text-xs">{activeCount} active · {runsToday} runs today</p>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Templates picker */}
      {showTemplates && (
        <div className="px-4 mb-4">
          <div
            className="rounded-3xl p-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-white font-semibold text-sm mb-3">Quick Templates</p>
            <div className="grid grid-cols-2 gap-2">
              {automationTemplates.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setShowTemplates(false)}
                  className="rounded-2xl p-3 text-left active:scale-95 transition-transform"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-xl">{t.icon}</span>
                  <p className="text-white text-xs font-medium mt-1.5 leading-tight">{t.name}</p>
                  <p className="text-text-secondary text-[10px] mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
            <Link href="/automations/new">
              <button className="w-full mt-3 rounded-2xl py-2.5 text-sm font-medium" style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" }}>
                Build Custom Automation
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 mb-4">
        <div
          className="rounded-3xl p-4 flex items-center justify-between"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)" }}
        >
          <div>
            <p className="text-text-secondary text-xs">System Status</p>
            <p className="text-white font-bold text-lg mt-0.5">All Running</p>
          </div>
          <div className="flex gap-5">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{activeCount}</p>
              <p className="text-text-secondary text-[10px]">Active</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">{runsToday}</p>
              <p className="text-text-secondary text-[10px]">Today</p>
            </div>
            <div className="text-center">
              <p className="text-accent-green font-bold text-lg">99%</p>
              <p className="text-text-secondary text-[10px]">Success</p>
            </div>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="px-4 space-y-2.5">
        {items.map((auto) => (
          <Link key={auto.id} href={`/automations/${auto.id}`}>
            <div
              className="rounded-2xl p-4 active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${auto.active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`,
                opacity: auto.active ? 1 : 0.6,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${auto.accentColor}12`, border: `1px solid ${auto.accentColor}25` }}
                >
                  {auto.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-semibold text-sm leading-tight">{auto.name}</p>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${auto.accentColor}15`, color: auto.accentColor }}>
                      {auto.zone}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs">⚡ {auto.trigger}</p>
                  <p className="text-text-secondary text-xs mt-0.5">→ {auto.action}</p>
                  <p className="text-text-tertiary text-[10px] mt-1">Last run: {auto.lastRun} · {auto.successRate}% success</p>
                </div>
                {/* Toggle */}
                <button
                  onClick={(e) => { e.preventDefault(); toggle(auto.id); }}
                  className="w-11 h-6 rounded-full flex-shrink-0 relative transition-all duration-200 mt-1"
                  style={{ background: auto.active ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                    style={{ left: auto.active ? "calc(100% - 22px)" : "2px", background: auto.active ? "#050A14" : "rgba(255,255,255,0.5)" }}
                  />
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
