"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useStore, slugify } from "../../lib/store";

const categories = [
  { id: "Devices", icon: "📱", color: "#22D3EE" },
  { id: "Plants", icon: "🌱", color: "#4ADE80" },
  { id: "Equipment", icon: "⚙️", color: "#22D3EE" },
  { id: "Vehicles", icon: "🚗", color: "#7C3AED" },
];

const locations = ["Lake", "Forest", "Greenhouse", "Orchard", "Garden", "House", "Driveway"];

function Field({
  label, value, ph, active, onChange, onFocus, onBlur,
}: {
  label: string; value: string; ph: string; active: boolean;
  onChange: (v: string) => void; onFocus: () => void; onBlur: () => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{label}</label>
      <div
        className="rounded-2xl overflow-hidden transition-all"
        style={{ background: "var(--glass-bg)", border: `1px solid ${active ? "var(--accent)" : "var(--glass-border)"}` }}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={ph}
          className="w-full bg-transparent px-4 py-3.5 text-sm outline-none"
          style={{ color: "var(--text-1)", caretColor: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

export default function NewInventoryPage() {
  const router = useRouter();
  const { addAsset } = useStore();
  const [form, setForm] = useState({
    name: "",
    category: "Equipment",
    location: "Lake",
    brand: "",
    model: "",
    serial: "",
    icon: "⚙️",
  });
  const [focused, setFocused] = useState<string | null>(null);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const canSave = form.name.trim().length > 0;

  const save = () => {
    if (!canSave) return;
    const slug = slugify(form.name) || `asset-${Date.now()}`;
    const color = categories.find((c) => c.id === form.category)?.color ?? "#4ADE80";
    addAsset({
      href: `/inventory/${slug}`,
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      status: "Active",
      statusColor: "#4ADE80",
      icon: form.icon,
      accentColor: color,
      brand: form.brand.trim(),
      model: form.model.trim(),
      serial: form.serial.trim(),
    });
    router.push("/inventory");
  };

  const fieldProps = (k: "name" | "brand" | "model" | "serial") => ({
    value: form[k],
    active: focused === k,
    onChange: (v: string) => set(k, v),
    onFocus: () => setFocused(k),
    onBlur: () => setFocused(null),
  });

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-4 pt-1 pb-4 flex items-center gap-3">
        <Link href="/inventory" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="font-bold text-xl leading-tight" style={{ color: "var(--text-1)" }}>New Asset</h1>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>Add an object to inventory</p>
        </div>
      </div>

      <div className="px-4 space-y-5">
        {/* Preview */}
        <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>{form.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-base leading-tight" style={{ color: "var(--text-1)" }}>{form.name.trim() || "Asset name"}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{form.category} · {form.location}</p>
          </div>
        </div>

        <Field label="Asset Name" ph="e.g. Water Pump" {...fieldProps("name")} />

        {/* Category */}
        <div>
          <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Category</label>
          <div className="grid grid-cols-4 gap-2">
            {categories.map((c) => {
              const active = form.category === c.id;
              return (
                <button key={c.id} onClick={() => { set("category", c.id); set("icon", c.icon); }} className="liquid-glass rounded-2xl py-3 flex flex-col items-center gap-1.5 active:scale-[0.95] transition-transform" style={{ border: active ? "1.5px solid var(--accent)" : undefined }}>
                  <span className="text-xl">{c.icon}</span>
                  <span className="text-[10px] font-medium" style={{ color: "var(--text-1)" }}>{c.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="text-xs font-medium block mb-2 px-1" style={{ color: "var(--text-2)" }}>Location</label>
          <div className="flex flex-wrap gap-2">
            {locations.map((loc) => {
              const active = form.location === loc;
              return (
                <button
                  key={loc}
                  onClick={() => set("location", loc)}
                  className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95"
                  style={active ? { background: "var(--accent)", color: "var(--bg-1)" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}
                >
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details section */}
        <div className="h-px" style={{ background: "var(--glass-border)" }} />
        <p className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: "var(--text-3)" }}>Details (optional)</p>

        <Field label="Brand" ph="e.g. Grundfos" {...fieldProps("brand")} />
        <Field label="Model" ph="e.g. CM 5-4" {...fieldProps("model")} />
        <Field label="Serial Number" ph="e.g. GF-2023-0041" {...fieldProps("serial")} />

        {/* QR hint */}
        <Link href="/inventory/qr">
          <div className="liquid-glass rounded-2xl p-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(34,211,238,0.12)", border: "1px solid rgba(34,211,238,0.20)", color: "var(--accent-cyan)" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.65" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.65" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.65" />
                <path d="M14 14h3v3M20 14v7M14 20h3" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Scan QR to autofill</p>
              <p className="text-xs" style={{ color: "var(--text-2)" }}>Use the asset&apos;s QR label</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
        </Link>

        {/* Save */}
        <button
          onClick={save}
          disabled={!canSave}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.97]"
          style={{
            background: canSave ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)",
            color: canSave ? "#08111E" : "var(--text-3)",
            boxShadow: canSave ? "0 8px 24px rgba(74,222,128,0.25)" : "none",
            border: canSave ? "none" : "0.5px solid var(--glass-border)",
          }}
        >
          Add Asset
        </button>
        <div className="flex justify-center">
          <Link href="/inventory"><button className="text-sm py-2 px-4" style={{ color: "var(--text-2)" }}>Cancel</button></Link>
        </div>
      </div>
    </div>
  );
}
