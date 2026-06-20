"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import { useT, type MessageKey } from "../../lib/i18n";

const deviceCategories = ["All", "Lighting", "Security", "Climate", "Energy"];
const CAT_KEY: Record<string, MessageKey> = { All: "zp.sh.catAll", Lighting: "zp.sh.catLighting", Security: "zp.sh.catSecurity", Climate: "zp.sh.catClimate", Energy: "zp.sh.catEnergy" };

type Device = { id: string; nameKey: MessageKey; category: string; status: boolean; value: string; valueKey?: MessageKey; icon: string; color: string; roomKey: MessageKey };
const devices: Device[] = [
  { id: "d1", nameKey: "zp.sh.d1", category: "Lighting", status: true, value: "80%", icon: "💡", color: "#F59E0B", roomKey: "zp.sh.rLiving" },
  { id: "d2", nameKey: "zp.sh.d2", category: "Lighting", status: false, value: "", valueKey: "zp.sh.off", icon: "💡", color: "#F59E0B", roomKey: "zp.sh.rKitchen" },
  { id: "d3", nameKey: "zp.sh.d3", category: "Lighting", status: false, value: "", valueKey: "zp.sh.off", icon: "💡", color: "#F59E0B", roomKey: "zp.sh.rBedroom" },
  { id: "d4", nameKey: "zp.sh.d4", category: "Lighting", status: true, value: "100%", icon: "🔦", color: "#F59E0B", roomKey: "zp.sh.rExterior" },
  { id: "d5", nameKey: "zp.sh.d5", category: "Security", status: true, value: "", valueKey: "zp.sh.locked", icon: "🔒", color: "#7C3AED", roomKey: "zp.sh.rGate" },
  { id: "d6", nameKey: "zp.sh.d6", category: "Security", status: true, value: "", valueKey: "zp.sh.locked", icon: "🔒", color: "#7C3AED", roomKey: "zp.sh.rEntrance" },
  { id: "d7", nameKey: "zp.sh.d7", category: "Security", status: false, value: "", valueKey: "zp.sh.disarmed", icon: "🚨", color: "#EF4444", roomKey: "zp.sh.rEstate" },
  { id: "d8", nameKey: "zp.sh.d8", category: "Climate", status: true, value: "22°C", icon: "❄️", color: "#22D3EE", roomKey: "zp.sh.rLiving" },
  { id: "d9", nameKey: "zp.sh.d9", category: "Climate", status: false, value: "", valueKey: "zp.sh.off", icon: "❄️", color: "#22D3EE", roomKey: "zp.sh.rBedroom" },
  { id: "d10", nameKey: "zp.sh.d10", category: "Climate", status: true, value: "21°C", icon: "🌡️", color: "#EF4444", roomKey: "zp.sh.rGroundFloor" },
  { id: "d11", nameKey: "zp.sh.d11", category: "Energy", status: true, value: "14.2 kW", icon: "☀️", color: "#4ADE80", roomKey: "zp.sh.rRoof" },
  { id: "d12", nameKey: "zp.sh.d12", category: "Energy", status: true, value: "94%", icon: "🔋", color: "#4ADE80", roomKey: "zp.sh.rUtility" },
];

export default function SmartHomePage() {
  const t = useT();
  const [category, setCategory] = useState("All");
  const [deviceStates, setDeviceStates] = useState<Record<string, boolean>>(
    Object.fromEntries(devices.map((d) => [d.id, d.status]))
  );

  const filtered = devices.filter((d) => category === "All" || d.category === category);
  const onCount = Object.values(deviceStates).filter(Boolean).length;

  function toggle(id: string) {
    setDeviceStates((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: "220px" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, #0a1030 0%, #050A14 70%)" }} />
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 390 220" fill="none">
          <defs>
            <radialGradient id="smGlow" cx="50%" cy="55%" r="40%">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="195" cy="170" rx="130" ry="55" fill="url(#smGlow)" />
          {/* Network circles */}
          {[60, 90, 120].map((r) => (
            <circle key={r} cx="195" cy="150" r={r} stroke="rgba(74,222,128,0.08)" strokeWidth="1" fill="none" />
          ))}
          {/* Device nodes */}
          {[
            { x: 195, y: 90, icon: "⚡" }, { x: 130, y: 115, icon: "💡" }, { x: 260, y: 115, icon: "❄️" },
            { x: 105, y: 155, icon: "🔒" }, { x: 285, y: 155, icon: "🌡️" }, { x: 150, y: 185, icon: "☀️" }, { x: 240, y: 185, icon: "🔋" },
          ].map((node, i) => (
            <g key={i}>
              <line x1="195" y1="150" x2={node.x} y2={node.y} stroke="rgba(74,222,128,0.15)" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx={node.x} cy={node.y} r="14" fill="rgba(74,222,128,0.08)" stroke="rgba(74,222,128,0.25)" strokeWidth="1" />
              <text x={node.x} y={node.y + 4} textAnchor="middle" fontSize="11">{node.icon}</text>
            </g>
          ))}
          <circle cx="195" cy="150" r="18" fill="rgba(74,222,128,0.12)" stroke="rgba(74,222,128,0.35)" strokeWidth="1.5" />
          <text x="195" y="155" textAnchor="middle" fontSize="14">🏠</text>
        </svg>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 40%, #050A14 100%)" }} />
        <div className="absolute top-0 left-0 right-0 px-4 pt-2 flex items-center">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
        <div className="absolute bottom-5 left-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🤖</span>
            <h1 className="text-white font-bold text-2xl">{t("zp.sh.name")}</h1>
          </div>
          <p className="text-text-secondary text-sm">{onCount}/{devices.length} {t("zp.sh.devicesActive")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: t("zp.sh.stActive"), value: onCount, color: "#4ADE80" },
            { label: t("zp.sh.stLights"), value: devices.filter((d) => d.category === "Lighting" && deviceStates[d.id]).length, color: "#F59E0B" },
            { label: t("zp.sh.stSecured"), value: devices.filter((d) => d.category === "Security" && deviceStates[d.id]).length, color: "#7C3AED" },
            { label: t("zp.sh.stEnergy"), value: "14kW", color: "#22D3EE" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-2.5 text-center" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${s.color}20` }}>
              <p className="font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
              <p className="text-text-secondary text-[9px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {deviceCategories.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={category === c ? { background: "#4ADE80", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.09)" }}>
            {t(CAT_KEY[c])}
          </button>
        ))}
      </div>

      {/* Device list */}
      <div className="px-4 space-y-2">
        {filtered.map((device) => {
          const on = deviceStates[device.id];
          return (
            <div key={device.id} className="rounded-2xl p-3.5 flex items-center gap-3" style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${on ? device.color + "25" : "rgba(255,255,255,0.08)"}` }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: on ? `${device.color}15` : "rgba(255,255,255,0.05)", border: `1px solid ${on ? device.color + "30" : "rgba(255,255,255,0.08)"}` }}>
                {device.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{t(device.nameKey)}</p>
                <p className="text-text-secondary text-xs">{t(device.roomKey)}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-xs font-medium" style={{ color: on ? device.color : "#6B7280" }}>{on ? (device.valueKey ? t(device.valueKey) : device.value) : t("zp.sh.off")}</span>
                <button onClick={() => toggle(device.id)} className="w-11 h-6 rounded-full relative transition-all duration-200" style={{ background: on ? device.color : "rgba(255,255,255,0.15)" }}>
                  <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200" style={{ left: on ? "calc(100% - 22px)" : "2px", background: on ? "#050A14" : "rgba(255,255,255,0.5)" }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}
