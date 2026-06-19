"use client";

/**
 * Visual automation builder — a When → (If) → Then node flow with chips and a
 * live natural-language preview. Drafts persist locally (prototype); in the
 * platform they compile to backend automation rules / schedules.
 */
import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";

const KEY = "prvio-automation-drafts-v1";

const TRIGGERS = [
  { id: "schedule", label: "Program", icon: "⏰" },
  { id: "sensor", label: "Senzor", icon: "📡" },
  { id: "event", label: "Eveniment", icon: "⚡" },
  { id: "price", label: "Preț energie", icon: "💸" },
];
const ZONES = ["Orchard", "Greenhouse", "Forest", "Lake", "Smart Pond", "Garden", "Driveway", "House", "Toate zonele"];
const SENSORS = ["Temperatură", "Umiditate sol", "CO₂", "Nivel apă", "Consum"];
const OPS = [">", "<", "="];
const ACTIONS = [
  { id: "notify", label: "Trimite notificare", icon: "🔔" },
  { id: "irrigate", label: "Pornește irigația", icon: "💧" },
  { id: "ventilate", label: "Ventilație", icon: "💨" },
  { id: "charge", label: "Încarcă Powerwall/EV", icon: "🔋" },
  { id: "report", label: "Generează raport", icon: "📊" },
  { id: "task", label: "Creează sarcină", icon: "✅" },
];

type Draft = { id: string; text: string };

function Node({ step, title, accent, children }: { step: string; title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl p-4 liquid-glass" style={{ border: `1px solid ${accent}33` }}>
      <div className="flex items-center gap-2 mb-3">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: accent, color: "#05210F" }}>{step}</span>
        <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{title}</p>
      </div>
      {children}
    </div>
  );
}

function Chips({ options, value, onPick }: { options: { id: string; label: string; icon?: string }[]; value: string; onPick: (id: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((o) => (
        <button key={o.id} onClick={() => onPick(o.id)} className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
          style={value === o.id ? { background: "var(--accent)", color: "#050A14" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-2)", border: "1px solid var(--glass-border)" }}>
          {o.icon ? `${o.icon} ` : ""}{o.label}
        </button>
      ))}
    </div>
  );
}

export default function AutomationBuilderPage() {
  const [trigger, setTrigger] = useState("schedule");
  const [zone, setZone] = useState("Greenhouse");
  const [time, setTime] = useState("06:00");
  const [sensor, setSensor] = useState("Temperatură");
  const [op, setOp] = useState(">");
  const [val, setVal] = useState("30");
  const [action, setAction] = useState("notify");
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { const raw = localStorage.getItem(KEY); if (raw) setDrafts(JSON.parse(raw)); } catch { /* ignore */ }
  }, []);
  useEffect(() => { if (mounted) try { localStorage.setItem(KEY, JSON.stringify(drafts)); } catch { /* ignore */ } }, [drafts, mounted]);

  const whenText =
    trigger === "schedule" ? `în fiecare zi la ${time}` :
    trigger === "sensor" ? `${sensor} ${op} ${val}` :
    trigger === "price" ? "când tariful e în fereastra ieftină" :
    "la un eveniment de sistem";
  const actionLabel = ACTIONS.find((a) => a.id === action)?.label.toLowerCase() ?? "";
  const preview = `Când ${whenText} în ${zone}, ${actionLabel}.`;

  const save = () => setDrafts((d) => [{ id: `${Date.now()}`, text: preview }, ...d].slice(0, 12));
  const remove = (id: string) => setDrafts((d) => d.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />
      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/automations" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl flex-1" style={{ color: "var(--text-1)" }}>Builder automatizare</h1>
      </div>

      <div className="px-4 space-y-2">
        {/* WHEN */}
        <Node step="1" title="Când (declanșator)" accent="#22D3EE">
          <Chips options={TRIGGERS} value={trigger} onPick={setTrigger} />
          {trigger === "schedule" && (
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-3 rounded-xl px-3 py-2 text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }} />
          )}
          {trigger === "sensor" && (
            <div className="flex gap-2 mt-3">
              <select value={sensor} onChange={(e) => setSensor(e.target.value)} className="flex-1 rounded-xl px-2 py-2 text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}>
                {SENSORS.map((x) => <option key={x}>{x}</option>)}
              </select>
              <select value={op} onChange={(e) => setOp(e.target.value)} className="rounded-xl px-2 py-2 text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}>
                {OPS.map((x) => <option key={x}>{x}</option>)}
              </select>
              <input value={val} onChange={(e) => setVal(e.target.value)} className="w-16 rounded-xl px-2 py-2 text-sm" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }} />
            </div>
          )}
        </Node>

        <div className="flex justify-center"><span style={{ color: "var(--text-3)" }}>↓</span></div>

        {/* WHERE */}
        <Node step="2" title="Unde (zonă)" accent="#7C3AED">
          <Chips options={ZONES.map((z) => ({ id: z, label: z }))} value={zone} onPick={setZone} />
        </Node>

        <div className="flex justify-center"><span style={{ color: "var(--text-3)" }}>↓</span></div>

        {/* THEN */}
        <Node step="3" title="Atunci (acțiune)" accent="#4ADE80">
          <Chips options={ACTIONS} value={action} onPick={setAction} />
        </Node>

        {/* Preview */}
        <div className="rounded-3xl p-4 mt-1" style={{ background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.25)" }}>
          <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-1">Previzualizare regulă</p>
          <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{preview}</p>
          <button onClick={save} className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#4ADE80,#22C55E)", color: "#05210F" }}>Salvează automatizarea</button>
        </div>

        {/* Saved drafts */}
        {mounted && drafts.length > 0 && (
          <div className="pt-2">
            <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">Reguli create ({drafts.length})</p>
            <div className="space-y-2">
              {drafts.map((d) => (
                <div key={d.id} className="rounded-2xl p-3 flex items-start gap-2 liquid-glass">
                  <span className="text-base">⚡</span>
                  <p className="text-sm flex-1" style={{ color: "var(--text-1)" }}>{d.text}</p>
                  <button onClick={() => remove(d.id)} aria-label="Șterge" className="text-xs" style={{ color: "#EF4444" }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
