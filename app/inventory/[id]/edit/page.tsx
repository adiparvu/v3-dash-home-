"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../../components/layout/StatusBar";
import { useStore } from "../../../lib/store";

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
      <div className="rounded-2xl overflow-hidden transition-all" style={{ background: "var(--glass-bg)", border: `1px solid ${active ? "var(--accent)" : "var(--glass-border)"}` }}>
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

export default function EditInventoryPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { ready, findAsset, updateAsset } = useStore();
  const [loaded, setLoaded] = useState(false);
  const [missing, setMissing] = useState(false);
  const [href, setHref] = useState("");
  const [form, setForm] = useState({
    name: "", category: "Equipment", location: "Lake", brand: "", model: "", serial: "", icon: "⚙️",
  });
  const [focused, setFocused] = useState<string | null>(null);

  useEffect(() => {
    if (!ready || loaded) return;
    const a = findAsset(params.id);
    if (!a) {
      setMissing(true);
    } else {
      setHref(a.href);
      setForm({
        name: a.name, category: a.category, location: a.location,
        brand: a.brand ?? "", model: a.model ?? "", serial: a.serial ?? "", icon: a.icon,
      });
    }
    setLoaded(true);
  }, [ready, loaded, findAsset, params.id]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const canSave = form.name.trim().length > 0;

  const save = () => {
    if (!canSave || !href) return;
    const color = categories.find((c) => c.id === form.category)?.color ?? "#4ADE80";
    updateAsset(href, {
      name: form.name.trim(),
      category: form.category,
      location: form.location,
      icon: form.icon,
      accentColor: color,
      brand: form.brand.trim(),
      model: form.model.trim(),
      serial: form.serial.trim(),
    });
    router.push(href);
  };

  const fieldProps = (k: "name" | "brand" | "model" | "serial") => ({
    value: form[k],
    active: focused === k,
    onChange: (v: string) => set(k, v),
    onFocus: () => setFocused(k),
    onBlur: () => setFocused(null),
  });

  if (!ready || !loaded) {
    return <div className="min-h-screen" style={{ background: "transparent" }} />;
  }

  if (missing) {
    return (
      <div className="min-h-screen flex flex-col" style={{ color: "var(--text-1)" }}>
        <StatusBar />
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center -mt-12">
          <span className="text-5xl mb-4">📦</span>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-1)" }}>Can&apos;t edit this asset</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>Only custom assets you added can be edited.</p>
          <Link href="/inventory"><button className="px-5 py-3 rounded-2xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#4ADE80,#22C55E)", color: "#08111E" }}>Back to Inventory</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      <div className="px-4 pt-1 pb-4 flex items-center gap-3">
        <Link href={href || "/inventory"} aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="font-bold text-xl leading-tight" style={{ color: "var(--text-1)" }}>Edit Asset</h1>
          <p className="text-xs" style={{ color: "var(--text-2)" }}>Update the details</p>
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
                <button key={loc} onClick={() => set("location", loc)} className="px-3.5 py-2 rounded-xl text-sm font-medium transition-all active:scale-95" style={active ? { background: "var(--accent)", color: "var(--bg-1)" } : { background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}>
                  {loc}
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-px" style={{ background: "var(--glass-border)" }} />
        <p className="text-xs font-semibold uppercase tracking-widest px-1" style={{ color: "var(--text-3)" }}>Details</p>

        <Field label="Brand" ph="e.g. Grundfos" {...fieldProps("brand")} />
        <Field label="Model" ph="e.g. CM 5-4" {...fieldProps("model")} />
        <Field label="Serial Number" ph="e.g. GF-2023-0041" {...fieldProps("serial")} />

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
          Save Changes
        </button>
        <div className="flex justify-center">
          <Link href={href || "/inventory"}><button className="text-sm py-2 px-4" style={{ color: "var(--text-2)" }}>Cancel</button></Link>
        </div>
      </div>
    </div>
  );
}
