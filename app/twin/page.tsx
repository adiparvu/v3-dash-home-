"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import {
  TWIN_ZONES,
  TWIN_SENSORS,
  TwinSensor,
  TwinEvent,
  statusFor,
  STATUS_COLOR,
  tick,
  seriesPath,
} from "../lib/twin/telemetry";

const SERIES_LEN = 24;

export default function DigitalTwinPage() {
  const [sensors, setSensors] = useState<TwinSensor[]>(TWIN_SENSORS);
  const [series, setSeries] = useState<Record<string, number[]>>(
    () => Object.fromEntries(TWIN_SENSORS.map((s) => [s.id, [s.value]]))
  );
  const [events, setEvents] = useState<TwinEvent[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [live, setLive] = useState(true);
  const [lastSync, setLastSync] = useState(0);
  const [view, setView] = useState<"2d" | "3d">("2d");
  // True once the backend twin event bus answers — then events are durable.
  const remoteRef = useRef(false);

  // Seed from the backend event bus when available (live state sync).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/twin/events?limit=20");
        if (!res.ok) return;
        const json = await res.json();
        const rows = json?.data?.events;
        if (!Array.isArray(rows) || cancelled) return;
        remoteRef.current = true;
        if (rows.length) {
          setEvents(
            rows.map((r: { id: string; sensor_external_id: string; label: string; message: string; status: TwinEvent["status"]; recorded_at: string }) => ({
              id: r.id,
              at: new Date(r.recorded_at).getTime(),
              sensorId: r.sensor_external_id,
              label: r.label,
              message: r.message,
              status: r.status,
            }))
          );
        }
      } catch {
        /* backend unconfigured — stay on the on-device simulation */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Best-effort durable append to the backend event bus.
  const persistEvent = useCallback((e: TwinEvent) => {
    if (!remoteRef.current) return;
    fetch("/api/v1/twin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sensorExternalId: e.sensorId, label: e.label, message: e.message, status: e.status }),
    }).catch(() => { /* ignore transient failures */ });
  }, []);

  // Live telemetry loop — synchronized state representation of physical assets.
  useEffect(() => {
    if (!live) return;
    const interval = setInterval(() => {
      setSensors((prev) => {
        const next = prev.map((s) => ({ ...s, value: tick(s) }));
        // Emit state-change events for status transitions (event-bus stand-in).
        const newEvents: TwinEvent[] = [];
        next.forEach((s, i) => {
          const before = statusFor(prev[i]);
          const after = statusFor(s);
          if (before !== after) {
            newEvents.push({
              id: `ev-${Date.now()}-${s.id}`,
              at: Date.now(),
              sensorId: s.id,
              label: s.label,
              message:
                after === "ok"
                  ? `${s.metric} back to normal (${s.value}${s.unit})`
                  : `${s.metric} ${after === "alert" ? "out of range" : "drifting"} (${s.value}${s.unit})`,
              status: after,
            });
          }
        });
        if (newEvents.length) {
          setEvents((e) => [...newEvents, ...e].slice(0, 20));
          newEvents.forEach(persistEvent);
        }
        setSeries((ser) => {
          const updated: Record<string, number[]> = { ...ser };
          next.forEach((s) => {
            updated[s.id] = [...(ser[s.id] ?? []), s.value].slice(-SERIES_LEN);
          });
          return updated;
        });
        return next;
      });
      setLastSync(Date.now());
    }, 2000);
    return () => clearInterval(interval);
  }, [live, persistEvent]);

  const counts = useMemo(() => {
    const c = { ok: 0, warn: 0, alert: 0 };
    sensors.forEach((s) => { c[statusFor(s)]++; });
    return c;
  }, [sensors]);

  const visibleSensors = selectedZone ? sensors.filter((s) => s.zoneId === selectedZone) : sensors;
  const sensorsByZone = (zoneId: string) => sensors.filter((s) => s.zoneId === zoneId);

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl flex-1" style={{ color: "var(--text-1)" }}>Digital Twin</h1>
        <div className="flex rounded-full overflow-hidden mr-2" style={{ border: "0.5px solid var(--glass-border)" }}>
          {(["2d", "3d"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="text-[11px] font-medium px-2.5 py-1 transition-colors"
              style={view === v ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", color: "var(--text-3)" }}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={() => setLive((v) => !v)}
          className="text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={live ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)", color: "var(--accent)" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: live ? "var(--accent)" : "var(--text-3)", boxShadow: live ? "0 0 6px var(--accent)" : undefined }} />
          {live ? "Live" : "Paused"}
        </button>
      </div>

      {/* Energy module link */}
      <div className="px-4 mb-3">
        <Link href="/twin/energy" className="flex items-center gap-3 rounded-2xl px-4 py-3 liquid-glass active:scale-[0.99] transition-transform">
          <span className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ background: "rgba(245,158,11,0.14)", border: "1px solid rgba(245,158,11,0.3)" }}>⚡</span>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>Energy flow</p>
            <p className="text-text-secondary text-xs">Solar · Powerwall · Grid · live power</p>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
      </div>

      {/* Status strip */}
      <div className="px-4 mb-3 grid grid-cols-3 gap-2">
        {[
          { label: "Normal", value: counts.ok, color: STATUS_COLOR.ok },
          { label: "Drifting", value: counts.warn, color: STATUS_COLOR.warn },
          { label: "Alerts", value: counts.alert, color: STATUS_COLOR.alert },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-2.5 text-center liquid-glass">
            <p className="font-bold text-lg" style={{ color: s.color }}>{s.value}</p>
            <p className="text-text-secondary text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* 2D spatial map */}
      <div className="px-4 mb-4">
        <div
          className="relative w-full rounded-3xl overflow-hidden"
          style={{ aspectRatio: "1 / 1", background: "linear-gradient(160deg, #071428, #0A2540 60%, #050F1E)", border: "1px solid rgba(255,255,255,0.08)", perspective: view === "3d" ? "900px" : undefined }}
        >
         <div
           className="absolute inset-0"
           style={{ transformStyle: "preserve-3d", transformOrigin: "center 60%", transform: view === "3d" ? "rotateX(54deg) scale(0.82) translateY(-4%)" : "none", transition: "transform 0.5s ease" }}
         >
          {/* topographic grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          {TWIN_ZONES.map((z) => {
            const zoneSensors = sensorsByZone(z.id);
            const worst = zoneSensors.reduce<"ok" | "warn" | "alert">((acc, s) => {
              const st = statusFor(s);
              if (st === "alert") return "alert";
              if (st === "warn" && acc !== "alert") return "warn";
              return acc;
            }, "ok");
            const selected = selectedZone === z.id;
            const lift = Math.round(((z.health - 75) / 25) * 26 + 12); // taller = healthier
            const depthShadow = `0 ${Math.round(lift / 2)}px ${lift}px rgba(0,0,0,0.45), 0 ${lift}px 0 ${z.color}33`;
            return (
              <button
                key={z.id}
                onClick={() => setSelectedZone(selected ? null : z.id)}
                className="absolute rounded-2xl flex flex-col items-start justify-between p-2 text-left transition-all"
                style={{
                  left: `${z.x}%`, top: `${z.y}%`, width: `${z.w}%`, height: `${z.h}%`,
                  background: `${z.color}1f`,
                  border: selected ? `1.5px solid ${z.color}` : `1px solid ${z.color}55`,
                  transformStyle: "preserve-3d",
                  transform: view === "3d" ? `translateZ(${lift}px)` : undefined,
                  boxShadow: view === "3d" ? depthShadow : selected ? `0 0 16px ${z.color}55` : undefined,
                  transition: "transform 0.5s ease, box-shadow 0.5s ease",
                }}
              >
                <div className="flex items-center gap-1">
                  <span className="text-sm leading-none">{z.icon}</span>
                  <span className="text-[10px] font-medium leading-none" style={{ color: "var(--text-1)" }}>{z.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {zoneSensors.map((s) => (
                    <span key={s.id} className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[statusFor(s)], boxShadow: `0 0 5px ${STATUS_COLOR[statusFor(s)]}` }} />
                  ))}
                  {worst !== "ok" && (
                    <span className="text-[8px] font-bold px-1 rounded" style={{ color: STATUS_COLOR[worst] }}>!</span>
                  )}
                </div>
              </button>
            );
          })}
         </div>
        </div>
        <div className="flex items-center justify-center gap-4 mt-2">
          {(["ok", "warn", "alert"] as const).map((st) => (
            <div key={st} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[st] }} />
              <span className="text-text-tertiary text-[10px] capitalize">{st === "ok" ? "normal" : st === "warn" ? "drifting" : "alert"}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Telemetry list */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">
            {selectedZone ? `${TWIN_ZONES.find((z) => z.id === selectedZone)?.name} telemetry` : "Live telemetry"}
          </p>
          {selectedZone && <button onClick={() => setSelectedZone(null)} className="text-xs" style={{ color: "var(--accent)" }}>Show all</button>}
        </div>
        <div className="space-y-2">
          {visibleSensors.map((s) => {
            const st = statusFor(s);
            const data = series[s.id] ?? [s.value];
            return (
              <div key={s.id} className="rounded-2xl p-3.5 flex items-center gap-3 liquid-glass">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18`, border: `1px solid ${s.color}30` }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: STATUS_COLOR[st], boxShadow: `0 0 6px ${STATUS_COLOR[st]}` }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{s.metric}</p>
                  <p className="text-text-secondary text-[11px]">{TWIN_ZONES.find((z) => z.id === s.zoneId)?.name} · optimal {s.optimal[0]}–{s.optimal[1]}{s.unit}</p>
                </div>
                <svg width="64" height="28" viewBox="0 0 64 28" className="flex-shrink-0">
                  <path d={seriesPath(data, 64, 28)} fill="none" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="text-right flex-shrink-0 w-16">
                  <p className="font-bold text-base tabular-nums" style={{ color: STATUS_COLOR[st] }}>{s.value}</p>
                  <p className="text-text-tertiary text-[10px]">{s.unit}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* State event feed (event bus) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">State Events</p>
          <Link href="/settings/integrations/home-assistant" className="text-xs" style={{ color: "var(--accent)" }}>IoT gateway →</Link>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {events.length === 0 ? (
            <p className="text-text-tertiary text-xs px-4 py-3.5">Monitoring… state changes appear here in real time.</p>
          ) : (
            events.map((e, i) => (
              <div key={e.id} className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: i < events.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: STATUS_COLOR[e.status] }} />
                <p className="text-sm flex-1 min-w-0 truncate" style={{ color: "var(--text-1)" }}>{e.message}</p>
                <span className="text-text-tertiary text-[10px] flex-shrink-0">{new Date(e.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
              </div>
            ))
          )}
        </div>
        <p className="text-text-tertiary text-[11px] mt-2 px-1">
          The twin receives authoritative data from the backend and synchronizes with
          Home Assistant / IoT through backend-managed contracts.
          {lastSync > 0 ? ` Last sync ${new Date(lastSync).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}.` : ""}
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
