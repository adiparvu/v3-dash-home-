import Link from "next/link";

export default function OrchardPage() {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const healthScore = 88;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="bg-[#0B111E] min-h-screen">
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <Link href="/zones" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-sm font-medium">Orchard / Apple Orchard</span>
        </Link>
        <button className="w-8 h-8 rounded-full bg-[#1C2A40] flex items-center justify-center">
          <span className="text-[#9CA3AF] text-lg leading-none pb-0.5">···</span>
        </button>
      </div>

      {/* Background image area */}
      <div className="h-72 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1508694437592-68d3e04f2518?w=800&q=80&fit=crop&auto=format"
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 50%, rgba(11,17,30,0.85) 100%)",
          }}
        />
      </div>

      {/* Two side-by-side cards */}
      <div className="mx-4 mt-4 grid grid-cols-2 gap-3">
        {/* Health Score card */}
        <div className="bg-[#131C2E] rounded-2xl p-4 flex flex-col items-center">
          <span className="text-[#9CA3AF] text-xs mb-2">Health Score</span>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#1C2A40" strokeWidth="7" />
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#4ADE80"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 50 50)"
            />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">
              {healthScore}
            </text>
          </svg>
        </div>

        {/* Projected Yield card */}
        <div className="bg-[#131C2E] rounded-2xl p-4 flex flex-col justify-center">
          <span className="text-[#9CA3AF] text-xs">Projected Yield</span>
          <span className="text-white font-bold text-3xl mt-1">12.4</span>
          <span className="text-[#9CA3AF] text-sm">tons</span>
        </div>
      </div>

      {/* Next Harvest card */}
      <div className="mx-4 mt-3 bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
        <div>
          <p className="text-[#9CA3AF] text-xs">Next Harvest</p>
          <p className="text-white font-bold text-xl mt-0.5">23 Days</p>
        </div>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 5L12.5 10L7.5 15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Irrigation + Flowering cards */}
      <div className="mx-4 mt-3 grid grid-cols-2 gap-3">
        <div className="bg-[#131C2E] rounded-2xl p-4">
          <p className="text-[#9CA3AF] text-xs mb-1">Irrigation</p>
          <p className="text-[#F59E0B] font-semibold text-base">Optimal</p>
        </div>
        <div className="bg-[#131C2E] rounded-2xl p-4">
          <p className="text-[#9CA3AF] text-xs mb-1">Flowering</p>
          <p className="text-[#4ADE80] font-semibold text-base">75%</p>
        </div>
      </div>

      {/* Disease Risk card */}
      <div className="mx-4 mt-3 mb-8 bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
        <span className="text-[#9CA3AF] text-sm">Disease Risk</span>
        <span className="text-[#4ADE80] font-semibold">Low</span>
      </div>
    </div>
  );
}
