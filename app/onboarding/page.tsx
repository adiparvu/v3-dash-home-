"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "../components/ThemeProvider";
import { useStore } from "../lib/store";

const zoneOptions = [
  { id: "lake", label: "Lake", icon: "💧" },
  { id: "forest", label: "Forest", icon: "🌲" },
  { id: "greenhouse", label: "Greenhouse", icon: "🏡" },
  { id: "orchard", label: "Orchard", icon: "🍎" },
  { id: "garden", label: "Garden", icon: "🌿" },
  { id: "house", label: "House", icon: "🏠" },
  { id: "driveway", label: "Driveway", icon: "🚗" },
  { id: "pond", label: "Smart Pond", icon: "🐟" },
];

const TOTAL = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { setEstateName, setOnboarded } = useStore();
  const [step, setStep] = useState(0);
  const [estate, setEstate] = useState("");
  const [zones, setZones] = useState<string[]>(["lake", "forest", "greenhouse"]);
  const [focused, setFocused] = useState(false);

  const finish = () => {
    setEstateName(estate.trim() || "My Property");
    setOnboarded(true);
    router.push("/");
  };
  const skip = () => {
    setOnboarded(true);
    router.push("/");
  };

  const next = () => (step < TOTAL - 1 ? setStep((s) => s + 1) : finish());
  const back = () => step > 0 && setStep((s) => s - 1);
  const toggleZone = (id: string) =>
    setZones((z) => (z.includes(id) ? z.filter((x) => x !== id) : [...z, id]));

  const canContinue = step !== 1 || estate.trim().length > 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ color: "var(--text-1)" }}>
      {/* Top bar: progress + skip */}
      <div className="px-5 pt-12 pb-2 flex items-center gap-3">
        {step > 0 ? (
          <button onClick={back} aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center liquid-glass" style={{ color: "var(--text-1)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ) : (
          <div className="w-9 h-9" />
        )}
        <div className="flex-1 flex items-center gap-1.5">
          {Array.from({ length: TOTAL }).map((_, i) => (
            <span
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{ flex: i === step ? 2 : 1, background: i <= step ? "var(--accent)" : "var(--glass-border)" }}
            />
          ))}
        </div>
        <button onClick={skip} className="text-xs font-medium px-2" style={{ color: "var(--text-2)" }}>
          Skip
        </button>
      </div>

      {/* Step content */}
      <div key={step} className="flex-1 px-6 pt-6 animate-fade-in">
        {step === 0 && (
          <div className="flex flex-col items-center text-center pt-12">
            <div
              className="w-24 h-24 rounded-[28px] flex items-center justify-center mb-8"
              style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 12px 48px rgba(74,222,128,0.35)" }}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z" stroke="#08111E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-3 leading-tight" style={{ color: "var(--text-1)" }}>
              Welcome to<br />PRVIO Earth
            </h1>
            <p className="text-sm leading-relaxed max-w-[280px]" style={{ color: "var(--text-2)" }}>
              The operating system for your private estate. Monitor every zone, asset and system from one place.
            </p>
            <div className="mt-10 space-y-4 w-full max-w-[300px]">
              {[
                { icon: "🛰️", title: "Live monitoring", desc: "Real-time sensors across all zones" },
                { icon: "⚡", title: "Smart automations", desc: "Rules that run your estate for you" },
                { icon: "📦", title: "Asset intelligence", desc: "Every object tracked & maintained" },
              ].map((f) => (
                <div key={f.title} className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3.5 text-left">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{f.title}</p>
                    <p className="text-xs" style={{ color: "var(--text-2)" }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="pt-8">
            <span className="text-4xl mb-5 block">🏛️</span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-1)" }}>Name your estate</h1>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-2)" }}>
              This is how your property will appear throughout the app.
            </p>
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>Estate Name</label>
            <div
              className="rounded-2xl overflow-hidden transition-all"
              style={{ background: "var(--glass-bg)", border: `1px solid ${focused ? "var(--accent)" : "var(--glass-border)"}` }}
            >
              <input
                autoFocus
                value={estate}
                onChange={(e) => setEstate(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="e.g. Prvio Estate"
                className="w-full bg-transparent px-4 py-4 text-base outline-none"
                style={{ color: "var(--text-1)", caretColor: "var(--accent)" }}
              />
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Prvio Estate", "Lakeside Manor", "Green Valley"].map((s) => (
                <button
                  key={s}
                  onClick={() => setEstate(s)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium active:scale-95 transition-transform"
                  style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="pt-8">
            <span className="text-4xl mb-5 block">🎨</span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-1)" }}>Choose your look</h1>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-2)" }}>
              Pick a theme. You can change it anytime in Settings.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {(["light", "dark"] as const).map((t) => {
                const active = theme === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className="liquid-glass rounded-3xl p-3 text-left active:scale-[0.98] transition-transform"
                    style={{ border: active ? "1.5px solid var(--accent)" : undefined }}
                  >
                    <div className="rounded-2xl mb-2.5 p-2.5 h-28 flex flex-col gap-1.5" style={{ background: t === "dark" ? "#0c0e1a" : "#F0F1F7" }}>
                      <div className="h-2 w-10 rounded-full" style={{ background: t === "dark" ? "rgba(255,255,255,0.85)" : "#0A0A12" }} />
                      <div className="rounded-xl flex-1 p-1.5 flex items-center gap-1.5" style={{ background: t === "dark" ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.85)", border: t === "dark" ? "0.5px solid rgba(255,255,255,0.16)" : "0.5px solid rgba(0,0,0,0.06)" }}>
                        <div className="w-4 h-4 rounded-md flex-shrink-0" style={{ background: "linear-gradient(135deg,#4ADE80,#22D3EE)" }} />
                        <div className="flex-1 space-y-1">
                          <div className="h-1.5 w-full rounded-full" style={{ background: t === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }} />
                          <div className="h-1.5 w-2/3 rounded-full" style={{ background: t === "dark" ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)" }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-0.5">
                      <span className="text-sm font-medium capitalize" style={{ color: "var(--text-1)" }}>{t}</span>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center" style={{ border: active ? "none" : "1.5px solid var(--glass-border)", background: active ? "var(--accent)" : "transparent" }}>
                        {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--bg-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="pt-8">
            <span className="text-4xl mb-5 block">🗺️</span>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text-1)" }}>Add your zones</h1>
            <p className="text-sm mb-8 leading-relaxed" style={{ color: "var(--text-2)" }}>
              Select the areas you want to monitor. Tap to toggle.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {zoneOptions.map((z) => {
                const active = zones.includes(z.id);
                return (
                  <button
                    key={z.id}
                    onClick={() => toggleZone(z.id)}
                    className="liquid-glass rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.97] transition-transform"
                    style={{ border: active ? "1.5px solid var(--accent)" : undefined }}
                  >
                    <span className="text-2xl">{z.icon}</span>
                    <span className="text-sm font-medium flex-1 text-left" style={{ color: "var(--text-1)" }}>{z.label}</span>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ border: active ? "none" : "1.5px solid var(--glass-border)", background: active ? "var(--accent)" : "transparent" }}>
                      {active && <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="var(--bg-1)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-center text-xs mt-5" style={{ color: "var(--text-3)" }}>{zones.length} zones selected</p>
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={next}
          disabled={!canContinue}
          className="w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.97]"
          style={{
            background: canContinue ? "linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)" : "var(--glass-bg)",
            color: canContinue ? "#08111E" : "var(--text-3)",
            boxShadow: canContinue ? "0 8px 28px rgba(74,222,128,0.30)" : "none",
            border: canContinue ? "none" : "0.5px solid var(--glass-border)",
          }}
        >
          {step === 0 ? "Get Started" : step === TOTAL - 1 ? "Enter PRVIO" : "Continue"}
        </button>
      </div>
    </div>
  );
}
