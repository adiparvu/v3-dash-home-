"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import DetailDisclosureButton from "../components/DetailDisclosureButton";
import DetailSheet from "../components/DetailSheet";
import { useZones } from "../lib/useZones";
import { faultsForZone, SEVERITY_META } from "../lib/diagnostics";
import { recommendSensors, CONNECTION_GUIDE } from "../lib/sensorAdvisor";
import { useT } from "../lib/i18n";
import type { Zone } from "../lib/store";

const zoneTypes = ["All", "Natural", "Agriculture", "Infrastructure", "Built"];

export default function ZonesPage() {
  const [activeType, setActiveType] = useState("All");
  const [detail, setDetail] = useState<Zone | null>(null);
  const [openSensor, setOpenSensor] = useState<string | null>(null);
  const { zones, source } = useZones();
  const t = useT();

  const filtered = zones.filter((z) => activeType === "All" || z.type === activeType);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>{t("page.zones")}</h1>
          <span
            className="text-[10px] font-medium px-2 py-1 rounded-full"
            style={
              source === "remote"
                ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }
                : { background: "rgba(255,255,255,0.06)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }
            }
          >
            {source === "remote" ? "● Synced" : source === "loading" ? "…" : "Demo"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/search" aria-label="Search" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </Link>
          <Link href="/zones/new" aria-label="Add zone" className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-90 transition-transform" style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)", color: "var(--accent)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </Link>
        </div>
      </div>

      {/* Estate overview */}
      <div className="px-4 mb-4">
        <div className="rounded-3xl p-4 flex items-center justify-between" style={{ background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.18)" }}>
          <div>
            <p className="text-text-secondary text-xs">Estate Health</p>
            <p className="font-bold text-2xl" style={{ color: "var(--text-1)" }}>87 <span className="text-sm font-normal text-text-secondary">/ 100</span></p>
            <p className="text-accent-green text-xs font-medium">Very Good</p>
          </div>
          <div className="flex gap-5">
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{zones.length}</p>
              <p className="text-text-secondary text-[10px]">Zones</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>26</p>
              <p className="text-text-secondary text-[10px]">Sensors</p>
            </div>
            <div className="text-center">
              <p className="text-accent-green font-bold text-lg">All OK</p>
              <p className="text-text-secondary text-[10px]">Status</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {zoneTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0"
            style={
              activeType === type
                ? { background: "#4ADE80", color: "#050A14" }
                : { background: "rgba(255,255,255,0.07)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }
            }
          >
            {type}
          </button>
        ))}
      </div>

      {/* Zone cards */}
      <div className="px-4 space-y-3">
        {filtered.map((zone) => {
          const r = 20;
          const circ = 2 * Math.PI * r;
          const zOffset = circ - (zone.health / 100) * circ;

          return (
            <Link key={zone.href} href={zone.href}>
              <div
                className="liquid-glass rounded-3xl p-4 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${zone.accentColor}12`, border: `1px solid ${zone.accentColor}25` }}
                >
                  {zone.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-base leading-tight" style={{ color: "var(--text-1)" }}>{zone.name}</h3>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${zone.statusColor}18`, color: zone.statusColor }}>
                      {zone.status}
                    </span>
                  </div>
                  <p className="text-text-secondary text-xs mb-2">{zone.subtitle}</p>
                  <div className="flex gap-3">
                    {zone.metrics.map((m) => (
                      <div key={m.label}>
                        <span className="text-text-tertiary text-[10px]">{m.label}: </span>
                        <span className="text-[10px] font-medium" style={{ color: "var(--text-1)" }}>{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-1.5">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3.5" />
                    <circle cx="24" cy="24" r={r} fill="none" stroke={zone.accentColor} strokeWidth="3.5"
                      strokeDasharray={circ} strokeDashoffset={zOffset} strokeLinecap="round" transform="rotate(-90 24 24)" />
                    <text x="24" y="28" textAnchor="middle" fill="var(--text-1)" fontSize="10" fontWeight="bold">{zone.health}</text>
                  </svg>
                  <DetailDisclosureButton
                    onPress={() => { setDetail(zone); setOpenSensor(null); }}
                    label={`Details for ${zone.name}`}
                    color={zone.accentColor}
                    size={22}
                  />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Zone detail sheet — health, metrics, possible faults & sensor advice */}
      <DetailSheet
        open={detail !== null}
        onClose={() => setDetail(null)}
        title={detail?.name ?? ""}
        icon={detail?.icon}
        accent={detail?.accentColor}
      >
        {detail && (() => {
          const faults = faultsForZone(detail.name);
          const recs = recommendSensors(detail.type, detail.metrics.map((m) => m.label));
          return (
            <div className="space-y-5">
              {/* Health + status */}
              <div className="flex items-center gap-3">
                <div className="rounded-2xl px-3 py-2 liquid-glass">
                  <p className="font-bold text-xl" style={{ color: detail.accentColor }}>{detail.health}<span className="text-xs font-normal text-text-secondary">/100</span></p>
                </div>
                <div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${detail.statusColor}18`, color: detail.statusColor }}>{detail.status}</span>
                  <p className="text-text-secondary text-xs mt-1">{detail.type} · {detail.subtitle}</p>
                </div>
              </div>

              {/* Metrics */}
              {detail.metrics.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {detail.metrics.map((m) => (
                    <div key={m.label} className="rounded-2xl p-3 liquid-glass">
                      <p className="text-text-secondary text-[10px]">{m.label}</p>
                      <p className="font-bold text-sm mt-0.5" style={{ color: "var(--text-1)" }}>{m.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Possible faults in this zone */}
              <div>
                <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-2">Possible faults</p>
                {faults.length === 0 ? (
                  <div className="rounded-2xl p-3 liquid-glass text-sm" style={{ color: "var(--text-2)" }}>✅ No issues detected in this zone.</div>
                ) : (
                  <div className="space-y-1.5">
                    {faults.map((f) => (
                      <div key={f.id} className="rounded-2xl p-3 liquid-glass flex items-center gap-2.5">
                        <span>{f.icon}</span>
                        <span className="flex-1 text-sm" style={{ color: "var(--text-1)" }}>{f.title}</span>
                        <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: `${SEVERITY_META[f.severity].color}18`, color: SEVERITY_META[f.severity].color }}>{SEVERITY_META[f.severity].label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sensor recommendations + how to connect */}
              <div>
                <p className="text-text-secondary text-[11px] uppercase tracking-wide mb-1">Recommended sensors</p>
                <p className="text-text-tertiary text-[11px] mb-2 leading-relaxed">{CONNECTION_GUIDE.intro}</p>
                <div className="space-y-1.5">
                  {recs.map((s) => {
                    const expanded = openSensor === s.id;
                    return (
                      <div key={s.id} className="rounded-2xl liquid-glass overflow-hidden">
                        <div className="p-3 flex items-center gap-2.5">
                          <span className="text-lg flex-shrink-0">{s.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{s.name}</p>
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0" style={s.intent === "replace" ? { background: "rgba(245,158,11,0.15)", color: "#F59E0B" } : { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}>{s.intent === "replace" ? "Replace" : "Add"}</span>
                            </div>
                            <p className="text-text-secondary text-[11px] truncate">{s.measures} · {s.protocol}</p>
                          </div>
                          <DetailDisclosureButton onPress={() => setOpenSensor(expanded ? null : s.id)} label={`How to connect ${s.name}`} size={22} />
                        </div>
                        {expanded && (
                          <div className="px-3 pb-3 pt-0 space-y-2">
                            <p className="text-sm" style={{ color: "var(--text-2)" }}>{s.why}</p>
                            <div className="rounded-xl p-2.5" style={{ background: "var(--glass-bg)" }}>
                              <p className="text-[10px] font-medium uppercase tracking-wide mb-1.5" style={{ color: "var(--text-3)" }}>How to connect · {s.protocol}</p>
                              <p className="text-[11px] mb-2" style={{ color: "var(--text-3)" }}>{CONNECTION_GUIDE.protocolNotes[s.protocol]}</p>
                              <ol className="space-y-1">
                                {s.connectSteps.map((step, i) => (
                                  <li key={i} className="flex items-start gap-2 text-[12px]" style={{ color: "var(--text-1)" }}>
                                    <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] flex-shrink-0 mt-0.5" style={{ background: "var(--accent)", color: "var(--bg-1)" }}>{i + 1}</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={detail.href} className="flex-1">
                  <button className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "var(--accent)", color: "var(--bg-1)" }}>Open zone</button>
                </Link>
                <Link href="/settings/integrations/home-assistant" className="flex-1">
                  <button className="w-full rounded-2xl py-3 text-sm font-medium" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>Gateway</button>
                </Link>
              </div>
            </div>
          );
        })()}
      </DetailSheet>

      <BottomNav />
    </div>
  );
}
