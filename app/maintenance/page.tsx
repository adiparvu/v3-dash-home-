"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import { useT, type MessageKey } from "../lib/i18n";

const FILTER_KEYS: Record<string, MessageKey> = { All: "f.all", Due: "f.due", Scheduled: "f.scheduled", Completed: "f.completed" };
const STATUS_KEYS: Record<string, MessageKey> = { due: "f.due", scheduled: "f.scheduled", completed: "f.done" };
const PRIO_KEYS: Record<string, MessageKey> = { high: "prio.high", medium: "prio.medium", low: "prio.low" };

const filterTabs = ["All", "Due", "Scheduled", "Completed"];

const records = [
  { id: "m1", title: "Lake Pump Inspection", zone: "Lake", category: "Inspection", status: "due", date: "Today", priority: "high", assignee: "Ion", icon: "💧", color: "#22D3EE", notes: "Unusual noise reported. Check impeller and seals." },
  { id: "m2", title: "Greenhouse HVAC Filter Replacement", zone: "Greenhouse", category: "Replacement", status: "due", date: "Tomorrow", priority: "medium", assignee: "Ana", icon: "🏡", color: "#4ADE80", notes: "Replace HEPA filter and clean ducts." },
  { id: "m3", title: "Orchard Irrigation Calibration", zone: "Orchard", category: "Calibration", status: "scheduled", date: "Jun 25", priority: "medium", assignee: "Ion", icon: "🍎", color: "#F59E0B", notes: "Re-calibrate drip emitters before harvest." },
  { id: "m4", title: "Smart Pond Aerator Service", zone: "Smart Pond", category: "Service", status: "scheduled", date: "Jun 28", priority: "low", assignee: "Ion", icon: "🐟", color: "#22D3EE", notes: "Annual service. Check motor bearings." },
  { id: "m5", title: "Solar Panel Cleaning", zone: "Estate", category: "Cleaning", status: "scheduled", date: "Jul 2", priority: "low", assignee: "Ana", icon: "☀️", color: "#F59E0B", notes: "Use approved cleaning solution." },
  { id: "m6", title: "Forest Trail Path Repair", zone: "Forest", category: "Repair", status: "scheduled", date: "Jul 5", priority: "low", assignee: "Ion", icon: "🌲", color: "#4ADE80", notes: "Fill erosion channels near sector 3." },
  { id: "m7", title: "Greenhouse CO₂ Sensor Calibration", zone: "Greenhouse", category: "Calibration", status: "completed", date: "Jun 10", priority: "medium", assignee: "Ana", icon: "🌡️", color: "#4ADE80", notes: "Calibrated. Readings now accurate ±5 ppm." },
  { id: "m8", title: "Lake Water Quality Test", zone: "Lake", category: "Inspection", status: "completed", date: "Jun 5", priority: "high", assignee: "Ion", icon: "💧", color: "#22D3EE", notes: "All parameters within normal range." },
  { id: "m9", title: "Irrigation Main Line Flush", zone: "Orchard", category: "Service", status: "completed", date: "May 28", priority: "medium", assignee: "Ion", icon: "🌊", color: "#4ADE80", notes: "Flushed and re-pressurized. No leaks found." },
];

const priorityColors: Record<string, string> = { high: "#EF4444", medium: "#F59E0B", low: "#4ADE80" };
const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  due: { bg: "rgba(239,68,68,0.15)", text: "#EF4444", label: "Due" },
  scheduled: { bg: "rgba(34,211,238,0.12)", text: "#22D3EE", label: "Scheduled" },
  completed: { bg: "rgba(74,222,128,0.12)", text: "#4ADE80", label: "Done" },
};

export default function MaintenancePage() {
  const t = useT();
  const [activeTab, setActiveTab] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = records.filter((r) => {
    if (activeTab === "All") return true;
    if (activeTab === "Due") return r.status === "due";
    if (activeTab === "Scheduled") return r.status === "scheduled";
    if (activeTab === "Completed") return r.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "0.5px solid var(--glass-border)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.maintenance")}</h1>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {([
            { tkey: "f.due" as MessageKey, value: records.filter((r) => r.status === "due").length, color: "#EF4444" },
            { tkey: "f.scheduled" as MessageKey, value: records.filter((r) => r.status === "scheduled").length, color: "#22D3EE" },
            { tkey: "f.done" as MessageKey, value: records.filter((r) => r.status === "completed").length, color: "#4ADE80" },
          ]).map((s) => (
            <div key={s.tkey} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}20` }}>
              <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-text-secondary text-[10px]">{t(s.tkey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={activeTab === tab ? { background: "#4ADE80", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.09)" }}>
            {t(FILTER_KEYS[tab])}
          </button>
        ))}
      </div>

      {/* Records */}
      <div className="px-4 space-y-2">
        {filtered.map((record) => {
          const st = statusStyles[record.status];
          const isOpen = expanded === record.id;
          return (
            <div key={record.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button className="w-full p-3.5 flex items-center gap-3 text-left" onClick={() => setExpanded(isOpen ? null : record.id)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: `${record.color}15`, border: `1px solid ${record.color}25` }}>
                  {record.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white text-sm font-medium truncate">{record.title}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: st.bg, color: st.text }}>{t(STATUS_KEYS[record.status])}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-text-secondary text-xs">{record.zone}</p>
                    <span className="text-text-tertiary text-[10px]">·</span>
                    <p className="text-text-secondary text-xs">{record.date}</p>
                    <span className="text-text-tertiary text-[10px]">·</span>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: priorityColors[record.priority] }} />
                    <p className="text-text-secondary text-xs">{t(PRIO_KEYS[record.priority])}</p>
                  </div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ transform: isOpen ? "rotate(180deg)" : undefined, transition: "transform 0.2s", flexShrink: 0 }}>
                  <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {isOpen && (
                <div className="px-4 pb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-text-secondary text-xs mt-3 leading-relaxed">{record.notes}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary text-xs">{t("maint.assignee")}:</span>
                      <span className="text-white text-xs font-medium">{record.assignee}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-text-tertiary text-xs">{t("maint.category")}:</span>
                      <span className="text-white text-xs font-medium">{record.category}</span>
                    </div>
                  </div>
                  {record.status !== "completed" && (
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.25)", color: "#4ADE80" }}>
                        {t("maint.markComplete")}
                      </button>
                      <button className="flex-1 py-2 rounded-xl text-xs font-medium" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.10)", color: "white" }}>
                        {t("maint.reschedule")}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add FAB */}
      <button
        aria-label={t("maint.add")}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-2xl flex items-center justify-center z-20"
        style={{ background: "linear-gradient(135deg, #4ADE80 0%, #22D3EE 100%)", boxShadow: "0 4px 20px rgba(74,222,128,0.4)" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#050A14" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
}
