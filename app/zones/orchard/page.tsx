import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const radius = 42;
const circumference = 2 * Math.PI * radius;
const healthScore = 88;
const offset = circumference - (healthScore / 100) * circumference;

const details = [
  { label: "Variety", value: "Mixed Apple & Pear", color: "#FFFFFF" },
  { label: "Trees", value: "124", color: "#FFFFFF" },
  { label: "Flowering", value: "75%", color: "#4ADE80" },
  { label: "Irrigation", value: "Optimal", color: "#F59E0B" },
  { label: "Disease Risk", value: "Low", color: "#4ADE80" },
  { label: "Last Pruned", value: "22 days ago", color: "#9CA3AF" },
];

export default function OrchardPage() {
  return (
    <div className="min-h-screen pb-8" style={{ background: "#050A14" }}>
      {/* Hero */}
      <div className="relative h-72 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #1A0E05 0%, #2A1A08 35%, #1E1405 70%, #150E04 100%)",
          }}
        />
        {/* Tree rows */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-4 opacity-20 pb-2">
          {[50, 60, 55, 65, 58, 62, 50].map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-8 h-8 rounded-full" style={{ background: "#5A3010", width: h * 0.6, height: h * 0.5 }} />
              <div className="w-2 rounded-full" style={{ height: h * 0.3, background: "#6B3D10" }} />
            </div>
          ))}
        </div>
        <div
          className="absolute pointer-events-none"
          style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 300, height: 200, background: "radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%)" }}
        />

        <StatusBar transparent />
        <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-5 z-10">
          <Link href="/zones" className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 5l-7 7 7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
          <button className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.10)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.5" fill="white" /><circle cx="12" cy="12" r="1.5" fill="white" /><circle cx="12" cy="19" r="1.5" fill="white" /></svg>
          </button>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="rounded-3xl p-4 flex flex-col items-center gap-1"
            style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.25)", backdropFilter: "blur(10px)" }}
          >
            <span className="text-4xl">🍎</span>
            <span className="text-white font-bold text-sm">Apple Orchard</span>
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

        {/* Top cards */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Health ring card */}
          <div className="rounded-2xl p-4 flex flex-col items-center" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-text-secondary text-xs mb-2">Health Score</span>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#F59E0B" strokeWidth="7"
                strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">{healthScore}</text>
            </svg>
          </div>

          {/* Yield card */}
          <div className="rounded-2xl p-4 flex flex-col justify-between" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <span className="text-text-secondary text-xs">Projected Yield</span>
            <div>
              <span className="text-white font-bold text-4xl">12.4</span>
              <span className="text-text-secondary text-base ml-1">t</span>
            </div>
            <div>
              <span className="text-text-secondary text-xs">Next Harvest</span>
              <p className="text-white font-bold text-lg">23 days</p>
            </div>
          </div>
        </div>

        {/* Detail rows */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {details.map((row, i) => (
            <div key={row.label} className="flex justify-between items-center px-4 py-3.5" style={{ borderBottom: i < details.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
              <span className="text-text-secondary text-sm">{row.label}</span>
              <span className="text-sm font-medium" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
