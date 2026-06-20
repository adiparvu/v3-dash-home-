"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";
import BottomNav from "../../components/layout/BottomNav";
import { useStore } from "../../lib/store";
import { seriesPath } from "../../lib/twin/telemetry";
import { smoothPath } from "../../lib/charts";
import RevolutChart from "../../components/charts/RevolutChart";
import { useEnergyLive } from "../../lib/twin/energyLive";
import { useEnergyHistory } from "../../lib/twin/energyHistory";
import {
  EnergyState, kw,
  MONTHLY_USAGE, MONTH_LABELS, ENERGY_SOURCES, TOU_PERIODS,
  SOLAR_VALUE, SOLAR_VALUE_TOTAL, OFFSET, BACKUP_EVENTS, BACKUP_SUMMARY,
  TARIFF_SERIES, TARIFF,
} from "../../lib/twin/energy";
import { useT, type MessageKey } from "../../lib/i18n";

const TABS = ["Live", "Energie", "Impact", "Powerwall"] as const;
type Tab = (typeof TABS)[number];
const TAB_KEY: Record<Tab, MessageKey> = { Live: "enr.tabLive", Energie: "enr.tabEnergy", Impact: "enr.tabImpact", Powerwall: "enr.tabPowerwall" };
// Display maps for framework-free data-lib values (keyed by stable ids).
const SRC_KEY: Record<string, MessageKey> = { battery: "enr.srcPowerwall", solar: "enr.srcSolar", grid: "enr.srcGrid" };
const TOU_KEY: Record<string, MessageKey> = { peak: "enr.touPeak", partial: "enr.touPartial", offpeak: "enr.touOffpeak" };
const BDUR_KEY: MessageKey[] = ["enr.bDur1", "enr.bDur2", "enr.bDur3"];

// Clean clone: a pristine 3D render of the estate (no text at all) is the base,
// and every label, leader line and value is drawn as a crisp overlay — so there
// is no image compositing and therefore no mask seams ("chenare"). Positions are
// in % of the 853×1844 image, measured from the reference render.
const GREEN = "#4ADE80";

// A directional energy flow for the animation; pts are source→destination (% of image).
type Flow = { id: string; kw: number; pts: [number, number][] };

export default function EnergyPage() {
  const t = useT();
  const [tab, setTab] = useState<Tab>("Live");

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--bg-1)" }}>
      <StatusBar />

      <div className="px-5 pt-1 pb-3 flex items-center gap-3">
        <Link href="/more" className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <h1 className="font-bold text-2xl flex-1" style={{ color: "var(--text-1)" }}>{t("enr.title")}</h1>
      </div>

      {/* Sub-tabs */}
      <div className="px-4 mb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tb) => (
          <button key={tb} onClick={() => setTab(tb)} className="px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all"
            style={tab === tb ? { background: "var(--accent)", color: "#050A14" } : { background: "rgba(255,255,255,0.07)", color: "var(--text-3)", border: "1px solid rgba(255,255,255,0.09)" }}>
            {t(TAB_KEY[tb])}
          </button>
        ))}
      </div>

      {tab === "Live" && <LiveTab onGoTab={setTab} />}
      {tab === "Energie" && <EnergieTab />}
      {tab === "Impact" && <ImpactTab />}
      {tab === "Powerwall" && <PowerwallTab />}

      <BottomNav />
    </div>
  );
}

// ── Live tab ─────────────────────────────────────────────────────────────────
function LiveTab({ onGoTab }: { onGoTab: (t: Tab) => void }) {
  const t = useT();
  const { s, carPct, source } = useEnergyLive();
  const [node, setNode] = useState<string | null>(null);

  // OCPP-style charging session: track start % / time while the EV is charging.
  const sess = useRef<{ startPct: number; startTime: number } | null>(null);
  useEffect(() => {
    if (s.vehicle > 0.1) {
      if (!sess.current) sess.current = { startPct: carPct, startTime: Date.now() };
    } else {
      sess.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.vehicle > 0.1]);
  const evSession = sess.current
    ? { active: true, energyKwh: Math.max(0, ((carPct - sess.current.startPct) / 100) * 93), minutes: Math.max(0, (Date.now() - sess.current.startTime) / 60000) }
    : { active: false, energyKwh: 0, minutes: 0 };

  // System font (SF Pro on iOS) to match the render's baked text.
  const ff = '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Helvetica, Arial, sans-serif';
  const GREY = "rgba(214,218,224,0.92)";

  type Align = "center" | "left";
  // Static labels: [x, y] center (%), align, font size (cqw), color, weight, tracking, node
  const LABELS: { id: string; c: [number, number]; align: Align; fs: number; color: string; w: number; ls?: number; node: React.ReactNode }[] = [
    { id: "solarL", c: [52.5, 21.9], align: "center", fs: 2.0, color: GREY, w: 500, ls: 0.12, node: t("enr.lblSolar") },
    { id: "homeL", c: [85.7, 27.5], align: "center", fs: 2.0, color: GREY, w: 500, ls: 0.12, node: t("enr.lblHome") },
    { id: "pwL", c: [53.5, 72.0], align: "center", fs: 2.0, color: GREY, w: 500, ls: 0.12, node: t("enr.lblBattery") },
    { id: "gridL", c: [83.45, 72.0], align: "center", fs: 2.0, color: GREY, w: 500, ls: 0.12, node: t("enr.lblGrid") },
    { id: "porTitle", c: [7.3, 43.7], align: "left", fs: 2.5, color: "rgba(236,238,241,0.96)", w: 600, node: "PORSCHE" },
    { id: "porTitle2", c: [7.3, 45.2], align: "left", fs: 2.5, color: "rgba(236,238,241,0.96)", w: 600, node: "911 GT3 RS" },
    { id: "chL", c: [7.3, 47.3], align: "left", fs: 2.1, color: GREY, w: 500, node: t("enr.charging") },
    { id: "batL", c: [7.3, 50.9], align: "left", fs: 2.1, color: GREY, w: 500, node: t("enr.carBattery") },
  ];
  // Live values: [x, y] center (%), align, font size (cqw), node
  const VALUES: { id: string; c: [number, number]; align: Align; fs: number; node: React.ReactNode }[] = [
    { id: "solar", c: [52.5, 23.7], align: "center", fs: 3.5, node: <>{kw(s.solar)}</> },
    { id: "home", c: [85.7, 29.3], align: "center", fs: 3.5, node: <>{kw(s.home)}</> },
    { id: "battery", c: [53.5, 73.8], align: "center", fs: 3.5, node: <>{kw(s.battery)} <span style={{ color: GREEN }}>▲</span> {Math.round(s.batteryPct)}%</> },
    { id: "grid", c: [83.45, 73.8], align: "center", fs: 3.5, node: <>{Math.round(Math.abs(s.grid))} kW</> },
    { id: "vch", c: [7.3, 48.7], align: "left", fs: 3.5, node: <span style={{ color: GREEN }}>{kw(s.vehicle)}</span> },
    { id: "vb", c: [7.3, 52.3], align: "left", fs: 3.1, node: <>{Math.round(carPct)}%</> },
  ];
  // Directional live flows (source → destination order drives particle travel).
  const charging = s.battery > 0.05;       // + charging, − discharging
  const importing = s.grid > 0.05;         // + importing, − exporting
  const flows: Flow[] = [
    { id: "solar", kw: s.solar, pts: [[52.5, 42.5], [52.5, 25.2]] },                                  // panel → reading (supplies)
    { id: "house", kw: s.home, pts: [[85.7, 30.7], [85.7, 55.9]] },                                   // reading → window (consumes)
    { id: "battery", kw: Math.abs(s.battery), pts: charging ? [[53.5, 70.6], [53.5, 66.2]] : [[53.5, 66.2], [53.5, 70.6]] },
    { id: "grid", kw: Math.abs(s.grid), pts: importing ? [[83.45, 67.5], [83.45, 70.6]] : [[83.45, 70.6], [83.45, 67.5]] },
    { id: "ev", kw: s.vehicle, pts: [[13.5, 52.3], [21.5, 52.3], [21.5, 55.2]] },                     // reading → charger (consumes)
  ];
  // Tap targets over each node's readout.
  const ZONES: { id: string; r: [number, number, number, number] }[] = [
    { id: "solar", r: [37, 18, 31, 9] },
    { id: "house", r: [75, 23, 24, 11] },
    { id: "battery", r: [39, 69, 30, 8] },
    { id: "grid", r: [75, 69, 18, 8] },
    { id: "ev", r: [0, 42, 27, 15] },
  ];

  const drawText = (t: { c: [number, number]; align: Align; fs: number; color?: string; w?: number; ls?: number; node: React.ReactNode }, key: string) => (
    <div key={key} style={{ position: "absolute", left: `${t.c[0]}%`, top: `${t.c[1]}%`, transform: `translate(${t.align === "left" ? "0" : "-50%"}, -50%)`, fontFamily: ff, fontWeight: t.w ?? 600, fontSize: `${t.fs}cqw`, letterSpacing: t.ls ? `${t.ls}em` : undefined, color: t.color ?? "#fff", whiteSpace: "nowrap", lineHeight: 1, zIndex: 2 }}>
      {t.node}
    </div>
  );

  return (
    <div>
      {/* Pristine render as base; all text + lines + live values drawn on top — no
          image compositing, so there are no mask seams. */}
      <div className="px-4 mb-3">
        <div className="relative w-full rounded-3xl overflow-hidden" style={{ aspectRatio: "853 / 1844", border: "1px solid rgba(255,255,255,0.08)", background: "#0a0e16", containerType: "size" }}>
          {/* base: clean 3D estate render (no text) */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/estate-house.png" alt="PRVIO Estate — energy" className="absolute inset-0 w-full h-full" style={{ objectFit: "cover" }} draggable={false} />

          {/* live-feed source badge */}
          <div style={{ position: "absolute", top: "2.5%", right: "3.5%", zIndex: 4, display: "flex", alignItems: "center", gap: "5px", padding: "4px 9px", borderRadius: 999, fontSize: "2.7cqw", fontWeight: 600, fontFamily: ff, color: source === "live" ? "#fff" : "rgba(214,218,224,0.85)", background: "rgba(10,14,22,0.55)", border: "1px solid rgba(255,255,255,0.12)", backdropFilter: "blur(6px)" }}>
            <span style={{ width: "1.6cqw", height: "1.6cqw", borderRadius: 999, background: source === "live" ? GREEN : "#9CA3AF", boxShadow: source === "live" ? `0 0 6px ${GREEN}` : "none" }} />
            {source === "live" ? t("enr.live") : t("enr.simulated")}
          </div>

          {/* animated energy flow: connection lines + light particles */}
          <FlowCanvas flows={flows} />

          {/* labels + live values */}
          {LABELS.map((t) => drawText(t, t.id))}
          {VALUES.map((t) => drawText(t, t.id))}

          {/* tap targets → node detail sheet */}
          {ZONES.map((z) => (
            <button
              key={z.id}
              aria-label={z.id}
              onClick={() => setNode(z.id)}
              style={{ position: "absolute", left: `${z.r[0]}%`, top: `${z.r[1]}%`, width: `${z.r[2]}%`, height: `${z.r[3]}%`, zIndex: 3, background: "transparent", border: "none", padding: 0, cursor: "pointer" }}
            />
          ))}
        </div>
      </div>

      {node && <NodeSheet node={node} s={s} carPct={carPct} evSession={evSession} onClose={() => setNode(null)} />}

      {/* Pairwise flow routing — decomposed source → destination streams */}
      <div className="px-4 mb-3">
        <div className="rounded-3xl p-4 liquid-glass">
          <p className="text-sm font-semibold mb-2" style={{ color: "var(--text-1)" }}>{t("enr.flowRouting")}</p>
          {(() => {
            const routes = decomposeRoutes(s);
            return routes.length ? routes.map((r) => <FlowRow key={r.id} route={r} />) : (
              <p className="text-xs py-2" style={{ color: "var(--text-3)" }}>{t("enr.balanced")}</p>
            );
          })()}
        </div>
      </div>

      {/* shortcuts */}
      <div className="px-4 space-y-2">
        {[
          { label: t("enr.scEnergy"), desc: t("enr.scEnergyDesc"), icon: "📈", go: () => onGoTab("Energie") },
          { label: t("enr.scImpact"), desc: t("enr.scImpactDesc"), icon: "🌿", go: () => onGoTab("Impact") },
          { label: t("enr.scPowerwall"), desc: t("enr.scPowerwallDesc"), icon: "🔋", go: () => onGoTab("Powerwall") },
        ].map((sc, i, arr) => (
          <button key={sc.label} onClick={sc.go} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left liquid-glass" style={{ marginBottom: i === arr.length - 1 ? 0 : undefined }}>
            <span className="text-xl w-7 text-center flex-shrink-0">{sc.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{sc.label}</p>
              <p className="text-text-secondary text-xs">{sc.desc}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.45 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Energy-flow animation (canvas: lines + light particles) ───────────────────
function FlowCanvas({ flows }: { flows: Flow[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const flowsRef = useRef(flows);
  flowsRef.current = flows;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    const phases = new Map<string, number>();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      for (const f of flowsRef.current) {
        const pts = f.pts.map(([x, y]) => [(x / 100) * W, (y / 100) * H] as [number, number]);
        const segLen: number[] = [];
        let total = 0;
        for (let i = 1; i < pts.length; i++) {
          const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
          segLen.push(d);
          total += d;
        }
        const active = f.kw > 0.15;

        // connection line — dim when idle, brighter when flowing
        ctx.lineCap = "round";
        ctx.lineWidth = 1.1 * dpr;
        ctx.strokeStyle = active ? "rgba(255,255,255,0.30)" : "rgba(255,255,255,0.10)";
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
        if (!active || total === 0) continue;

        // particles: count, speed and brightness all scale with power
        const count = Math.max(2, Math.min(9, Math.round(f.kw * 1.3)));
        const speed = Math.min(0.6, 0.12 + f.kw * 0.05); // path-cycles / sec
        const bright = Math.min(1, 0.45 + f.kw * 0.09);
        let ph = (phases.get(f.id) ?? 0) + dt * speed;
        ph -= Math.floor(ph);
        phases.set(f.id, ph);

        for (let k = 0; k < count; k++) {
          const u = (ph + k / count) % 1;
          let dist = u * total;
          let px = pts[0][0], py = pts[0][1];
          for (let i = 0; i < segLen.length; i++) {
            if (dist <= segLen[i]) {
              const t = segLen[i] === 0 ? 0 : dist / segLen[i];
              px = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t;
              py = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t;
              break;
            }
            dist -= segLen[i];
            px = pts[i + 1][0];
            py = pts[i + 1][1];
          }
          const rad = 7 * dpr;
          const g = ctx.createRadialGradient(px, py, 0, px, py, rad);
          g.addColorStop(0, `rgba(200,255,215,${bright})`);
          g.addColorStop(0.45, `rgba(74,222,128,${bright * 0.45})`);
          g.addColorStop(1, "rgba(74,222,128,0)");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, py, rad, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(255,255,255,${bright})`;
          ctx.beginPath();
          ctx.arc(px, py, 1.6 * dpr, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1, pointerEvents: "none" }} />;
}

// ── Pairwise flow routing (decomposed source → destination streams) ───────────
const NODE_META: Record<string, { icon: string; labelKey: MessageKey }> = {
  solar: { icon: "☀️", labelKey: "enr.nSolar" },
  battery: { icon: "🔋", labelKey: "enr.nPowerwall" },
  house: { icon: "🏠", labelKey: "enr.nHouse" },
  ev: { icon: "🏎️", labelKey: "enr.nPorsche" },
  grid: { icon: "🔌", labelKey: "enr.nGrid" },
};

type Route = { id: string; from: string; to: string; kw: number };

/** Decompose the live power balance into pairwise flows (solar→house, etc.). */
function decomposeRoutes(s: EnergyState): Route[] {
  let solarLeft = s.solar;
  let houseRem = s.home;
  let evRem = s.vehicle;
  const battCharge = Math.max(0, s.battery);
  const battDischarge = Math.max(0, -s.battery);
  const gridImport = Math.max(0, s.grid);

  const solarToHouse = Math.min(solarLeft, houseRem); solarLeft -= solarToHouse; houseRem -= solarToHouse;
  const solarToEV = Math.min(solarLeft, evRem); solarLeft -= solarToEV; evRem -= solarToEV;
  let battChargeRem = battCharge;
  const solarToBattery = Math.min(solarLeft, battChargeRem); solarLeft -= solarToBattery; battChargeRem -= solarToBattery;
  const solarToGrid = Math.max(0, solarLeft);

  let battLeft = battDischarge;
  const batteryToHouse = Math.min(battLeft, houseRem); battLeft -= batteryToHouse; houseRem -= batteryToHouse;
  const batteryToEV = Math.min(battLeft, evRem); battLeft -= batteryToEV; evRem -= batteryToEV;

  let gridLeft = gridImport;
  const gridToHouse = Math.min(gridLeft, houseRem); gridLeft -= gridToHouse; houseRem -= gridToHouse;
  const gridToEV = Math.min(gridLeft, evRem); gridLeft -= gridToEV; evRem -= gridToEV;
  const gridToBattery = Math.min(gridLeft, battChargeRem); gridLeft -= gridToBattery;

  return [
    { id: "s-h", from: "solar", to: "house", kw: solarToHouse },
    { id: "s-b", from: "solar", to: "battery", kw: solarToBattery },
    { id: "s-e", from: "solar", to: "ev", kw: solarToEV },
    { id: "s-g", from: "solar", to: "grid", kw: solarToGrid },
    { id: "b-h", from: "battery", to: "house", kw: batteryToHouse },
    { id: "b-e", from: "battery", to: "ev", kw: batteryToEV },
    { id: "g-h", from: "grid", to: "house", kw: gridToHouse },
    { id: "g-e", from: "grid", to: "ev", kw: gridToEV },
    { id: "g-b", from: "grid", to: "battery", kw: gridToBattery },
  ].filter((r) => r.kw > 0.05);
}

function FlowRow({ route }: { route: Route }) {
  const t = useT();
  const from = NODE_META[route.from];
  const to = NODE_META[route.to];
  const dur = Math.max(0.5, 2.4 - route.kw * 0.32); // faster with more power
  const op = Math.min(1, 0.5 + route.kw * 0.12);     // brighter with more power
  return (
    <div className="flex items-center gap-2.5 py-1.5">
      <span className="text-base w-5 text-center" title={t(from.labelKey)}>{from.icon}</span>
      <div className="flex-1 h-4 rounded-full overflow-hidden relative" style={{ background: "rgba(255,255,255,0.05)" }}>
        <div className="flow-stream absolute inset-0" style={{ animationDuration: `${dur}s`, opacity: op }} />
      </div>
      <span className="text-base w-5 text-center" title={t(to.labelKey)}>{to.icon}</span>
      <span className="text-xs font-semibold w-14 text-right" style={{ color: "var(--text-1)" }}>{route.kw.toFixed(1)} kW</span>
    </div>
  );
}

// ── Animated utility exchange (Grid sheet) ────────────────────────────────────
function GridExchange({ grid }: { grid: number }) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useRef({ kw: Math.abs(grid), dir: grid > 0.05 ? 1 : grid < -0.05 ? -1 : 0 });
  state.current = { kw: Math.abs(grid), dir: grid > 0.05 ? 1 : grid < -0.05 ? -1 : 0 };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let raf = 0;
    let last = performance.now();
    let phase = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const W = canvas.width, H = canvas.height, y = H / 2;
      const x0 = 0.12 * W, x1 = 0.88 * W, len = x1 - x0;
      const { kw, dir } = state.current;
      const active = kw > 0.05 && dir !== 0;
      const color = dir >= 0 ? "245,158,11" : "74,222,128"; // import amber, export green
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = "round";
      ctx.lineWidth = 1.2 * dpr;
      ctx.strokeStyle = active ? `rgba(${color},0.45)` : "rgba(255,255,255,0.12)";
      ctx.beginPath();
      ctx.moveTo(x0, y);
      ctx.lineTo(x1, y);
      ctx.stroke();
      if (active) {
        const count = Math.max(2, Math.min(7, Math.round(kw * 1.5)));
        const speed = Math.min(0.7, 0.18 + kw * 0.06);
        const bright = Math.min(1, 0.5 + kw * 0.1);
        phase = (phase + dt * speed) % 1;
        for (let k = 0; k < count; k++) {
          let u = (phase + k / count) % 1;
          if (dir < 0) u = 1 - u;
          const px = x0 + u * len;
          const rad = 6 * dpr;
          const g = ctx.createRadialGradient(px, y, 0, px, y, rad);
          g.addColorStop(0, `rgba(255,255,255,${bright})`);
          g.addColorStop(0.4, `rgba(${color},${bright * 0.6})`);
          g.addColorStop(1, `rgba(${color},0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(px, y, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  const kw = Math.abs(grid);
  const label = grid > 0.05 ? `${t("enr.import")} · ${kw.toFixed(1)} kW` : grid < -0.05 ? `${t("enr.export")} · ${kw.toFixed(1)} kW` : t("enr.balancedShort");
  const labelColor = grid > 0.05 ? "#F59E0B" : grid < -0.05 ? GREEN : "var(--text-3)";
  return (
    <div className="rounded-2xl p-3 mb-4" style={{ background: "rgba(255,255,255,0.05)" }}>
      <div className="flex items-center justify-between text-sm" style={{ color: "var(--text-1)" }}>
        <span>🏭 {t("enr.gridNode")}</span>
        <span>🏠 {t("enr.homeNode")}</span>
      </div>
      <canvas ref={canvasRef} style={{ width: "100%", height: 38, display: "block" }} />
      <p className="text-center text-xs font-semibold" style={{ color: labelColor }}>{label}</p>
    </div>
  );
}

// ── Node detail sheet (tap a node on the Live diagram) ────────────────────────
function SheetRow({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span className="text-sm" style={{ color: "var(--text-3)" }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: accent ? GREEN : "var(--text-1)" }}>{value}</span>
    </div>
  );
}

function FillBar({ pct, color = GREEN }: { pct: number; color?: string }) {
  return (
    <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: "100%", background: `linear-gradient(90deg, ${color}, #22D3EE)`, borderRadius: 999, transition: "width 1.8s ease-in-out" }} />
    </div>
  );
}

function NodeSheet({ node, s, carPct, evSession, onClose }: { node: string; s: EnergyState; carPct: number; evSession: { active: boolean; energyKwh: number; minutes: number }; onClose: () => void }) {
  const t = useT();
  const [houseView, setHouseView] = useState<"consumers" | "rooms">("consumers");
  const { energy, setEnergy } = useStore();
  const setpoint = energy.hvacSetpoint;
  const climateMode = energy.hvacMode;
  const hist = useEnergyHistory();
  const meta: Record<string, { t: string; icon: string }> = {
    solar: { t: t("enr.nSolar"), icon: "☀️" },
    battery: { t: t("enr.nPowerwall"), icon: "🔋" },
    ev: { t: t("enr.evPorsche"), icon: "🏎️" },
    house: { t: t("enr.nHouse"), icon: "🏠" },
    grid: { t: t("enr.nGrid"), icon: "🔌" },
  };
  const m = meta[node];
  const fmtH = (h: number) => (!isFinite(h) || h <= 0 ? "—" : `${Math.floor(h)}h ${Math.round((h % 1) * 60)}m`);

  let body: React.ReactNode = null;
  if (node === "solar") {
    const peak = hist.solar.length ? Math.max(...hist.solar) : s.solar;
    const kwh = hist.solar.length ? (hist.solar.reduce((a, b) => a + b, 0) / hist.solar.length) * 24 : 0;
    const forecastKwh = (hist.forecast.reduce((a, b) => a + b, 0) / hist.forecast.length) * 24;
    const hmax = Math.max(1, ...hist.solar, ...hist.forecast);
    body = (
      <>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>{kw(s.solar)}</p>
            <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>{t("enr.solarProdNow")}</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold mt-1" style={{ color: hist.source === "synced" ? GREEN : "var(--text-3)" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: hist.source === "synced" ? GREEN : "#9CA3AF" }} />
            {hist.source === "synced" ? t("enr.synced") : t("enr.demo")}
          </span>
        </div>
        <div className="flex items-center justify-between mb-1">
          <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t("enr.solarTodayHourly")}</p>
          <span className="flex items-center gap-3 text-[10px]">
            <span style={{ color: "#F59E0B" }}>● {t("enr.realized")}</span>
            <span style={{ color: "#9CA3AF" }}>┄ {t("enr.forecast")}</span>
          </span>
        </div>
        <svg viewBox="0 0 300 70" className="w-full mb-3" style={{ height: 70 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sheet-solar-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${scaledPath(hist.solar, 300, 70, 4, hmax)} L296,66 L4,66 Z`} fill="url(#sheet-solar-fill)" stroke="none" />
          <path d={scaledPath(hist.forecast, 300, 70, 4, hmax)} fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d={scaledPath(hist.solar, 300, 70, 4, hmax)} fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(245,158,11,0.4))" }} />
        </svg>
        <SheetRow label={t("enr.genToday")} value={`${kwh.toFixed(1)} kWh`} accent />
        <SheetRow label={t("enr.forecastToday")} value={`${forecastKwh.toFixed(1)} kWh`} />
        <SheetRow label={t("enr.peakToday")} value={`${peak.toFixed(1)} kW`} />
        <SheetRow label={t("enr.installedCap")} value="7.2 kWp" />
        <SheetRow label={t("enr.panels")} value={t("enr.panelsVal")} />
        <SheetRow label={t("enr.inverterStatus")} value={t("enr.optimal")} accent />
      </>
    );
  } else if (node === "battery") {
    const cap = 13.5;
    const runtime = (cap * s.batteryPct / 100) / Math.max(0.3, s.home);
    body = (
      <>
        <div className="flex items-end justify-between mb-2">
          <p className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>{Math.round(s.batteryPct)}%</p>
          <p className="text-sm font-semibold" style={{ color: GREEN }}>{s.battery >= 0 ? t("enr.charging2") : t("enr.discharging")} · {kw(s.battery)}</p>
        </div>
        <div className="mb-4"><FillBar pct={s.batteryPct} /></div>
        <SheetRow label={t("enr.power")} value={`${s.battery >= 0 ? "+" : "−"}${kw(s.battery)}`} accent />
        <SheetRow label={t("enr.runtimeLeft")} value={fmtH(runtime)} />
        <SheetRow label={t("enr.capacity")} value={`${(cap * s.batteryPct / 100).toFixed(1)} / ${cap} kWh`} />
        <SheetRow label={t("enr.temperature")} value="24°C" />
        <SheetRow label={t("enr.healthState")} value="97%" accent />
      </>
    );
  } else if (node === "ev") {
    const cap = 93;
    const eta = s.vehicle > 0.1 ? ((100 - carPct) / 100 * cap) / s.vehicle : Infinity;
    body = (
      <>
        <div className="flex items-end justify-between mb-2">
          <p className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>{Math.round(carPct)}%</p>
          <p className="text-sm font-semibold" style={{ color: s.vehicle > 0.1 ? GREEN : "var(--text-3)" }}>{s.vehicle > 0.1 ? `${t("enr.charging2")} · ${kw(s.vehicle)}` : t("enr.idle")}</p>
        </div>
        <div className="mb-3 relative">
          <FillBar pct={carPct} />
          {s.vehicle > 0.1 && <div className="charge-pulse" />}
        </div>
        {s.vehicle > 0.1 && (
          <div className="rounded-2xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <div className="flex items-center justify-between text-sm mb-1" style={{ color: "var(--text-1)" }}>
              <span>🔌 {t("enr.evCharger")}</span>
              <span>🏎️ {t("enr.evCar")}</span>
            </div>
            <svg viewBox="0 0 300 46" className="w-full" style={{ height: 46 }} preserveAspectRatio="none">
              <path d="M12,30 C 70,30 70,14 120,14 C 180,14 150,30 210,30 C 255,30 250,18 288,18" fill="none" stroke="rgba(74,222,128,0.22)" strokeWidth="3" strokeLinecap="round" />
              <path d="M12,30 C 70,30 70,14 120,14 C 180,14 150,30 210,30 C 255,30 250,18 288,18" className="energy-flow" fill="none" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="text-center text-[11px] font-semibold" style={{ color: GREEN }}>{t("enr.energyTransfer")} {kw(s.vehicle)}</p>
          </div>
        )}
        {s.vehicle > 0.1 && (() => {
          // Projected charge curve from now → full (tapers near the top, like a real EV).
          const n = 14;
          const curve = Array.from({ length: n }, (_, i) => {
            const t = i / (n - 1);
            return carPct + (100 - carPct) * (1 - Math.pow(1 - t, 2));
          });
          return (
            <>
              <p className="text-[11px] mb-1" style={{ color: "var(--text-3)" }}>{t("enr.chargeCurve")}</p>
              <svg viewBox="0 0 300 60" className="w-full mb-3" style={{ height: 60 }} preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ev-curve-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={GREEN} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${scaledPath(curve, 300, 60, 4, 100)} L296,56 L4,56 Z`} fill="url(#ev-curve-fill)" stroke="none" />
                <path d={scaledPath(curve, 300, 60, 4, 100)} fill="none" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 4px ${GREEN}66)` }} />
              </svg>
            </>
          );
        })()}
        <SheetRow label={t("enr.vehicle")} value="Porsche 911 GT3 RS" />
        <SheetRow label={t("enr.chargeSpeed")} value={s.vehicle > 0.1 ? kw(s.vehicle) : "—"} accent={s.vehicle > 0.1} />
        <SheetRow label={t("enr.timeToFull")} value={fmtH(eta)} />
        <SheetRow label={t("enr.rangeAdded")} value={`+${Math.round(carPct * 4.6)} km`} />
        <SheetRow label={t("enr.batteryCap")} value={`${cap} kWh`} />
        {/* OCPP-style charging session */}
        <div className="mt-3 rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>{t("enr.chargeSession")}</p>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={evSession.active
              ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80" }
              : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF" }}>
              {evSession.active ? t("enr.charging2") : t("enr.idle")}
            </span>
          </div>
          <SheetRow label={t("enr.connector")} value="Type 2 · CCS" />
          <SheetRow label={t("enr.energyDelivered")} value={`${evSession.energyKwh.toFixed(1)} kWh`} accent={evSession.active} />
          <SheetRow label={t("enr.sessionDuration")} value={evSession.active ? `${Math.floor(evSession.minutes / 60)}h ${Math.round(evSession.minutes % 60)}m` : "—"} />
          <SheetRow label={t("enr.sessionCost")} value={`${(evSession.energyKwh * TARIFF.buy).toFixed(2)} ${TARIFF.currency}`} />
        </div>
      </>
    );
  } else if (node === "house") {
    const load = s.home;
    const consumers = [
      { n: t("enr.cHvac"), f: 0.32, icon: "❄️" },
      { n: t("enr.cHeatPump"), f: 0.24, icon: "♨️" },
      { n: t("enr.cPool"), f: 0.14, icon: "🏊" },
      { n: t("enr.cLighting"), f: 0.12, icon: "💡" },
      { n: t("enr.cAppliances"), f: 0.18, icon: "🔌" },
    ];
    const rooms = [
      { n: t("enr.rLiving"), f: 0.22, icon: "🛋️" },
      { n: t("enr.rKitchen"), f: 0.20, icon: "🍳" },
      { n: t("enr.rBedroom"), f: 0.14, icon: "🛏️" },
      { n: t("enr.rOffice"), f: 0.12, icon: "💻" },
      { n: t("enr.rGarage"), f: 0.10, icon: "🚗" },
      { n: t("enr.rBath"), f: 0.10, icon: "🛁" },
      { n: t("enr.rHall"), f: 0.12, icon: "🌳" },
    ];
    const rows = houseView === "consumers" ? consumers : rooms;
    const hmax = Math.max(1, ...hist.home);
    body = (
      <>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>{kw(load)}</p>
            <p className="text-xs mb-3" style={{ color: "var(--text-3)" }}>{t("enr.homeUsageNow")}</p>
          </div>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold mt-1" style={{ color: hist.source === "synced" ? GREEN : "var(--text-3)" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: hist.source === "synced" ? GREEN : "#9CA3AF" }} />
            {hist.source === "synced" ? t("enr.synced") : t("enr.demo")}
          </span>
        </div>
        <p className="text-[11px] mb-1" style={{ color: "var(--text-3)" }}>{t("enr.homeTodayHourly")}</p>
        <svg viewBox="0 0 300 60" className="w-full mb-3" style={{ height: 60 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="sheet-home-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${scaledPath(hist.home, 300, 60, 4, hmax)} L296,56 L4,56 Z`} fill="url(#sheet-home-fill)" stroke="none" />
          <path d={scaledPath(hist.home, 300, 60, 4, hmax)} fill="none" stroke="#22D3EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(34,211,238,0.4))" }} />
        </svg>
        {/* Climate control — HVAC + heat pump */}
        <div className="rounded-2xl p-3 mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>♨️ {t("enr.climate")}</span>
            <span className="text-[10px]" style={{ color: climateMode === "Off" ? "var(--text-3)" : "#4ADE80" }}>{climateMode === "Off" ? t("enr.off") : t("enr.active")}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <button onClick={() => setEnergy({ hvacSetpoint: Math.max(15, Math.round((setpoint - 0.5) * 10) / 10) })} className="w-9 h-9 rounded-full text-lg font-bold" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-1)" }}>−</button>
            <span className="text-3xl font-bold" style={{ color: "var(--text-1)" }}>{setpoint}°C</span>
            <button onClick={() => setEnergy({ hvacSetpoint: Math.min(28, Math.round((setpoint + 0.5) * 10) / 10) })} className="w-9 h-9 rounded-full text-lg font-bold" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-1)" }}>+</button>
          </div>
          <div className="flex gap-1 mb-2">
            {["Auto", "Heat", "Cool", "Off"].map((m) => (
              <button key={m} onClick={() => setEnergy({ hvacMode: m })} className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all"
                style={climateMode === m ? { background: GREEN, color: "#05210F" } : { background: "rgba(255,255,255,0.06)", color: "var(--text-3)" }}>{m}</button>
            ))}
          </div>
          <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t("enr.schedule")}</p>
        </div>

        <div className="flex gap-1 p-1 rounded-2xl mb-3" style={{ background: "rgba(255,255,255,0.05)" }}>
          {([["consumers", t("enr.consumers")], ["rooms", t("enr.rooms")]] as const).map(([k, lbl]) => (
            <button key={k} onClick={() => setHouseView(k)} className="flex-1 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={houseView === k ? { background: GREEN, color: "#05210F" } : { color: "var(--text-3)" }}>
              {lbl}
            </button>
          ))}
        </div>
        {rows.map((c) => (
          <div key={c.n} className="py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm" style={{ color: "var(--text-1)" }}>{c.icon} {c.n}</span>
              <span className="text-sm font-semibold flex items-center gap-1.5" style={{ color: "var(--text-1)" }}>
                {Math.round(load * c.f * 1000)} W
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.18)", color: "#A78BFA" }}>{t("enr.estBadge")}</span>
              </span>
            </div>
            <FillBar pct={c.f * 100} color="#22D3EE" />
          </div>
        ))}
        <p className="text-[11px] mt-3" style={{ color: "var(--text-3)" }}>
          {houseView === "rooms" ? t("enr.roomsNote") : t("enr.consumersNote")}
        </p>
      </>
    );
  } else if (node === "grid") {
    const imp = Math.max(0, s.grid);
    const exp = Math.max(0, -s.grid);
    body = (
      <>
        <GridExchange grid={s.grid} />
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t("enr.import")}</p>
            <p className="text-2xl font-bold" style={{ color: imp > 0 ? "#F59E0B" : "var(--text-1)" }}>{imp.toFixed(1)} kW</p>
          </div>
          <div className="rounded-2xl p-3" style={{ background: "rgba(255,255,255,0.05)" }}>
            <p className="text-[11px]" style={{ color: "var(--text-3)" }}>{t("enr.export")}</p>
            <p className="text-2xl font-bold" style={{ color: exp > 0 ? GREEN : "var(--text-1)" }}>{exp.toFixed(1)} kW</p>
          </div>
        </div>
        <SheetRow label={t("enr.priceNow")} value={`${TARIFF.buy.toFixed(2)} ${TARIFF.currency}/kWh`} />
        <SheetRow label={t("enr.priceExport")} value={`${TARIFF.sell.toFixed(2)} ${TARIFF.currency}/kWh`} />
        <SheetRow label={t("enr.provider")} value={TARIFF.provider} accent />
        <SheetRow label={t("enr.peakUsageToday")} value="4.2 kW · 18:30" />
        <SheetRow label={t("enr.gridStatus")} value={imp > 0 ? t("enr.importActive") : exp > 0 ? t("enr.exportActive") : t("enr.balancedShort")} accent />
      </>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end" onClick={onClose} style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full rounded-t-3xl p-5 pb-28" style={{ background: "#0d1320", border: "1px solid rgba(255,255,255,0.10)", maxHeight: "82vh", overflowY: "auto" }}>
        <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "rgba(255,255,255,0.22)" }} />
        <div className="flex items-center gap-2.5 mb-4">
          <span className="text-2xl">{m.icon}</span>
          <h2 className="text-lg font-bold flex-1" style={{ color: "var(--text-1)" }}>{m.t}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)", color: "var(--text-1)" }}>✕</button>
        </div>
        {body}
      </div>
    </div>
  );
}

// ── Energie tab ──────────────────────────────────────────────────────────────
// Cheapest contiguous window (start hour, length) over an hourly price series.
function cheapestWindow(series: number[], len = 4): { start: number; end: number; avg: number } {
  let best = { start: 0, sum: Infinity };
  for (let i = 0; i + len <= series.length; i++) {
    const sum = series.slice(i, i + len).reduce((a, b) => a + b, 0);
    if (sum < best.sum) best = { start: i, sum };
  }
  return { start: best.start, end: best.start + len, avg: best.sum / len };
}

// Shared-scale series path (0..maxVal) for overlaying two series on one chart.
function scaledPath(values: number[], w: number, h: number, pad: number, maxVal: number): string {
  if (values.length < 2) return "";
  // Revolut-style smooth curve, scaled 0..maxVal (see app/lib/charts.ts).
  return smoothPath(values, w, h, pad, maxVal);
}

function EnergieTab() {
  const t = useT();
  const total = MONTHLY_USAGE.reduce((s, v) => s + v, 0);
  const max = Math.max(...MONTHLY_USAGE);
  const hist = useEnergyHistory();
  const histMax = Math.max(1, ...hist.solar, ...hist.home);
  const solarToday = (hist.solar.reduce((a, b) => a + b, 0) / hist.solar.length).toFixed(1);
  const homeToday = (hist.home.reduce((a, b) => a + b, 0) / hist.home.length).toFixed(1);

  const exportCsv = () => {
    const rows = [["hour", "solar_kw", "home_kw", "forecast_kw"]];
    for (let h = 0; h < hist.solar.length; h++) {
      rows.push([String(h), String(hist.solar[h] ?? ""), String(hist.home[h] ?? ""), String(hist.forecast[h] ?? "")]);
    }
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prvio-energy-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <div className="px-4 space-y-4">
      {/* Intraday solar vs consumption — live history with demo fallback */}
      <div className="rounded-3xl p-4 liquid-glass">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.todaySolarVsHome")}</p>
          <div className="flex items-center gap-2">
            <button onClick={exportCsv} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(34,211,238,0.12)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}>{t("enr.exportCsv")}</button>
            <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: hist.source === "synced" ? GREEN : "var(--text-3)" }}>
              <span style={{ width: 7, height: 7, borderRadius: 999, background: hist.source === "synced" ? GREEN : "#9CA3AF" }} />
              {hist.source === "synced" ? t("enr.synced") : t("enr.demo")}
            </span>
          </div>
        </div>
        <div className="flex gap-6 mb-2">
          <div><p className="text-text-tertiary text-[11px]">{t("enr.solarAvg")}</p><p className="text-base font-bold" style={{ color: "#4ADE80" }}>{solarToday} kW</p></div>
          <div><p className="text-text-tertiary text-[11px]">{t("enr.homeAvg")}</p><p className="text-base font-bold" style={{ color: "#22D3EE" }}>{homeToday} kW</p></div>
        </div>
        <RevolutChart
          height={92}
          max={histMax}
          series={[
            { values: hist.solar, color: "#4ADE80", label: t("enr.srcSolar") },
            { values: hist.home, color: "#22D3EE", label: t("enr.consumption") },
          ]}
          formatValue={(v) => `${v.toFixed(1)} kW`}
          formatX={(i) => `${String(Math.round((i / Math.max(1, hist.solar.length - 1)) * 24)).padStart(2, "0")}:00`}
        />
        <div className="flex justify-between text-text-tertiary text-[10px] mt-1"><span>00:00</span><span>12:00</span><span>24:00</span></div>
      </div>

      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-text-secondary text-[11px] mb-0.5">{t("enr.totalUsedYear")}</p>
        <p className="font-bold text-3xl" style={{ color: "var(--text-1)" }}>{total.toFixed(1)} <span className="text-lg" style={{ color: "var(--text-3)" }}>MWh</span></p>
        <div className="flex items-end justify-between gap-1 mt-4 h-32">
          {MONTHLY_USAGE.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-md" style={{ height: `${(v / max) * 100}%`, background: "linear-gradient(180deg, #4ADE80, #22D3EE)" }} />
              <span className="text-text-tertiary text-[9px]">{MONTH_LABELS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("enr.energyFlowUsedFrom")}</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {ENERGY_SOURCES.map((s, i) => (
            <div key={s.id} className="px-4 py-3" style={{ borderBottom: i < ENERGY_SOURCES.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--text-1)" }}><span>{s.icon}</span>{SRC_KEY[s.id] ? t(SRC_KEY[s.id]) : s.label}</span>
                <span className="text-sm" style={{ color: "var(--text-2)" }}>{s.pct}% · {s.mwh} MWh</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-full rounded-full" style={{ width: `${s.pct}%`, background: s.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Impact tab ───────────────────────────────────────────────────────────────
function ImpactTab() {
  const t = useT();
  const [touIdx, setTouIdx] = useState(0);
  const tou = TOU_PERIODS[touIdx];
  const hist = useEnergyHistory();
  const auto = hist.autonomy;
  const r = 42, c = 2 * Math.PI * r;
  const segs = [
    { v: auto.solar, color: "#F59E0B" },
    { v: auto.battery, color: "#4ADE80" },
    { v: auto.grid, color: "#6B7280" },
  ];
  let acc = 0;
  const maxVal = Math.max(...SOLAR_VALUE);

  return (
    <div className="px-4 space-y-4">
      {/* Autonomy donut */}
      <div className="rounded-3xl p-4 liquid-glass">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.energyAutonomy")}</p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: hist.source === "synced" ? GREEN : "var(--text-3)" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: hist.source === "synced" ? GREEN : "#9CA3AF" }} />
            {hist.source === "synced" ? t("enr.synced") : t("enr.demo")}
          </span>
        </div>
        <div className="flex items-center gap-5">
          <svg width="110" height="110" viewBox="0 0 110 110" className="flex-shrink-0">
            <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            {segs.map((s, i) => {
              const len = (s.v / 100) * c;
              const el = (
                <circle key={i} cx="55" cy="55" r={r} fill="none" stroke={s.color} strokeWidth="9"
                  strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-acc} transform="rotate(-90 55 55)" strokeLinecap="butt" />
              );
              acc += len;
              return el;
            })}
            <text x="55" y="52" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#fff">{auto.total}</text>
            <text x="55" y="68" textAnchor="middle" fontSize="10" fill="#9CA3AF">{t("enr.autonomous")}</text>
          </svg>
          <div className="space-y-2">
            {[{ l: t("enr.srcSolar"), v: auto.solar, c: "#F59E0B" }, { l: t("enr.srcPowerwall"), v: auto.battery, c: "#4ADE80" }, { l: t("enr.grid"), v: auto.grid, c: "#6B7280" }].map((x) => (
              <div key={x.l} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: x.c }} />
                <span className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{x.v}%</span>
                <span className="text-text-secondary text-xs">{x.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time of use */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>{t("enr.timeOfUse")}</p>
        <div className="flex gap-2 mb-3">
          {TOU_PERIODS.map((p, i) => (
            <button key={p.id} onClick={() => setTouIdx(i)} className="flex-1 rounded-xl py-2 text-center transition-all" style={touIdx === i ? { background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.3)" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}>
              <p className="text-[11px]" style={{ color: "var(--text-2)" }}>{TOU_KEY[p.id] ? t(TOU_KEY[p.id]) : p.label}</p>
              <p className="text-sm font-bold" style={{ color: touIdx === i ? "var(--accent)" : "var(--text-1)" }}>{p.mwh} MWh</p>
            </button>
          ))}
        </div>
        {[{ l: t("enr.srcSolar"), v: tou.solar, c: "#F59E0B" }, { l: t("enr.srcPowerwall"), v: tou.battery, c: "#4ADE80" }, { l: t("enr.grid"), v: tou.grid, c: "#6B7280" }].map((x) => (
          <div key={x.l} className="mb-2 last:mb-0">
            <div className="flex items-center justify-between mb-1"><span className="text-sm" style={{ color: "var(--text-1)" }}>{x.l}</span><span className="text-sm" style={{ color: "var(--text-2)" }}>{x.v}%</span></div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-full rounded-full" style={{ width: `${x.v}%`, background: x.c }} /></div>
          </div>
        ))}
      </div>

      {/* Solar value */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>{t("enr.solarValue")}</p>
        <div className="flex items-end justify-between gap-1 h-28">
          {SOLAR_VALUE.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-1.5 rounded-full" style={{ height: `${(v / maxVal) * 100}%`, background: "#4ADE80" }} />
              <span className="text-text-tertiary text-[8px]">{i + 1}</span>
            </div>
          ))}
        </div>
        <p className="text-center font-bold text-2xl mt-2" style={{ color: "#4ADE80" }}>{SOLAR_VALUE_TOTAL.toLocaleString()} $</p>
        <p className="text-center text-text-tertiary text-[11px]">{t("enr.thisYear")} {TARIFF.provider}</p>
      </div>

      {/* Solar offset */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold mb-3" style={{ color: "var(--text-1)" }}>{t("enr.solarOffset")}</p>
        <div className="flex items-end justify-center gap-10 h-32">
          {[{ l: t("enr.srcSolar"), v: OFFSET.solarMwh, c: "#F59E0B" }, { l: t("enr.home2"), v: OFFSET.homeMwh, c: "#3B82F6" }].map((x) => (
            <div key={x.l} className="flex flex-col items-center justify-end h-full">
              <div className="w-14 rounded-t-lg" style={{ height: `${(x.v / OFFSET.solarMwh) * 100}%`, background: x.c }} />
              <p className="text-sm font-semibold mt-1.5" style={{ color: "var(--text-1)" }}>{x.v} MWh</p>
              <p className="text-xs" style={{ color: x.c }}>{x.l}</p>
            </div>
          ))}
        </div>
        <p className="text-center text-sm mt-2" style={{ color: "var(--text-2)" }}><b style={{ color: "var(--accent)" }}>{OFFSET.pct}%</b> {t("enr.offsetEnergy")}</p>
      </div>

      {/* Backup history */}
      <div>
        <div className="flex items-center justify-between mb-2 px-1">
          <p className="text-text-secondary text-xs font-medium uppercase tracking-wide">{t("enr.backupHistory")}</p>
          <span className="text-text-tertiary text-[10px]">{BACKUP_SUMMARY.events} {t("enr.events")} · {t("enr.bsTotal")} · {t("enr.max")} {t("enr.bsLongest")}</span>
        </div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {BACKUP_EVENTS.map((e, i) => (
            <div key={e.date} className="flex items-center justify-between px-4 py-3" style={{ borderBottom: i < BACKUP_EVENTS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div><p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{e.date}</p><p className="text-text-tertiary text-[11px]">{e.window}</p></div>
              <span className="text-text-secondary text-xs">{BDUR_KEY[i] ? t(BDUR_KEY[i]) : e.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Powerwall tab ────────────────────────────────────────────────────────────
function PowerwallTab() {
  const t = useT();
  const { energy, setEnergy } = useStore();
  const { s, source } = useEnergyLive();
  const reserve = energy.backupReserve;
  const reserveLabel = reserve <= 20 ? t("enr.resLow") : reserve >= 100 ? t("enr.resMax") : t("enr.resBalanced");
  // Rough off-grid runtime estimate from reserve %.
  const hours = Math.max(1, Math.round((reserve / 100) * 13.5 + 2));
  const charging = s.battery >= 0;
  const cheap = cheapestWindow(TARIFF_SERIES, 4);

  return (
    <div className="px-4 space-y-4">
      {/* Live Powerwall status (from the energy event bus, falls back to sim) */}
      <div className="rounded-3xl p-4 liquid-glass">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.powerwallLive")}</p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: source === "live" ? GREEN : "var(--text-3)" }}>
            <span style={{ width: 7, height: 7, borderRadius: 999, background: source === "live" ? GREEN : "#9CA3AF", boxShadow: source === "live" ? `0 0 6px ${GREEN}` : "none" }} />
            {source === "live" ? t("enr.live") : t("enr.simulated")}
          </span>
        </div>
        <div className="flex items-end justify-between mb-2">
          <p className="text-4xl font-bold" style={{ color: "var(--text-1)" }}>{Math.round(s.batteryPct)}%</p>
          <p className="text-sm font-semibold" style={{ color: GREEN }}>{charging ? t("enr.charging2") : t("enr.discharging")} · {kw(s.battery)}</p>
        </div>
        <FillBar pct={s.batteryPct} />
        <div className="flex justify-between mt-2 text-[11px]" style={{ color: "var(--text-3)" }}>
          <span>{(13.5 * s.batteryPct / 100).toFixed(1)} / 13.5 kWh</span>
          <span>{t("enr.reserveShort")} {reserve}%</span>
        </div>
      </div>

      {/* Backup reserve */}
      <div className="rounded-3xl p-4 liquid-glass">
        <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.backupReserve")}</p>
        <p className="text-text-secondary text-xs mb-3">{t("enr.reserveDesc")}</p>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold" style={{ color: "#F59E0B" }}>{reserve}% {t("enr.reserveWord")}</span>
          <span className="text-sm font-bold" style={{ color: "#3B82F6" }}>{100 - reserve}% {t("enr.dailyUse")}</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden mb-1" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${reserve}%`, background: "#F59E0B" }} />
          <div className="absolute inset-y-0 rounded-full" style={{ left: `${reserve}%`, right: 0, background: "#3B82F6" }} />
          <input
            type="range" min={0} max={100} step={5} value={reserve}
            onChange={(e) => setEnergy({ backupReserve: Number(e.target.value) })}
            aria-label={t("enr.backupReserve")}
            className="absolute inset-0 w-full opacity-0 cursor-pointer"
          />
        </div>
        <p className="text-text-tertiary text-[11px]">{t("enr.reserveCap")} {reserveLabel} {t("enr.pwKeeps")} {reserve}% {t("enr.forOutages")}</p>
        <button onClick={() => setEnergy({ backupReserve: 100 })} className="w-full mt-3 py-2.5 rounded-xl text-sm font-medium" style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.25)", color: "#F59E0B" }}>{t("enr.initMaxReserve")}</button>
      </div>

      {/* Operational mode */}
      <div>
        <p className="text-text-secondary text-xs font-medium uppercase tracking-wide mb-2 px-1">{t("enr.opMode")}</p>
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
          {[
            { id: "self_powered" as const, label: t("enr.modeSelfTitle"), desc: t("enr.modeSelfDesc") },
            { id: "time_based" as const, label: t("enr.modeTimeTitle"), desc: t("enr.modeTimeDesc") },
          ].map((m, i) => (
            <button key={m.id} onClick={() => setEnergy({ mode: m.id })} className="w-full flex items-start gap-3 px-4 py-3.5 text-left" style={{ borderBottom: i === 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{m.label}</p>
                <p className="text-text-secondary text-xs">{m.desc}</p>
              </div>
              <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={energy.mode === m.id ? { background: "#3B82F6" } : { border: "1.5px solid var(--glass-border)" }}>
                {energy.mode === m.id && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tariff plan + dynamic charging */}
      <div className="rounded-3xl p-4 liquid-glass">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.dynamicTariff")} {TARIFF.provider}</p>
          <span className="text-text-tertiary text-[11px]">{t("enr.todayShort")}</span>
        </div>
        <div className="flex gap-6 mb-3">
          <div><p className="text-text-tertiary text-[11px]">{t("enr.buyPrice")}</p><p className="text-base font-bold" style={{ color: "var(--text-1)" }}>{TARIFF.buy.toFixed(2)} {TARIFF.currency}</p></div>
          <div><p className="text-text-tertiary text-[11px]">{t("enr.cheapWindowLbl")}</p><p className="text-base font-bold" style={{ color: "#4ADE80" }}>{cheap.start}:00–{cheap.end}:00</p></div>
        </div>
        <svg viewBox="0 0 300 70" className="w-full" style={{ height: 70 }} preserveAspectRatio="none">
          <defs>
            <linearGradient id="tariff-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4ADE80" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#4ADE80" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* cheapest-window highlight band */}
          <rect x={4 + (cheap.start / 24) * 292} y={2} width={((cheap.end - cheap.start) / 24) * 292} height={66} fill="rgba(74,222,128,0.14)" />
          <path d={`${seriesPath(TARIFF_SERIES, 300, 70, 4)} L296,66 L4,66 Z`} fill="url(#tariff-fill)" stroke="none" />
          <path d={seriesPath(TARIFF_SERIES, 300, 70, 4)} fill="none" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 4px rgba(74,222,128,0.4))" }} />
        </svg>
        <div className="flex justify-between text-text-tertiary text-[10px] mt-1 mb-3"><span>0:00</span><span>12:00</span><span>24:00</span></div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex-1 pr-3">
            <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("enr.chargeWhenCheap")}</p>
            <p className="text-text-secondary text-xs">{energy.chargeWhenCheap ? `${t("enr.chargeCheapPre")} ${cheap.start}:00–${cheap.end}:00 (~${cheap.avg.toFixed(2)} ${TARIFF.currency}/kWh)` : t("enr.chargeCheapOff")}</p>
          </div>
          <button onClick={() => setEnergy({ chargeWhenCheap: !energy.chargeWhenCheap })} aria-label={t("enr.chargeWhenCheap")} className="w-11 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: energy.chargeWhenCheap ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: energy.chargeWhenCheap ? "calc(100% - 22px)" : "2px", background: energy.chargeWhenCheap ? "#050A14" : "rgba(255,255,255,0.5)" }} />
          </button>
        </div>
      </div>

      {/* Off-grid */}
      <div className="rounded-3xl p-4" style={{ background: energy.offGrid ? "rgba(245,158,11,0.07)" : "rgba(255,255,255,0.04)", border: energy.offGrid ? "1px solid rgba(245,158,11,0.22)" : "0.5px solid var(--glass-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>{t("enr.offGrid")}</p>
          <button onClick={() => setEnergy({ offGrid: !energy.offGrid })} aria-label={t("enr.offGrid")} className="w-11 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: energy.offGrid ? "#F59E0B" : "rgba(255,255,255,0.15)" }}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: energy.offGrid ? "calc(100% - 22px)" : "2px", background: "#050A14" }} />
          </button>
        </div>
        <p className="text-text-secondary text-xs mb-3">{t("enr.offGridPre")}{hours} {t("enr.offGridPost")}</p>
        <div className="flex items-center justify-between text-[11px] mb-1"><span style={{ color: "var(--text-2)" }}>{t("enr.systemPowerLimit")}</span><span style={{ color: "var(--text-3)" }}>{t("enr.kwMax")}</span></div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}><div className="h-full rounded-full" style={{ width: "62%", background: "#EF4444" }} /></div>
      </div>

      {/* Storm watch */}
      <div className="rounded-2xl px-4 py-3.5 flex items-center justify-between" style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid var(--glass-border)" }}>
        <div><p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("enr.stormAlerts")}</p><p className="text-text-secondary text-xs">{t("enr.stormDesc")}</p></div>
        <button onClick={() => setEnergy({ stormWatch: !energy.stormWatch })} aria-label={t("enr.stormAlerts")} className="w-11 h-6 rounded-full relative transition-all flex-shrink-0" style={{ background: energy.stormWatch ? "#4ADE80" : "rgba(255,255,255,0.15)" }}>
          <div className="absolute top-0.5 w-5 h-5 rounded-full transition-all" style={{ left: energy.stormWatch ? "calc(100% - 22px)" : "2px", background: energy.stormWatch ? "#050A14" : "rgba(255,255,255,0.5)" }} />
        </button>
      </div>
    </div>
  );
}
