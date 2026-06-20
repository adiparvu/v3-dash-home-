"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useStore } from "../../lib/store";
import { useZones } from "../../lib/useZones";

export default function CustomZonePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { ready, findZone, removeZone } = useStore();
  const { zones: liveZones, source: zonesSource } = useZones();
  const storeZone = findZone(params.slug);
  const remoteZone = liveZones.find((z) => z.href === `/zones/${params.slug}`);
  const zone = storeZone ?? remoteZone;
  const synced = !storeZone && !!remoteZone && zonesSource === "remote";
  const [confirmOpen, setConfirmOpen] = useState(false);

  const doDelete = () => {
    if (zone) removeZone(zone.href);
    router.push("/zones");
  };

  // While the store / remote zones hydrate, avoid a flash of "not found"
  if (!ready || zonesSource === "loading") {
    return <div className="min-h-screen" style={{ background: "transparent" }} />;
  }

  if (!zone) {
    return (
      <div className="min-h-screen flex flex-col" style={{ color: "var(--text-1)" }}>
        <StatusBar />
        <div className="px-5 pt-1 pb-4 flex items-center gap-3">
          <Link href="/zones" aria-label="Back" className="w-9 h-9 rounded-2xl flex items-center justify-center liquid-glass" style={{ color: "var(--text-1)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <h1 className="font-bold text-xl" style={{ color: "var(--text-1)" }}>Zone</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center -mt-16">
          <span className="text-5xl mb-4">🗺️</span>
          <p className="text-base font-semibold mb-1" style={{ color: "var(--text-1)" }}>Zone not found</p>
          <p className="text-sm mb-6" style={{ color: "var(--text-2)" }}>This zone may have been removed or never existed.</p>
          <Link href="/zones">
            <button className="px-5 py-3 rounded-2xl text-sm font-semibold" style={{ background: "linear-gradient(135deg,#4ADE80,#22C55E)", color: "#08111E" }}>Back to Zones</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10" style={{ color: "var(--text-1)" }}>
      {/* Hero */}
      <div className="relative h-56 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(160deg, ${zone.accentColor}33 0%, transparent 100%)` }}>
        <StatusBar transparent />
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(ellipse at 50% 55%, ${zone.accentColor} 0%, transparent 70%)` }} />
        <Link href="/zones" aria-label="Back" className="absolute top-14 left-5 w-9 h-9 rounded-2xl flex items-center justify-center z-10 liquid-glass" style={{ color: "var(--text-1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </Link>
        <div className="absolute top-14 right-5 z-10 flex items-center gap-2">
          <Link
            href={`${zone.href}/edit`}
            aria-label="Edit zone"
            className="w-9 h-9 rounded-2xl flex items-center justify-center liquid-glass active:scale-90 transition-transform"
            style={{ color: "var(--text-1)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <button
            onClick={() => setConfirmOpen(true)}
            aria-label="Delete zone"
            className="w-9 h-9 rounded-2xl flex items-center justify-center liquid-glass active:scale-90 transition-transform"
            style={{ color: "#EF4444" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6m4 5v6m6-6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
        <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl z-10 liquid-glass">{zone.icon}</div>
      </div>

      {/* Title */}
      <div className="px-5 -mt-4 relative z-10">
        <div className="flex items-start justify-between mb-1">
          <h1 className="font-bold text-2xl leading-tight" style={{ color: "var(--text-1)" }}>{zone.name}</h1>
          <span className="mt-1 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: `${zone.statusColor}22`, color: zone.statusColor, border: `1px solid ${zone.statusColor}40` }}>{zone.status}</span>
        </div>
        <p className="text-sm flex items-center gap-2" style={{ color: "var(--text-2)" }}>
          <span>{zone.subtitle} <span className="mx-1 opacity-40">·</span> {zone.type}</span>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={synced
            ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }
            : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.12)" }}>
            {synced ? "Synced" : "Demo"}
          </span>
        </p>
      </div>

      {/* Health */}
      <div className="px-4 mt-5">
        <div className="liquid-glass rounded-3xl p-4 flex items-center gap-4">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg width="64" height="64" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="var(--glass-border)" strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke={zone.accentColor} strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 28} strokeDashoffset={(2 * Math.PI * 28) * (1 - zone.health / 100)} transform="rotate(-90 32 32)" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-bold text-sm" style={{ color: "var(--text-1)" }}>{zone.health}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: "var(--text-1)" }}>Zone Health</p>
            <p className="text-xs" style={{ color: "var(--text-2)" }}>Operating normally</p>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {zone.metrics.map((m) => (
          <div key={m.label} className="liquid-glass rounded-2xl p-4">
            <p className="text-xs mb-1" style={{ color: "var(--text-2)" }}>{m.label}</p>
            <p className="font-bold text-lg" style={{ color: "var(--text-1)" }}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="px-4 mt-4 space-y-2">
        {[
          { label: "Sensors", href: "/sensors", icon: "📡" },
          { label: "Tasks", href: "/tasks", icon: "✅" },
          { label: "Automations", href: "/automations", icon: "⚡" },
        ].map((a) => (
          <Link key={a.label} href={a.href}>
            <div className="liquid-glass rounded-2xl px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <span className="text-xl">{a.icon}</span>
              <span className="flex-1 text-sm font-medium" style={{ color: "var(--text-1)" }}>{a.label}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.4 }}><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Delete confirm */}
      {confirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setConfirmOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text-1)" }}>Delete {zone.name}?</h2>
            <p className="text-sm mb-5" style={{ color: "var(--text-2)" }}>This zone will be permanently removed.</p>
            <button onClick={doDelete} className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 active:scale-[0.97] transition-transform" style={{ background: "#EF4444", color: "#fff" }}>Delete Zone</button>
            <button onClick={() => setConfirmOpen(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
