"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../lib/i18n";
import { addCustomAutomation } from "../../lib/customAutomations";

const triggerTypes: { value: string; labelKey: MessageKey; icon: string; descKey: MessageKey }[] = [
  { value: "schedule", labelKey: "anew.trigSchedule", icon: "⏰", descKey: "anew.trigScheduleDesc" },
  { value: "sensor", labelKey: "anew.trigSensor", icon: "📡", descKey: "anew.trigSensorDesc" },
  { value: "event", labelKey: "anew.trigEvent", icon: "⚡", descKey: "anew.trigEventDesc" },
  { value: "manual", labelKey: "anew.trigManual", icon: "👆", descKey: "anew.trigManualDesc" },
];

const actionTypes: { value: string; labelKey: MessageKey; icon: string }[] = [
  { value: "notification", labelKey: "anew.actNotification", icon: "🔔" },
  { value: "irrigation", labelKey: "anew.actIrrigation", icon: "💧" },
  { value: "ventilation", labelKey: "anew.actVentilation", icon: "💨" },
  { value: "report", labelKey: "anew.actReport", icon: "📊" },
  { value: "email", labelKey: "anew.actEmail", icon: "📧" },
  { value: "task", labelKey: "anew.actTask", icon: "✅" },
];

const zones = ["Orchard", "Greenhouse", "Forest", "Lake", "Smart Pond", "Garden", "Driveway", "All Zones"];
const ZONE_KEY: Record<string, MessageKey> = {
  Orchard: "inv.locOrchard", Greenhouse: "inv.locGreenhouse", Forest: "inv.locForest", Lake: "inv.locLake",
  "Smart Pond": "anew.zSmartPond", Garden: "inv.locGarden", Driveway: "inv.locDriveway", "All Zones": "anew.zAllZones",
};

const STEP_KEYS: MessageKey[] = ["anew.stepNameZone", "anew.stepTrigger", "anew.stepAction"];

// Readable English summaries stored with the created automation (the list
// renders these strings directly, mirroring the seeded examples).
const TRIGGER_TEXT: Record<string, string> = {
  schedule: "On a schedule",
  sensor: "When a sensor reading crosses a threshold",
  event: "When an event occurs",
  manual: "Manually triggered",
};
const ACTION_TEXT: Record<string, string> = {
  notification: "Send a notification",
  irrigation: "Start irrigation",
  ventilation: "Adjust ventilation",
  report: "Generate a report",
  email: "Send an email summary",
  task: "Create a task",
};
const ACTION_ICON: Record<string, string> = {
  notification: "🔔", irrigation: "💧", ventilation: "💨", report: "📊", email: "📧", task: "✅",
};

export default function NewAutomationPage() {
  const t = useT();
  const router = useRouter();
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

  const handleCreate = () => {
    if (!canProceed[2]) return;
    addCustomAutomation({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      trigger: TRIGGER_TEXT[selectedTrigger] ?? selectedTrigger,
      action: ACTION_TEXT[selectedAction] ?? selectedAction,
      zone: selectedZone,
      active: true,
      icon: ACTION_ICON[selectedAction] ?? "⚙️",
      accentColor: "#4ADE80",
      lastRun: "—",
      runsToday: 0,
      successRate: 100,
    });
    router.push("/automations");
  };

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-4 flex items-center gap-3">
        <Link href="/automations" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div>
          <h1 className="text-white font-bold text-xl">{t("anew.title")}</h1>
          <p className="text-text-secondary text-xs">{t("anew.step")} {step} {t("anew.of")} 3</p>
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
          {STEP_KEYS.map((s, i) => (
            <span key={s} className="text-[10px] font-medium" style={{ color: step > i ? "#4ADE80" : "#6B7280" }}>{t(s)}</span>
          ))}
        </div>
      </div>

      <div className="px-4">
        {/* Step 1: Name & Zone */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-2">{t("anew.name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("anew.namePh")}
                className="w-full rounded-2xl px-4 py-3.5 text-white text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
              />
            </div>
            <div>
              <label className="text-text-secondary text-xs font-medium block mb-2">{t("anew.zone")}</label>
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
                    {ZONE_KEY[z] ? t(ZONE_KEY[z]) : z}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Trigger */}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-text-secondary text-xs font-medium mb-3">{t("anew.whatTriggers")}</p>
            {triggerTypes.map((tr) => (
              <button
                key={tr.value}
                onClick={() => setSelectedTrigger(tr.value)}
                className="w-full rounded-2xl p-4 flex items-center gap-3 text-left transition-all"
                style={
                  selectedTrigger === tr.value
                    ? { background: "rgba(74,222,128,0.10)", border: "1px solid rgba(74,222,128,0.35)" }
                    : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }
                }
              >
                <span className="text-2xl w-10 text-center">{tr.icon}</span>
                <div>
                  <p className="text-white font-medium text-sm">{t(tr.labelKey)}</p>
                  <p className="text-text-secondary text-xs mt-0.5">{t(tr.descKey)}</p>
                </div>
                {selectedTrigger === tr.value && (
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
            <p className="text-text-secondary text-xs font-medium mb-3">{t("anew.whatHappens")}</p>
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
                <p className="text-white font-medium text-sm">{t(a.labelKey)}</p>
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
              {t("anew.back")}
            </button>
          )}
          <button
            onClick={() => (step < 3 ? setStep((s) => s + 1) : handleCreate())}
            disabled={!canProceed[step - 1]}
            className="flex-1 rounded-2xl py-3.5 text-sm font-semibold transition-all"
            style={
              canProceed[step - 1]
                ? { background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" }
                : { background: "rgba(255,255,255,0.10)", color: "#6B7280" }
            }
          >
            {step === 3 ? t("anew.create") : t("anew.continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
