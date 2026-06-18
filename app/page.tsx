"use client";

import StatusBar from "./components/layout/StatusBar";
import BottomNav from "./components/layout/BottomNav";
import { useTheme } from "./components/ThemeProvider";
import { useStore } from "./lib/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

const healthScore = 87;
const circumference = 2 * Math.PI * 52;
const offset = circumference - (healthScore / 100) * circumference;

const stats = [
  { value: "26", label: "Zones" },
  { value: "142", label: "Objects" },
  { value: "7", label: "Tasks" },
  { value: "3", label: "Alerts", alert: true },
];

const recentAlerts = [
  { id: 1, type: "warning", title: "Irrigation System", desc: "Scheduled maintenance due in 3 days", time: "2h ago", color: "#F59E0B" },
  { id: 2, type: "info", title: "Forest Zone", desc: "Health score improved to 91", time: "5h ago", color: "#4ADE80" },
  { id: 3, type: "alert", title: "Greenhouse", desc: "CO₂ level above optimal range", time: "1d ago", color: "#F97316" },
];

const quickZones = [
  { href: "/zones/lake", label: "Lake", icon: "💧", status: "Excellent", color: "#22D3EE" },
  { href: "/zones/forest", label: "Forest", icon: "🌲", status: "Good", color: "#4ADE80" },
  { href: "/zones/greenhouse", label: "Greenhouse", icon: "🏡", status: "Optimal", color: "#4ADE80" },
  { href: "/zones/orchard", label: "Orchard", icon: "🍎", status: "Good", color: "#4ADE80" },
];

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function OverviewPage() {
  const { theme, toggle } = useTheme();
  const { ready, onboarded, estateName, addedZones } = useStore();
  const router = useRouter();

  // First-launch: send the user through onboarding once.
  useEffect(() => {
    if (ready && !onboarded) router.replace("/onboarding");
  }, [ready, onboarded, router]);

  return (
    <div className="min-h-screen pb-32 prvio-bg" style={{ color: "var(--text-1)" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex justify-between items-center">
        <div>
          <p className="text-xs font-medium" style={{ color: "var(--text-2)" }}>Good morning</p>
          <h1 className="font-bold text-2xl leading-tight" style={{ color: "var(--text-1)" }}>{estateName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <Link
            href="/search"
            aria-label="Search"
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-90"
            style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.75" /><path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" /></svg>
          </Link>
          {/* Theme toggle */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-9 h-9 rounded-2xl flex items-center justify-center transition-all duration-150 active:scale-90"
            style={{
              background: "var(--glass-bg)",
              border: "0.5px solid var(--glass-border)",
              color: "var(--text-2)",
            }}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          {/* Notification bell */}
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{
              background: "var(--glass-bg)",
              border: "0.5px solid var(--glass-border)",
              color: "var(--text-2)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)" }}
          >
            <span style={{ color: "var(--bg-1)", fontWeight: "bold", fontSize: "0.875rem" }}>A</span>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
        <span className="text-xs font-medium" style={{ color: "var(--accent)" }}>Live</span>
        <span className="text-xs" style={{ color: "var(--text-3)" }}>· Updated just now</span>
      </div>

      {/* Hero map area */}
      <div className="mx-4 mb-4 rounded-3xl overflow-hidden relative" style={{ height: 200 }}>
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: "linear-gradient(135deg, #0D1F35 0%, #0A2040 40%, #071830 100%)",
          }}
        />
        {/* Satellite grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74,222,128,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74,222,128,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Glowing property outline */}
        <div
          className="absolute rounded-2xl"
          style={{
            left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            width: 180, height: 120,
            border: "1.5px solid rgba(74,222,128,0.5)",
            boxShadow: "0 0 30px rgba(74,222,128,0.15), inset 0 0 30px rgba(74,222,128,0.05)",
          }}
        />
        {/* Zone dots */}
        {[
          { x: "35%", y: "38%", color: "#22D3EE", label: "Lake" },
          { x: "55%", y: "30%", color: "#4ADE80", label: "Forest" },
          { x: "65%", y: "55%", color: "#4ADE80", label: "Greenhouse" },
          { x: "38%", y: "62%", color: "#F59E0B", label: "Orchard" },
        ].map((dot) => (
          <div key={dot.label} className="absolute flex flex-col items-center gap-0.5" style={{ left: dot.x, top: dot.y, transform: "translate(-50%, -50%)" }}>
            <div className="w-2 h-2 rounded-full" style={{ background: dot.color, boxShadow: `0 0 8px ${dot.color}` }} />
            <span className="text-[9px] font-medium" style={{ color: dot.color }}>{dot.label}</span>
          </div>
        ))}
        {/* Top-left badge */}
        <div
          className="absolute top-3 left-3 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)", boxShadow: "0 0 6px var(--accent)" }} />
          <span className="text-white text-xs font-medium">Prvio Estate</span>
        </div>
        {/* Bottom-right */}
        <div
          className="absolute bottom-3 right-3 rounded-xl px-2.5 py-1.5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <span className="text-[10px]" style={{ color: "var(--text-2)" }}>26 zones · 142 objects</span>
        </div>
      </div>

      {/* Health Score + Stats */}
      <div className="mx-4 mb-4 flex gap-3">
        {/* Health ring */}
        <div
          className="rounded-3xl p-4 flex flex-col items-center justify-center liquid-glass"
          style={{ minWidth: 120 }}
        >
          <span className="text-[10px] font-medium mb-2" style={{ color: "var(--text-2)" }}>Health Score</span>
          <svg width="80" height="80" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#4ADE80" />
                <stop offset="100%" stopColor="#22D3EE" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="52" fill="none"
              stroke="url(#healthGrad)" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 60 60)"
            />
            <text x="60" y="65" textAnchor="middle" fill="currentColor" fontSize="22" fontWeight="bold">{healthScore}</text>
          </svg>
          <span className="text-xs font-medium mt-1" style={{ color: "var(--accent)" }}>Very Good</span>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {stats.map((s) => {
            const value = s.label === "Zones" ? String(26 + addedZones.length) : s.value;
            return (
              <div
                key={s.label}
                className="rounded-2xl p-3 flex flex-col justify-center liquid-glass"
              >
                <span className="font-bold text-xl leading-tight" style={{ color: s.alert ? "#F97316" : "var(--text-1)" }}>{value}</span>
                <span className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick access zones */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Quick Access</span>
        <Link href="/zones" className="text-xs font-medium" style={{ color: "var(--accent)" }}>See all</Link>
      </div>
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        {quickZones.map((z) => (
          <Link key={z.href} href={z.href}>
            <div
              className="rounded-2xl p-2.5 flex flex-col items-center gap-1.5 active:scale-95 transition-transform liquid-glass"
            >
              <span className="text-xl">{z.icon}</span>
              <span className="text-[10px] font-medium leading-tight text-center" style={{ color: "var(--text-1)" }}>{z.label}</span>
              <span className="text-[9px] font-medium" style={{ color: z.color }}>{z.status}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="font-semibold text-sm" style={{ color: "var(--text-1)" }}>Recent Activity</span>
        <button className="text-xs font-medium" style={{ color: "var(--accent)" }}>Clear all</button>
      </div>
      <div className="px-4 space-y-2 mb-4">
        {recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl p-3.5 flex items-start gap-3 liquid-glass"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${alert.color}18`, border: `1px solid ${alert.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: alert.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight" style={{ color: "var(--text-1)" }}>{alert.title}</p>
              <p className="text-xs mt-0.5 leading-snug" style={{ color: "var(--text-2)" }}>{alert.desc}</p>
            </div>
            <span className="text-[10px] flex-shrink-0" style={{ color: "var(--text-3)" }}>{alert.time}</span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
