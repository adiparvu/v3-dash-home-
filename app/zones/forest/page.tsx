import Link from "next/link";

export default function ForestPage() {
  const radius = 57;
  const circumference = 2 * Math.PI * radius;
  const healthScore = 91;
  const offset = circumference - (healthScore / 100) * circumference;

  return (
    <div className="bg-[#0B111E] min-h-screen">
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <Link href="/zones" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-sm font-medium">Forest / Mixed Forest</span>
        </Link>
        <button className="w-8 h-8 rounded-full bg-[#1C2A40] flex items-center justify-center">
          <span className="text-[#9CA3AF] text-lg leading-none pb-0.5">···</span>
        </button>
      </div>

      {/* Background area */}
      <div
        className="h-64 relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #020802 0%, #051008 40%, #030A04 100%)",
        }}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 360 256"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Dense canopy layer — large overlapping blobs */}
          <ellipse cx="50" cy="60" rx="45" ry="38" fill="#071A05" />
          <ellipse cx="110" cy="45" rx="55" ry="42" fill="#0A2108" />
          <ellipse cx="180" cy="55" rx="50" ry="40" fill="#071A05" />
          <ellipse cx="250" cy="48" rx="52" ry="38" fill="#091F07" />
          <ellipse cx="320" cy="60" rx="44" ry="36" fill="#071A05" />

          <ellipse cx="30" cy="110" rx="40" ry="32" fill="#0C2609" />
          <ellipse cx="90" cy="100" rx="50" ry="40" fill="#0E2A0A" />
          <ellipse cx="165" cy="108" rx="55" ry="42" fill="#0A2208" />
          <ellipse cx="235" cy="100" rx="48" ry="38" fill="#0D280A" />
          <ellipse cx="300" cy="110" rx="46" ry="36" fill="#0B2408" />
          <ellipse cx="355" cy="105" rx="38" ry="32" fill="#0A2208" />

          {/* Mid layer lighter canopy spots */}
          <ellipse cx="70" cy="148" rx="38" ry="28" fill="#122E0E" />
          <ellipse cx="150" cy="155" rx="44" ry="30" fill="#14320F" />
          <ellipse cx="230" cy="148" rx="40" ry="28" fill="#122E0E" />
          <ellipse cx="310" cy="152" rx="36" ry="26" fill="#133010" />

          {/* Lower layer ground cover */}
          <ellipse cx="40" cy="195" rx="35" ry="22" fill="#0C2609" />
          <ellipse cx="120" cy="200" rx="42" ry="24" fill="#0E2A0A" />
          <ellipse cx="200" cy="195" rx="40" ry="22" fill="#0B2408" />
          <ellipse cx="280" cy="200" rx="38" ry="24" fill="#0D280A" />
          <ellipse cx="350" cy="195" rx="32" ry="20" fill="#0C2609" />

          {/* Lighter canopy highlight spots */}
          <circle cx="100" cy="72" r="18" fill="#1A4512" opacity="0.6" />
          <circle cx="200" cy="65" r="15" fill="#1C4A13" opacity="0.5" />
          <circle cx="280" cy="78" r="16" fill="#194011" opacity="0.55" />
          <circle cx="155" cy="130" r="14" fill="#1A4212" opacity="0.5" />
          <circle cx="255" cy="125" r="12" fill="#193E11" opacity="0.45" />
        </svg>
      </div>

      {/* Content below background */}
      <div className="mx-4 mt-4 pb-8">
        <div className="flex gap-4 items-start">
          {/* Health Score — large ring */}
          <div className="flex flex-col items-center">
            <span className="text-[#9CA3AF] text-xs mb-2">Health Score</span>
            <svg width="130" height="130" viewBox="0 0 130 130">
              <circle cx="65" cy="65" r={radius} fill="none" stroke="#1C2A40" strokeWidth="8" />
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke="#4ADE80"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform="rotate(-90 65 65)"
              />
              <text x="65" y="70" textAnchor="middle" fill="white" fontSize="26" fontWeight="bold">
                {healthScore}
              </text>
            </svg>
          </div>

          {/* Right side stacked cards */}
          <div className="flex-1 space-y-2">
            <div className="bg-[#131C2E] rounded-xl p-3">
              <p className="text-[#9CA3AF] text-xs">Trees</p>
              <p className="text-white font-bold text-xl">2,543</p>
            </div>
            <div className="bg-[#131C2E] rounded-xl p-3">
              <p className="text-[#9CA3AF] text-xs">Carbon Storage</p>
              <p className="text-white font-semibold">125.4 tCO₂</p>
            </div>
            <div className="bg-[#131C2E] rounded-xl p-3">
              <p className="text-[#9CA3AF] text-xs">Biomass</p>
              <p className="text-white font-semibold">320.7 t</p>
            </div>
            <div className="bg-[#131C2E] rounded-xl p-3">
              <p className="text-[#9CA3AF] text-xs">Biodiversity</p>
              <p className="text-[#4ADE80] font-semibold">High 🌿</p>
            </div>
            <div className="bg-[#131C2E] rounded-xl p-3">
              <p className="text-[#9CA3AF] text-xs">Risk Level</p>
              <p className="text-[#F59E0B] font-semibold">Low</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
