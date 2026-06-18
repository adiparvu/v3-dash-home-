import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const metrics = [
  { label: "Plants", value: "87", color: "#4ADE80" },
  { label: "Trees", value: "12", color: "#4ADE80" },
  { label: "Lawn Area", value: "680 m²", color: "#FFFFFF" },
  { label: "Flower Beds", value: "8", color: "#FFFFFF" },
];

const statusRows = [
  { label: "Irrigation", value: "Active", color: "#4ADE80" },
  { label: "Mowing Schedule", value: "Weekly", color: "#9CA3AF" },
  { label: "Fertilizer Due", value: "In 5 days", color: "#F59E0B" },
  { label: "Pest Control", value: "Low Risk", color: "#4ADE80" },
  { label: "Last Watered", value: "1h ago", color: "#9CA3AF" },
  { label: "Soil Moisture", value: "Optimal", color: "#22D3EE" },
];

const actions = [
  {
    label: "History",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    label: "Tasks",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    label: "Documents",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
  },
  {
    label: "Sensors",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0" />
        <path d="M1.42 9a16 16 0 0 1 21.16 0" />
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <circle cx="12" cy="20" r="1" fill="#9CA3AF" />
      </svg>
    ),
  },
];

// Decorative particle dots (static scatter)
const particles = [
  { top: "12%", left: "8%", size: 3, opacity: 0.25 },
  { top: "22%", left: "78%", size: 2, opacity: 0.18 },
  { top: "38%", left: "18%", size: 4, opacity: 0.15 },
  { top: "55%", left: "88%", size: 2, opacity: 0.22 },
  { top: "18%", left: "55%", size: 3, opacity: 0.12 },
  { top: "68%", left: "32%", size: 2, opacity: 0.20 },
  { top: "42%", left: "65%", size: 3, opacity: 0.14 },
  { top: "75%", left: "72%", size: 2, opacity: 0.18 },
  { top: "30%", left: "40%", size: 2, opacity: 0.10 },
  { top: "60%", left: "10%", size: 3, opacity: 0.16 },
];

export default function GardenPage() {
  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero area */}
      <div className="relative overflow-hidden" style={{ height: "288px" }}>
        {/* Earthy green gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #0A1A08 0%, #111F0C 35%, #0E1A0A 70%, #081305 100%)",
          }}
        />

        {/* Subtle radial glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 280,
            height: 160,
            background: "radial-gradient(ellipse, rgba(74,222,128,0.07) 0%, transparent 70%)",
          }}
        />

        {/* Decorative scattered dots */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: `rgba(74,222,128,${p.opacity})`,
            }}
          />
        ))}

        {/* Leaf icon badge */}
        <div
          className="absolute rounded-3xl flex items-center justify-center"
          style={{
            left: "50%",
            top: "46%",
            transform: "translate(-50%, -50%)",
            width: 64,
            height: 64,
            background: "rgba(74,222,128,0.10)",
            border: "1px solid rgba(74,222,128,0.28)",
            boxShadow: "0 0 24px rgba(74,222,128,0.15)",
            fontSize: "28px",
          }}
        >
          🌿
        </div>

        {/* Status bar overlay */}
        <StatusBar transparent />

        {/* Header buttons */}
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link
            href="/zones"
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(0,0,0,0.40)", border: "1px solid rgba(255,255,255,0.10)" }}
          >
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
        className="rounded-t-[32px] -mt-6 relative z-10 px-5 pt-6 pb-12"
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
          <h1 className="text-white text-2xl font-bold">Garden</h1>
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(74,222,128,0.15)",
              color: "#4ADE80",
              border: "1px solid rgba(74,222,128,0.25)",
            }}
          >
            Good
          </span>
        </div>
        <p className="text-sm mb-5" style={{ color: "#9CA3AF" }}>
          Main Garden · 1,200 m²
        </p>

        {/* Metrics grid (2x2) */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-2xl p-3.5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-[10px] mb-1" style={{ color: "#6B7280" }}>
                {m.label}
              </p>
              <p className="text-base font-bold" style={{ color: m.color }}>
                {m.value}
              </p>
            </div>
          ))}
        </div>

        {/* Status rows */}
        <div
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {statusRows.map((row, i) => (
            <div
              key={row.label}
              className="flex justify-between items-center px-4 py-3"
              style={{
                borderBottom: i < statusRows.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined,
              }}
            >
              <span className="text-sm" style={{ color: "#9CA3AF" }}>
                {row.label}
              </span>
              <span className="text-sm font-medium" style={{ color: row.color }}>
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action buttons row */}
        <div className="grid grid-cols-4 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              className="rounded-2xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.09)",
              }}
            >
              {action.icon}
              <span className="text-xs" style={{ color: "#9CA3AF" }}>
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
