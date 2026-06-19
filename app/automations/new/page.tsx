"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const triggerTypes = [
  { value: "schedule", label: "Schedule", icon: "⏰", desc: "Time-based trigger" },
  { value: "sensor", label: "Sensor Threshold", icon: "📡", desc: "When a value crosses a limit" },
  { value: "event", label: "Event", icon: "⚡", desc: "On a specific system event" },
  { value: "manual", label: "Manual", icon: "👆", desc: "Run on demand" },
];

const actionTypes = [
  { value: "notification", label: "Send Notification", icon: "🔔" },
  { value: "irrigation", label: "Control Irrigation", icon: "💧" },
  { value: "ventilation", label: "Control Ventilation", icon: "💨" },
  { value: "report", label: "Generate Report", icon: "📊" },
  { value: "email", label: "Send Email", icon: "📧" },
  { value: "task", label: "Create Task", icon: "✅" },
];

const zones = ["Orchard", "Greenhouse", "Forest", "Lake", "Smart Pond", "Garden", "Driveway", "All Zones"];

export default function NewAutomationPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedZone, setSelectedZone] = useState("");
  const [selectedTrigger, setSelectedTrigger] = useState("");
  const [selectedAction, setSelectedAction] = useState("");

  const canProceed = [
    name.trim().length > 0,
    selectedZone && selectedTrigger,
    selectedAction,
  ];

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/automations" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="text-white font-bold text-xl">New Automation</h1>
          <p className="text-text-secondary text-xs">Step {step} of 3</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 mb-6">
        <div className="h-1 rounded-full" style={{ background: "rgba(255,255,255,0.10)" }}>
          <div
            className="h-1 rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%`, background: "linear-gradient(90deg, #4ADE80, #22D3EE)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {["Name & Zone", "Trigger", "Action"].map((s, i) => (
            <span key={s} className="text-[10px] font-medium" style={{ color: step > i ? "#4ADE80" : "#6B7280" }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Step 1: Name & Zone */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-2">Automation Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Morning Irrigation"
                className="w-full rounded-2xl px-4 py-3.5 text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-2">Zone</label>
              <div className="grid grid-cols-2 gap-2">
                {zones.map((z) => (
                  <button
                    key={z}
                    onClick={() => setSelectedZone(z)}
                    className="rounded-2xl px-3 py-2.5 text-sm text-left transition-all"
                    style={
                      selectedZone === z
                        ? { background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.40)", color: "#4ADE80" }
                        : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#9CA3AF" }
                    }
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Trigger */}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-text-secondary text-xs font-medium mb-3">What triggers this automation?</p>
            {triggerTypes.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTrigger(t.value)}
                className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
                style={
                  selectedTrigger === t.value
                    ? { background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.35)" }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                <span className="text-2xl w-10 text-center">{t.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{t.label}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{t.desc}</p>
                </div>
                {selectedTrigger === t.value && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#4ADE80" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#050A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Step 3: Action */}
        {step === 3 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-text-secondary text-xs font-medium mb-3">What should happen?</p>
            {actionTypes.map((a) => (
              <button
                key={a.value}
                onClick={() => setSelectedAction(a.value)}
                className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
                style={
                  selectedAction === a.value
                    ? { background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.35)" }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                <span className="text-2xl w-10 text-center">{a.icon}</span>
                <p className="text-white font-medium text-sm">{a.label}</p>
                {selectedAction === a.value && (
                  <div className="ml-auto w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#4ADE80" }}>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#050A14" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 rounded-2xl py-3.5 text-sm font-medium"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)", color: "white" }}
            >
              Back
            </button>
          )}
          <button
            onClick={() => step < 3 ? setStep((s) => s + 1) : undefined}
            disabled={!canProceed[step - 1]}
            className="flex-1 rounded-2xl py-3.5 text-sm font-semibold transition-all"
            style={
              canProceed[step - 1]
                ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" }
                : { background: "rgba(255,255,255,0.10)", color: "#6B7280" }
            }
          >
            {step === 3 ? "Create Automation" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}
