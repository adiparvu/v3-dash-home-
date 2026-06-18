"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";

const events = [
  { id: 1, type: "entry", person: "Ion (Caretaker)", vehicle: "Ford Transit White", time: "7:02 AM", icon: "🚐", color: "#4ADE80" },
  { id: 2, type: "exit", person: "Unknown Vehicle", vehicle: "Delivery · DPD", time: "8:45 AM", icon: "📦", color: "#22D3EE" },
  { id: 3, type: "entry", person: "Ana (Manager)", vehicle: "Dacia Logan Silver", time: "9:58 AM", icon: "🚗", color: "#4ADE80" },
  { id: 4, type: "alert", person: "Motion detected", vehicle: "No vehicle — perimeter", time: "11:20 AM", icon: "⚠️", color: "#F59E0B" },
  { id: 5, type: "exit", person: "Ana (Manager)", vehicle: "Dacia Logan Silver", time: "2:15 PM", icon: "🚗", color: "#9CA3AF" },
];

const cameras = [
  { id: "cam1", name: "Gate Camera", status: "online", resolution: "4K", angle: "Main gate · 120°" },
  { id: "cam2", name: "Driveway North", status: "online", resolution: "1080p", angle: "North approach · 90°" },
  { id: "cam3", name: "Driveway South", status: "online", resolution: "1080p", angle: "South approach · 90°" },
  { id: "cam4", name: "Parking Area", status: "online", resolution: "4K", angle: "Parking · 180°" },
];

export default function DrivewayZonePage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "240px" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0f1a10 0%, #050A14 60%)" }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 240" fill="none">
          <defs>
            <radialGradient id="gateGlow" cx="50%" cy="65%" r="35%">
              <stop offset="0%" stopColor="#9CA3AF" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#9CA3AF" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="195" cy="190" rx="160" ry="60" fill="url(#gateGlow)" />
          {/* Driveway path (perspective) */}
          <path d="M155 240 L175 150 L215 150 L235 240 Z" stroke="rgba(156,163,175,0.3)" strokeWidth="1" fill="rgba(156,163,175,0.05)" />
          {/* Center lines */}
          <line x1="195" y1="240" x2="195" y2="155" stroke="rgba(156,163,175,0.2)" strokeWidth="1" strokeDasharray="8 6" />
          {/* Gate posts */}
          <rect x="160" y="135" width="10" height="30" rx="2" stroke="rgba(156,163,175,0.5)" strokeWidth="1.5" fill="rgba(156,163,175,0.08)" />
          <rect x="220" y="135" width="10" height="30" rx="2" stroke="rgba(156,163,175,0.5)" strokeWidth="1.5" fill="rgba(156,163,175,0.08)" />
          {/* Gate bars */}
          <path d="M170 140 L195 140 L195 160 L170 160 Z" stroke="rgba(156,163,175,0.4)" strokeWidth="1" fill="rgba(156,163,175,0.06)" />
          <path d="M195 140 L220 140 L220 160 L195 160 Z" stroke="rgba(156,163,175,0.4)" strokeWidth="1" fill="rgba(156,163,175,0.06)" />
          {/* Pillars */}
          {[130, 250].map((x) => (
            <g key={x}>
              <rect x={x - 8} y="118" width="16" height="50" rx="3" stroke="rgba(156,163,175,0.4)" strokeWidth="1.5" fill="rgba(156,163,175,0.07)" />
              <rect x={x - 6} y="112" width="12" height="8" rx="1" stroke="rgba(156,163,175,0.4)" strokeWidth="1" fill="rgba(156,163,175,0.10)" />
            </g>
          ))}
          {/* Trees lining */}
          {[95, 290].map((x, i) => (
            <g key={i}>
              <ellipse cx={x} cy="170" rx="18" ry="25" fill="rgba(74,222,128,0.07)" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
              <line x1={x} y1="195" x2={x} y2="215" stroke="rgba(74,222,128,0.25)" strokeWidth="2" />
            </g>
          ))}
        </svg>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #050A14 100%)" }} />
        <div className="absolute top-0 left-0 right-0 px-4 pt-2 flex items-center">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🚗</span>
            <h1 className="text-white font-bold text-2xl">Driveway</h1>
          </div>
          <p className="text-text-secondary text-sm">Gate Access & Surveillance</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Visits Today", value: "5", color: "#4ADE80" },
            { label: "Cameras", value: "4", color: "#22D3EE" },
            { label: "Alerts", value: "1", color: "#F59E0B" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}20` }}>
              <p className="font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
              <p className="text-text-secondary text-[10px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gate controls */}
      <div className="px-4 mb-4">
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Gate Control</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Open Gate", color: "#4ADE80", icon: "🔓" },
            { label: "Close Gate", color: "#EF4444", icon: "🔒" },
          ].map((b) => (
            <button key={b.label} className="rounded-2xl py-3.5 flex items-center justify-center gap-2" style={{ background: `${b.color}12`, border: `1px solid ${b.color}30`, color: b.color }}>
              <span>{b.icon}</span>
              <span className="font-medium text-sm">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cameras */}
      <div className="px-4 mb-4">
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Cameras</p>
        <div className="space-y-2">
          {cameras.map((cam) => (
            <div key={cam.id} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.20)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23 7l-7 5 7 5V7z" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /><rect x="1" y="5" width="15" height="14" rx="2" stroke="#22D3EE" strokeWidth="1.75" /></svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">{cam.name}</p>
                <p className="text-text-secondary text-xs">{cam.angle}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#4ADE80" }} />
                  <span className="text-accent-green text-xs">{cam.status}</span>
                </div>
                <span className="text-text-tertiary text-[10px]">{cam.resolution}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access log */}
      <div className="px-4 mb-4">
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Today&apos;s Access Log</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {events.map((ev, i) => (
            <div key={ev.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < events.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <span className="text-base w-7 text-center flex-shrink-0">{ev.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-medium truncate">{ev.person}</p>
                <p className="text-text-secondary text-[10px]">{ev.vehicle}</p>
              </div>
              <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                <span className="text-text-tertiary text-[10px]">{ev.time}</span>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full capitalize" style={{ background: `${ev.color}15`, color: ev.color }}>{ev.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
