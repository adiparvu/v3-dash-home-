import StatusBar from "./components/layout/StatusBar";
import BottomNav from "./components/layout/BottomNav";
import Link from "next/link";

const healthScore = 87;
const circumference = 2 * Math.PI * 52;
const offset = circumference - (healthScore / 100) * circumference;

const stats = [
  { value: "26", label: "Zones", color: "#FFFFFF" },
  { value: "142", label: "Objects", color: "#FFFFFF" },
  { value: "7", label: "Tasks", color: "#FFFFFF" },
  { value: "3", label: "Alerts", color: "#F97316" },
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

export default function OverviewPage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex justify-between items-center">
        <div>
          <p className="text-text-secondary text-xs font-medium">Good morning</p>
          <h1 className="text-white font-bold text-2xl leading-tight">My Property</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)" }}
          >
            <span className="text-bg font-bold text-sm">A</span>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="px-5 mb-3 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-green inline-block" style={{ boxShadow: "0 0 6px #4ADE80" }} />
        <span className="text-accent-green text-xs font-medium">Live</span>
        <span className="text-text-tertiary text-xs">· Updated just now</span>
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
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green" style={{ boxShadow: "0 0 6px #4ADE80" }} />
          <span className="text-white text-xs font-medium">Prvio Estate</span>
        </div>
        {/* Bottom-right */}
        <div
          className="absolute bottom-3 right-3 rounded-xl px-2.5 py-1.5"
          style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <span className="text-text-secondary text-[10px]">26 zones · 142 objects</span>
        </div>
      </div>

      {/* Health Score + Stats */}
      <div className="mx-4 mb-4 flex gap-3">
        {/* Health ring */}
        <div
          className="rounded-3xl p-4 flex flex-col items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", minWidth: 120 }}
        >
          <span className="text-text-secondary text-[10px] font-medium mb-2">Health Score</span>
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
            <text x="60" y="65" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">{healthScore}</text>
          </svg>
          <span className="text-accent-green text-xs font-medium mt-1">Very Good</span>
        </div>

        {/* Stats grid */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 flex flex-col justify-center"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="font-bold text-xl leading-tight" style={{ color: s.color }}>{s.value}</span>
              <span className="text-text-secondary text-xs mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick access zones */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Quick Access</span>
        <Link href="/zones" className="text-accent-green text-xs font-medium">See all</Link>
      </div>
      <div className="px-4 mb-4 grid grid-cols-4 gap-2">
        {quickZones.map((z) => (
          <Link key={z.href} href={z.href}>
            <div
              className="rounded-2xl p-2.5 flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xl">{z.icon}</span>
              <span className="text-white text-[10px] font-medium leading-tight text-center">{z.label}</span>
              <span className="text-[9px] font-medium" style={{ color: z.color }}>{z.status}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Alerts */}
      <div className="px-5 mb-2 flex items-center justify-between">
        <span className="text-white font-semibold text-sm">Recent Activity</span>
        <button className="text-accent-green text-xs font-medium">Clear all</button>
      </div>
      <div className="px-4 space-y-2 mb-4">
        {recentAlerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-2xl p-3.5 flex items-start gap-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: `${alert.color}18`, border: `1px solid ${alert.color}30` }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: alert.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium leading-tight">{alert.title}</p>
              <p className="text-text-secondary text-xs mt-0.5 leading-snug">{alert.desc}</p>
            </div>
            <span className="text-text-tertiary text-[10px] flex-shrink-0">{alert.time}</span>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
