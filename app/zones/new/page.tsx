"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";

const types = [
  { id: "Natural", label: "Natural", icon: "🌿", color: "#4ADE80" },
  { id: "Agriculture", label: "Agriculture", icon: "🌾", color: "#F59E0B" },
  { id: "Infrastructure", label: "Infrastructure", icon: "🛠️", color: "#22D3EE" },
  { id: "Built", label: "Built", icon: "🏠", color: "#7C3AED" },
];

const iconChoices = ["💧", "🌲", "🏡", "🍎", "🌿", "🐟", "🏠", "🚗", "⚡", "🌻", "🪴", "🏞️"];

export default function NewZonePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState("Natural");
  const [icon, setIcon] = useState("🌿");
  const [focused, setFocused] = useState<string | null>(null);

  const inputWrap = (key: string) => ({
    background: "var(--glass-bg)",
    border: `1px solid ${focused === key ? "var(--accent)" : "var(--glass-border)"}`,
  });

  const canSave = name.trim().length > 0;

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-4 pt-1 pb-4 flex items-center gap-3">
        <Link href="/zones" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="font-bold text-xl leading-tight" style={{ color: "var(--text-1)" }}>New Zone</h1>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>Define an area to monitor</p>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* Live preview card */}
        <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base leading-tight" style={{ color: "var(--text-1)" }}>{name.trim() || "Zone name"}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{subtitle.trim() || "Subtitle"}</p>
            <span className="inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(74,222,128,0.15)", color: "var(--accent)" }}>{type}</span>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Zone Name</label>
          <div className="rounded-2xl overflow-hidden transition-all" style={inputWrap("name")}>
            <input value={name} onChange={(e) => setName(e.target.value)} onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} placeholder="e.g. North Lake" className="w-full bg-transparent px-4 py-3.5 text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
          </div>
        </div>

        {/* Subtitle */}
        <div>
          <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Subtitle</label>
          <div className="rounded-2xl overflow-hidden transition-all" style={inputWrap("subtitle")}>
            <input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} onFocus={() => setFocused("subtitle")} onBlur={() => setFocused(null)} placeholder="e.g. Freshwater Ecosystem" className="w-full bg-transparent px-4 py-3.5 text-sm outline-none" style={{ color: "var(--text-1)", caretColor: "var(--accent)" }} />
          </div>
        </div>

        {/* Type */}
        <div>
          <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Zone Type</label>
          <div className="grid grid-cols-2 gap-2.5">
            {types.map((t) => {
              const active = type === t.id;
              return (
                <button key={t.id} onClick={() => setType(t.id)} className="liquid-glass rounded-2xl p-3 flex items-center gap-2.5 active:scale-[0.97] transition-transform" style={{ border: active ? `1.5px solid ${t.color}` : undefined }}>
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Icon */}
        <div>
          <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Icon</label>
          <div className="liquid-glass rounded-2xl p-3 grid grid-cols-6 gap-2">
            {iconChoices.map((ic) => {
              const active = icon === ic;
              return (
                <button key={ic} onClick={() => setIcon(ic)} className="aspect-square rounded-xl flex items-center justify-center text-xl active:scale-90 transition-transform" style={{ background: active ? "rgba(74,222,128,0.15)" : "var(--glass-bg)", border: active ? "1.5px solid var(--accent)" : "0.5px solid var(--glass-border)" }}>
                  {ic}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save */}
        <button
          onClick={() => router.push("/zones")}
          disabled={!canSave}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.97] mt-1"
          style={{
            background: canSave ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)",
            color: canSave ? "#08111E" : "var(--text-3)",
            boxShadow: canSave ? "0 8px 24px rgba(74,222,128,0.25)" : "none",
            border: canSave ? "none" : "0.5px solid var(--glass-border)",
          }}
        >
          Create Zone
        </button>
        <div className="flex justify-center">
          <Link href="/zones"><button className="text-sm py-2 px-4" style={{ color: "var(--text-2)" }}>Cancel</button></Link>
        </div>
      </div>
    </div>
  );
}
