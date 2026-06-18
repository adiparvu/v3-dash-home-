"use client";

import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";

const rooms = [
  { name: "Living Room", floor: "Ground", area: "42 m²", temp: "22.1°C", status: "ok", devices: 6 },
  { name: "Kitchen", floor: "Ground", area: "28 m²", temp: "23.4°C", status: "ok", devices: 4 },
  { name: "Master Bedroom", floor: "First", area: "35 m²", temp: "21.2°C", status: "ok", devices: 5 },
  { name: "Study / Office", floor: "First", area: "20 m²", temp: "21.8°C", status: "ok", devices: 3 },
  { name: "Dining Room", floor: "Ground", area: "32 m²", temp: "22.0°C", status: "ok", devices: 2 },
  { name: "Library", floor: "First", area: "18 m²", temp: "20.9°C", status: "ok", devices: 2 },
  { name: "Garage", floor: "Ground", area: "45 m²", temp: "18.5°C", status: "warning", devices: 3 },
  { name: "Wine Cellar", floor: "Basement", area: "22 m²", temp: "14.2°C", status: "ok", devices: 2 },
];

const statusColor: Record<string, string> = { ok: "#4ADE80", warning: "#F59E0B", error: "#EF4444" };

const systems = [
  { label: "HVAC", value: "22.1°C avg", status: "ok" },
  { label: "Security", value: "Armed", status: "ok" },
  { label: "Lighting", value: "6 on", status: "ok" },
  { label: "Water", value: "Normal", status: "ok" },
];

export default function HouseZonePage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "280px" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #1a0a2e 0%, #050A14 60%, #0a1628 100%)" }} />
        {/* House outline SVG */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 280" fill="none">
          <defs>
            <radialGradient id="houseGlow" cx="50%" cy="60%" r="40%">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="195" cy="200" rx="140" ry="70" fill="url(#houseGlow)" />
          {/* Main house */}
          <path d="M120 230 L120 160 L195 110 L270 160 L270 230 Z" stroke="rgba(124,58,237,0.5)" strokeWidth="1.5" fill="rgba(124,58,237,0.08)" />
          {/* Roof */}
          <path d="M110 165 L195 105 L280 165" stroke="rgba(124,58,237,0.7)" strokeWidth="1.5" fill="none" />
          {/* Door */}
          <rect x="181" y="198" width="28" height="32" rx="3" stroke="rgba(124,58,237,0.5)" strokeWidth="1.2" fill="rgba(124,58,237,0.12)" />
          {/* Windows ground floor */}
          <rect x="130" y="185" width="28" height="22" rx="2" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" fill="rgba(124,58,237,0.10)" />
          <rect x="232" y="185" width="28" height="22" rx="2" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" fill="rgba(124,58,237,0.10)" />
          {/* Windows first floor */}
          <rect x="143" y="153" width="22" height="18" rx="2" stroke="rgba(124,58,237,0.35)" strokeWidth="1.2" fill="rgba(124,58,237,0.08)" />
          <rect x="225" y="153" width="22" height="18" rx="2" stroke="rgba(124,58,237,0.35)" strokeWidth="1.2" fill="rgba(124,58,237,0.08)" />
          {/* Chimney */}
          <rect x="230" y="100" width="14" height="22" stroke="rgba(124,58,237,0.4)" strokeWidth="1.2" fill="rgba(124,58,237,0.07)" />
          {/* Smoke */}
          <path d="M237 100 Q240 90 237 82 Q234 74 237 66" stroke="rgba(124,58,237,0.2)" strokeWidth="1" fill="none" />
        </svg>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #050A14 100%)" }} />
        {/* Back button */}
        <div className="absolute top-0 left-0 right-0 px-4 pt-2 flex items-center gap-3">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        {/* Zone title */}
        <div className="absolute bottom-6 left-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🏠</span>
            <h1 className="text-white font-bold text-2xl">House</h1>
          </div>
          <p className="text-text-secondary text-sm">Main Residence · {rooms.length} rooms</p>
        </div>
      </div>

      {/* Systems strip */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {systems.map((s) => (
            <div key={s.label} className="rounded-2xl p-2.5 text-center" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)" }}>
              <p className="text-white font-bold text-xs">{s.value}</p>
              <p className="text-text-secondary text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floor sections */}
      {["Ground", "First", "Basement"].map((floor) => {
        const floorRooms = rooms.filter((r) => r.floor === floor);
        if (!floorRooms.length) return null;
        return (
          <div key={floor} className="px-4 mb-4">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{floor} Floor</p>
            <div className="space-y-2">
              {floorRooms.map((room) => (
                <div key={room.name} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div className="w-2 h-8 rounded-full flex-shrink-0" style={{ background: statusColor[room.status] }} />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{room.name}</p>
                    <p className="text-text-secondary text-xs">{room.area} · {room.devices} devices</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white text-sm font-bold">{room.temp}</p>
                    <p className="text-text-tertiary text-[10px]">Temperature</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        {[
          { label: "All Lights Off", icon: "💡", color: "#F59E0B" },
          { label: "Lock Doors", icon: "🔒", color: "#7C3AED" },
          { label: "Night Mode", icon: "🌙", color: "#22D3EE" },
          { label: "Climate Control", icon: "🌡️", color: "#4ADE80" },
        ].map((a) => (
          <button key={a.label} className="rounded-2xl p-3.5 flex items-center gap-2.5 active:scale-[0.97] transition-transform" style={{ background: `${a.color}10`, border: `1px solid ${a.color}25` }}>
            <span className="text-lg">{a.icon}</span>
            <span className="text-white text-xs font-medium">{a.label}</span>
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
