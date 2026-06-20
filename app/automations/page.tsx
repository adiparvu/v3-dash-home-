"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import DetailDisclosureButton from "../components/DetailDisclosureButton";
import DetailSheet from "../components/DetailSheet";
import { useSchedules } from "../lib/useSmartHome";
import { useConditions } from "../lib/useConditions";
import { evaluateRules } from "../lib/automationRules";
import { useT, type MessageKey } from "../lib/i18n";

type Automation = (typeof automations)[number];

const AUTO_KEY = "prvio-automations-v1";

const automationTemplates: { icon: string; nkey: MessageKey; dkey: MessageKey }[] = [
  { icon: "💧", nkey: "auto.t.irrigation", dkey: "auto.t.irrigation.d" },
  { icon: "🌡️", nkey: "auto.t.climate", dkey: "auto.t.climate.d" },
  { icon: "🔒", nkey: "auto.t.security", dkey: "auto.t.security.d" },
  { icon: "📊", nkey: "auto.t.report", dkey: "auto.t.report.d" },
];

const automations = [
  {
    id: "1",
    name: "Morning Irrigation",
    trigger: "Every day at 06:00",
    action: "Start drip irrigation in Orchard",
    zone: "Orchard",
    active: true,
    icon: "💧",
    accentColor: "#22D3EE",
    lastRun: "6h ago",
    runsToday: 1,
    successRate: 100,
  },
  {
    id: "2",
    name: "Greenhouse Temperature Alert",
    trigger: "Temperature > 30°C",
    action: "Open vents + send notification",
    zone: "Greenhouse",
    active: true,
    icon: "🌡️",
    accentColor: "#F59E0B",
    lastRun: "2d ago",
    runsToday: 0,
    successRate: 98,
  },
  {
    id: "3",
    name: "Security Night Mode",
    trigger: "Sunset",
    action: "Enable motion detection on all cameras",
    zone: "Driveway",
    active: true,
    icon: "🔒",
    accentColor: "#7C3AED",
    lastRun: "14h ago",
    runsToday: 1,
    successRate: 100,
  },
  {
    id: "4",
    name: "Forest Sensor Report",
    trigger: "Every Monday at 09:00",
    action: "Generate health report + email summary",
    zone: "Forest",
    active: false,
    icon: "📊",
    accentColor: "#4ADE80",
    lastRun: "7d ago",
    runsToday: 0,
    successRate: 100,
  },
  {
    id: "5",
    name: "Lake Pump Schedule",
    trigger: "Every day at 07:00 & 19:00",
    action: "Run water pump for 30 minutes",
    zone: "Lake",
    active: true,
    icon: "⚙️",
    accentColor: "#22D3EE",
    lastRun: "5h ago",
    runsToday: 1,
    successRate: 97,
  },
  {
    id: "6",
    name: "Smart Pond Feeding",
    trigger: "Every day at 08:00 & 17:00",
    action: "Activate auto-feeder for 30 seconds",
    zone: "Smart Pond",
    active: true,
    icon: "🐟",
    accentColor: "#22D3EE",
    lastRun: "3h ago",
    runsToday: 2,
    successRate: 100,
  },
];

export default function AutomationsPage() {
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [areaFilter, setAreaFilter] = useState("All");
  const [detail, setDetail] = useState<Automation | null>(null);
  const scheduleHook = useSchedules();
  const { conditions, live } = useConditions();
  const t = useT();
  const smartRules = evaluateRules(conditions);
  const activeRules = smartRules.filter((r) => r.active).length;

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(AUTO_KEY);
      if (raw) setOverrides(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(AUTO_KEY, JSON.stringify(overrides));
    } catch {
      /* ignore */
    }
  }, [overrides, mounted]);

  const items = automations.map((a) => ({
    ...a,
    active: a.id in overrides ? overrides[a.id] : a.active,
  }));

  const toggle = (id: string) =>
    setOverrides((o) => {
      const current = id in o ? o[id] : automations.find((a) => a.id === id)?.active ?? false;
      return { ...o, [id]: !current };
    });

  const activeCount = items.filter((a) => a.active).length;
  const runsToday = items.reduce((sum, a) => sum + a.runsToday, 0);

  return (
    <div className="min-h-screen pb-28" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.automations")}</h1>
          <p className="text-text-secondary text-xs">{activeCount} {t("auto.activeLabel")} · {runsToday} {t("auto.runsToday")}</p>
        </div>
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Templates picker */}
      {showTemplates && (
        <div className="px-4 mb-4">
          <div
            className="rounded-3xl p-4"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <p className="text-white font-semibold text-sm mb-3">{t("auto.quickTemplates")}</p>
            <div className="grid grid-cols-2 gap-2">
              {automationTemplates.map((tpl) => (
                <button
                  key={tpl.nkey}
                  onClick={() => setShowTemplates(false)}
                  className="rounded-2xl p-3 text-left active:scale-95 transition-transform"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <span className="text-xl">{tpl.icon}</span>
                  <p className="text-white text-xs font-medium mt-1.5 leading-tight">{t(tpl.nkey)}</p>
                  <p className="text-text-secondary text-[10px] mt-0.5">{t(tpl.dkey)}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-3">
              <Link href="/automations/new" className="flex-1">
                <button className="w-full rounded-2xl py-2.5 text-sm font-medium" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid var(--glass-border)", color: "var(--text-1)" }}>
                  {t("auto.wizard")}
                </button>
              </Link>
              <Link href="/automations/builder" className="flex-1">
                <button className="w-full rounded-2xl py-2.5 text-sm font-medium" style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", color: "#050A14" }}>
                  {t("auto.builder")}
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-4 mb-4">
        <div
          className="rounded-3xl p-4 flex items-center justify-between"
          style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.20)" }}
        >
          <div>
            <p className="text-text-secondary text-xs">{t("auto.systemStatus")}</p>
            <p className="text-white font-bold text-lg mt-0.5">{t("auto.allRunning")}</p>
          </div>
          <div className="flex gap-5">
            <div className="text-center">
              <p className="text-white font-bold text-lg">{activeCount}</p>
              <p className="text-text-secondary text-[10px]">{t("auto.active")}</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-lg">{runsToday}</p>
              <p className="text-text-secondary text-[10px]">{t("auto.today")}</p>
            </div>
            <div className="text-center">
              <p className="text-accent-green font-bold text-lg">99%</p>
              <p className="text-text-secondary text-[10px]">{t("auto.success")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart rules — evaluated against live conditions (tariff, AQI, weather) */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("auto.smartRules")}</p>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={live
            ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
            : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{live ? t("auto.liveData") : t("auto.demo")}</span>
          <span className="text-text-tertiary text-[10px] ml-auto">{activeRules} {t("auto.activeNow")}</span>
        </div>
        <div className="rounded-2xl liquid-glass overflow-hidden">
          {smartRules.map((r, i) => (
            <div key={r.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < smartRules.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <span className="text-lg w-7 text-center flex-shrink-0">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{r.name}</p>
                <p className="text-text-secondary text-[11px] leading-snug">{r.reason}</p>
              </div>
              <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={r.active
                ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
                : { background: "var(--glass-bg)", color: "var(--text-3)" }}>{r.active ? t("auto.on") : t("auto.idle")}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduler — time-triggered automations on a timeline */}
      {(() => {
        const derived = items
          .map((a) => ({ id: String(a.id), accent: a.accentColor, icon: a.icon, name: a.name, enabled: a.active, t: (a.trigger.match(/(\d{1,2}):(\d{2})/) ? a.trigger.match(/(\d{1,2}):(\d{2})/)![0] : a.trigger.includes("Sunset") ? "20:30" : a.trigger.includes("Sunrise") ? "06:15" : null) }))
          .filter((a) => a.t) as { id: string; accent: string; icon: string; name: string; enabled: boolean; t: string }[];
        const remote = scheduleHook.schedules?.map((s) => ({ id: s.id, accent: "#22D3EE", icon: "⏰", name: s.name, enabled: s.enabled, t: s.time }));
        const scheduled = (remote && remote.length ? remote : derived).sort((a, b) => (a.t < b.t ? -1 : 1));
        if (!scheduled.length) return null;
        return (
          <div className="px-4 mb-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("auto.scheduler")}</p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={scheduleHook.source === "remote"
                ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
                : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>{scheduleHook.source === "remote" ? t("common.synced") : t("auto.demo")}</span>
            </div>
            <div className="rounded-2xl p-3 liquid-glass space-y-2">
              {scheduled.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold w-12 flex-shrink-0" style={{ color: a.accent }}>{a.t}</span>
                  <span className="text-sm flex-1 truncate" style={{ color: "var(--text-1)" }}>{a.icon} {a.name}</span>
                  <span className="text-[10px]" style={{ color: a.enabled ? "#4ADE80" : "var(--text-3)" }}>{a.enabled ? t("auto.armed") : t("auto.off")}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Area filter (group automations by zone) */}
      <div className="px-4 mb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {["All", ...Array.from(new Set(automations.map((a) => a.zone)))].map((area) => (
          <button key={area} onClick={() => setAreaFilter(area)} className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={areaFilter === area ? { background: "var(--accent)", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "var(--text-3)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {area === "All" ? t("auto.allZones") : area}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 space-y-2.5">
        {items.filter((a) => areaFilter === "All" || a.zone === areaFilter).map((auto) => (
          <Link key={auto.id} href={`/automations/${auto.id}`}>
            <div
              className="rounded-2xl p-4 active:scale-[0.98] transition-transform"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid ${auto.active ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.05)"}`,
                opacity: auto.active ? 1 : 0.6,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: `${auto.accentColor}12`, border: `1px solid ${auto.accentColor}25` }}
                >
                  {auto.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-white font-semibold text-sm leading-tight">{auto.name}</p>
                    <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: `${auto.accentColor}15`, color: auto.accentColor }}>
                      {auto.zone}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs">⚡ {auto.trigger}</p>
                  <p className="text-text-secondary text-xs mt-0.5">→ {auto.action}</p>
                  <p className="text-text-tertiary text-[10px] mt-1">{t("auto.lastRun")}: {auto.lastRun} · {auto.successRate}% {t("auto.successWord")}</p>
                </div>
                <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                  {/* Toggle */}
                  <button
                    onClick={(e) => { e.preventDefault(); toggle(auto.id); }}
                    aria-label={`${auto.active ? "Disable" : "Enable"} ${auto.name}`}
                    className="w-11 h-6 rounded-full relative transition-all duration-200"
                    style={{ background: auto.active ? "#4ADE80" : "rgba(255,255,255,0.15)" }}
                  >
                    <div
                      className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-200"
                      style={{ left: auto.active ? "calc(100% - 22px)" : "2px", background: auto.active ? "#050A14" : "rgba(255,255,255,0.5)" }}
                    />
                  </button>
                  {/* Detail disclosure — opens the automation detail sheet */}
                  <DetailDisclosureButton
                    onPress={() => setDetail(auto)}
                    label={`Details for ${auto.name}`}
                    color={auto.accentColor}
                    size={24}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Automation detail sheet (Detail Disclosure Button target) */}
      <DetailSheet
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        icon={detail?.icon}
        accent={detail?.accentColor}
      >
        {detail && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${detail.accentColor}18`, color: detail.accentColor }}>{detail.zone}</span>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: detail.active ? "rgba(74,222,128,0.15)" : "var(--glass-bg)", color: detail.active ? "#4ADE80" : "var(--text-3)" }}>{detail.active ? t("auto.active") : t("auto.paused")}</span>
            </div>

            <div className="rounded-2xl p-3.5 liquid-glass space-y-2.5">
              <div>
                <p className="text-text-secondary text-[11px] uppercase tracking-wide">{t("auto.trigger")}</p>
                <p className="text-sm" style={{ color: "var(--text-1)" }}>⚡ {detail.trigger}</p>
              </div>
              <div>
                <p className="text-text-secondary text-[11px] uppercase tracking-wide">{t("auto.action")}</p>
                <p className="text-sm" style={{ color: "var(--text-1)" }}>→ {detail.action}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: t("auto.lastRun"), value: detail.lastRun },
                { label: t("auto.runsTodayStat"), value: String(detail.runsToday) },
                { label: t("auto.success"), value: `${detail.successRate}%` },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-3 text-center liquid-glass">
                  <p className="font-bold text-sm" style={{ color: "var(--text-1)" }}>{stat.value}</p>
                  <p className="text-text-secondary text-[10px] mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link href={`/automations/${detail.id}`} className="block">
              <button className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "var(--accent)", color: "var(--bg-1)" }}>
                {t("auto.openFull")}
              </button>
            </Link>
          </div>
        )}
      </DetailSheet>

      <BottomNav />
    </div>
  );
}
