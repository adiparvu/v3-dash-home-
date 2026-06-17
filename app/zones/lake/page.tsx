import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const stats = [
  { label: "Water Quality", value: "Excellent", color: "#22D3EE" },
  { label: "Temperature", value: "18.4 °C", color: "#FFFFFF" },
  { label: "Depth (avg)", value: "2.8 m", color: "#FFFFFF" },
  { label: "Volume", value: "1,250 m³", color: "#FFFFFF" },
  { label: "Fish Population", value: "Healthy", color: "#4ADE80" },
  { label: "Algae Level", value: "Low", color: "#4ADE80" },
  { label: "pH Level", value: "7.2", color: "#FFFFFF" },
  { label: "Last Maintenance", value: "5 days ago", color: "#9CA3AF" },
];

const actions = [
  { label: "History", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> },
  { label: "Tasks", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg> },
  { label: "Documents", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
  { label: "Sensors", icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="#9CA3AF"/></svg> },
];

export default function LakePage() {
  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero area */}
      <div className="relative h-80 overflow-hidden">
        {/* Deep water gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, #041828 0%, #072040 30%, #0A2E5A 60%, #082444 100%)",
          }}
        />
        {/* Water ripple rings */}
        {[80, 140, 200, 260].map((size, i) => (
          <div
            key={size}
            className="absolute rounded-full"
            style={{
              left: "50%", top: "58%",
              width: size, height: size * 0.4,
              transform: "translate(-50%, -50%)",
              border: `1px solid rgba(34,211,238,${0.3 - i * 0.06})`,
            }}
          />
        ))}
        {/* Glow */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "50%", top: "60%",
            transform: "translate(-50%, -50%)",
            width: 300, height: 120,
            background: "radial-gradient(ellipse, rgba(34,211,238,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Water icon */}
        <div
          className="absolute rounded-3xl p-4 flex items-center justify-center"
          style={{
            left: "50%", top: "48%",
            transform: "translate(-50%, -50%)",
            background: "rgba(34,211,238,0.12)",
            border: "1px solid rgba(34,211,238,0.35)",
            boxShadow: "0 0 30px rgba(34,211,238,0.25)",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z" fill="#22D3EE" opacity="0.9" />
            <path d="M12 8c0 0-3.5 5-3.5 8a3.5 3.5 0 0 0 7 0C15.5 13 12 8 12 8z" fill="#050A14" opacity="0.3" />
          </svg>
        </div>
        {/* Status bar overlay */}
        <StatusBar transparent />
        {/* Header */}
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="5" r="1.5" fill="white" />
              <circle cx="12" cy="12" r="1.5" fill="white" />
              <circle cx="12" cy="19" r="1.5" fill="white" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-28"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          borderTop: "1px solid rgba(255,255,255,0.10)",
        }}
      >
        {/* Drag indicator */}
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        {/* Title row */}
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-white text-2xl font-bold">Lake</h1>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: "rgba(34,211,238,0.15)", color: "#22D3EE", border: "1px solid rgba(34,211,238,0.25)" }}
          >
            Excellent
          </span>
        </div>
        <p className="text-text-secondary text-sm mb-5">Freshwater Ecosystem · 1,250 m³</p>

        {/* Stats */}
        <div className="space-y-0">
          {stats.map((row, i) => (
            <div
              key={row.label}
              className="flex justify-between items-center py-3"
              style={{ borderBottom: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
            >
              <span className="text-text-secondary text-sm">{row.label}</span>
              <span className="text-sm font-medium" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {actions.map((action) => (
            <button
              key={action.label}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.09)" }}
            >
              {action.icon}
              <span className="text-text-secondary text-xs">{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
