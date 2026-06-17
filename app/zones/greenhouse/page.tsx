import Link from "next/link";

export default function GreenhousePage() {
  return (
    <div className="bg-[#0B111E] min-h-screen">
      {/* Header image area */}
      <div className="relative h-40 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1623241899289-7dc4d71f0abf?w=800&q=80&fit=crop&auto=format"
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(11,17,30,0.6) 0%, rgba(11,17,30,0.5) 60%, rgba(11,17,30,0.95) 100%)",
          }}
        />
        {/* Header */}
        <div className="relative z-10 px-5 pt-4 flex items-center justify-between">
          <Link href="/zones" className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-white text-sm font-medium">Greenhouse / Main Greenhouse</span>
          </Link>
          <button className="w-8 h-8 rounded-full bg-[#1C2A40] flex items-center justify-center">
            <span className="text-[#9CA3AF] text-lg leading-none pb-0.5">···</span>
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="px-4 mt-4 space-y-3 pb-8">
        {/* Environment card */}
        <div className="bg-[#131C2E] rounded-2xl p-5">
          <p className="text-[#9CA3AF] text-sm">Environment</p>
          <p className="text-white font-bold text-xl mt-1">🟢 Optimal</p>
        </div>

        {/* Temperature + Humidity */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-white font-bold text-2xl">24.3 °C</p>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-[#9CA3AF] text-xs">Temperature</p>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3.5L8.5 7L5 10.5" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-white font-bold text-2xl">65%</p>
            <p className="text-[#9CA3AF] text-xs mt-1">Humidity</p>
          </div>
        </div>

        {/* CO2 + spacer */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-white font-bold text-2xl">800 ppm</p>
            <div className="flex items-center gap-1 mt-1">
              <p className="text-[#9CA3AF] text-xs">CO₂</p>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 3.5L8.5 7L5 10.5" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {/* Empty spacer card for visual balance */}
          <div className="bg-[#131C2E] rounded-2xl p-4 opacity-0 pointer-events-none" aria-hidden="true" />
        </div>

        {/* Light row */}
        <div className="bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[#9CA3AF] text-sm">Light</span>
          <div className="flex items-center gap-1">
            <span className="text-white text-sm">✨ 60%</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Irrigation row */}
        <div className="bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[#9CA3AF] text-sm">Irrigation</span>
          <div className="flex items-center gap-1">
            <span className="text-[#4ADE80] text-sm">🟢 Active</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Ventilation row */}
        <div className="bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
          <span className="text-[#9CA3AF] text-sm">Ventilation</span>
          <span className="text-[#4ADE80] text-sm">🟢 Auto</span>
        </div>
      </div>
    </div>
  );
}
