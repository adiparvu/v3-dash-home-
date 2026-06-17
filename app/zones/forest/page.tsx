import Link from "next/link";

export default function ForestPage() {
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const healthScore = 91;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-page background */}
      <img
        src="/images/zone-forest-bg.jpg"
        alt=""
        draggable={false}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "right top" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.58)" }} />

      {/* Content */}
      <div className="relative z-10 pb-10">
        {/* Header */}
        <div className="px-5 pt-4 flex items-center justify-between">
          <Link href="/zones" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-sm font-medium">Forest / Mixed Forest</span>
          </Link>
          <button className="w-8 h-8 rounded-full bg-[rgba(28,42,64,0.7)] flex items-center justify-center">
            <span className="text-[#9CA3AF] text-lg leading-none pb-0.5">···</span>
          </button>
        </div>

        {/* Main content */}
        <div className="mx-4 mt-6 flex gap-4 items-start">
          {/* Health Score ring */}
          <div className="flex flex-col items-center">
            <span className="text-[#9CA3AF] text-xs mb-2">Health Score</span>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(28,42,64,0.6)" strokeWidth="8" />
              <circle
                cx="65" cy="65" r={radius} fill="none"
                stroke="#4ADE80" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={offset}
                transform="rotate(-90 65 65)"
              />
              <text x="65" y="70" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">
                {healthScore}
              </text>
            </svg>
          </div>

          {/* Right stat cards */}
          <div className="flex-1 space-y-2">
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(19,28,46,0.78)" }}>
              <p className="text-[#9CA3AF] text-xs">Trees</p>
              <p className="text-white font-bold text-xl">2,543</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(19,28,46,0.78)" }}>
              <p className="text-[#9CA3AF] text-xs">Carbon Storage</p>
              <p className="text-white font-semibold">125.4 tCO₂</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(19,28,46,0.78)" }}>
              <p className="text-[#9CA3AF] text-xs">Biomass</p>
              <p className="text-white font-semibold">320.7 t</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(19,28,46,0.78)" }}>
              <p className="text-[#9CA3AF] text-xs">Biodiversity</p>
              <p className="text-[#4ADE80] font-semibold">🌿 High</p>
            </div>
            <div className="rounded-xl p-3" style={{ backgroundColor: "rgba(19,28,46,0.78)" }}>
              <p className="text-[#9CA3AF] text-xs">Risk Level</p>
              <p className="text-[#4ADE80] font-semibold">Low</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
