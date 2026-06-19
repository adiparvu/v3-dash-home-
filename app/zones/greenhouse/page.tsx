import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const envMetrics = [
  { label: "Temperature", value: "24.3 °C", color: "#F59E0B", icon: "🌡️", trend: "↑ Optimal" },
  { label: "Humidity", value: "65%", color: "#22D3EE", icon: "💧", trend: "→ Stable" },
  { label: "CO₂ Level", value: "800 ppm", color: "#F97316", icon: "🌫️", trend: "↑ Above optimal" },
  { label: "Light", value: "60%", color: "#FBBF24", icon: "☀️", trend: "→ Scheduled" },
];

const systems = [
  { label: "Irrigation", value: "Active", color: "#4ADE80", dot: true },
  { label: "Ventilation", value: "Auto", color: "#4ADE80", dot: true },
  { label: "Heating", value: "Standby", color: "#9CA3AF", dot: false },
  { label: "Grow Lights", value: "60%", color: "#FBBF24", dot: false },
  { label: "Shade System", value: "Open", color: "#4ADE80", dot: false },
  { label: "Last Watered", value: "2 hours ago", color: "#9CA3AF", dot: false },
];

export default function GreenhousePage() {
  return (
    <div className="min-h-screen pb-8" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #0A1F0A 0%, #122212 35%, #0F280F 70%, #091808 100%)",
          }}
        />
        {/* Greenhouse structure */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-25">
          <div className="relative">
            <div className="w-48 h-32 rounded-t-[80px]" style={{ border: "1.5px solid rgba(74,222,128,0.8)", borderBottom: "none" }} />
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-0 h-0" style={{ borderLeft: "1px solid rgba(74,222,128,0.5)", height: 32 }} />
          </div>
        </div>
        {/* Glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div style={{ width: 200, height: 200, background: "radial-gradient(ellipse, rgba(74,222,128,0.08) 0%, transparent 70%)" }} />
        </div>

        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="white" /><circle cx="12" cy="12" r="1.5" fill="white" /><circle cx="12" cy="19" r="1.5" fill="white" /></svg>
          </button>
        </div>

        {/* Status badge */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
          <div
            className="rounded-2xl px-4 py-2 flex items-center gap-2"
            style={{ background: "rgba(74,222,128,0.12)", border: "1px solid rgba(74,222,128,0.25)", backdropFilter: "blur(10px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-accent-green" style={{ boxShadow: "0 0 6px #4ADE80" }} />
            <span className="text-accent-green font-semibold text-sm">Environment Optimal</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-8"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Greenhouse</h1>
            <p className="text-text-secondary text-sm">Main Greenhouse · 320 m²</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}>
            Optimal
          </span>
        </div>

        {/* Environment grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {envMetrics.map((m) => (
            <div key={m.label} className="rounded-2xl p-3.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <span className="text-lg">{m.icon}</span>
              <p className="text-white font-bold text-xl mt-1 leading-tight">{m.value}</p>
              <p className="text-text-secondary text-xs">{m.label}</p>
              <p className="text-xs mt-0.5" style={{ color: m.color }}>{m.trend}</p>
            </div>
          ))}
        </div>

        {/* Systems */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="px-4 py-3 border-b border-white/[0.06]">
            <span className="text-text-secondary text-xs font-medium tracking-wide uppercase">Systems</span>
          </div>
          {systems.map((row, i) => (
            <div
              key={row.label}
              className="flex justify-between items-center px-4 py-3.5"
              style={{ borderBottom: i < systems.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <span className="text-text-secondary text-sm">{row.label}</span>
              <div className="flex items-center gap-1.5">
                {row.dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.color, boxShadow: `0 0 4px ${row.color}` }} />}
                <span className="text-sm font-medium" style={{ color: row.color }}>{row.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
