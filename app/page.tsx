import StatusBar from "./components/StatusBar";
import BottomNav from "./components/BottomNav";

export default function Home() {
  const circumference = 2 * Math.PI * 52; // ≈ 326.7
  const progress = 0.87;
  const strokeDashoffset = circumference * (1 - progress); // ≈ 42.5

  return (
    <main className="min-h-screen bg-[#0B111E]">
      <div className="pb-24 overflow-y-auto">
        {/* Status Bar */}
        <StatusBar />

        {/* Header Row */}
        <div className="px-5 pt-2 flex justify-between items-center">
          <div className="flex items-center gap-1">
            <span className="text-white font-bold text-[26px] leading-tight">
              My Property
            </span>
            <span className="text-white text-lg mt-0.5">↓</span>
          </div>
          <button className="w-10 h-10 rounded-full bg-[#131C2E] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2.5C4 2.22386 4.22386 2 4.5 2H11.5L16 6.5V17.5C16 17.7761 15.7761 18 15.5 18H4.5C4.22386 18 4 17.7761 4 17.5V2.5Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M11.5 2V6.5H16" stroke="#9CA3AF" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M7 10H13" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 13H11" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Live Indicator */}
        <div className="px-5 mt-1 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] inline-block" />
          <span className="text-[#4ADE80] text-xs font-medium">Live</span>
        </div>

        {/* Hero Property Image */}
        <div
          className="w-full h-56 mt-3 relative overflow-hidden"
          style={{ background: "linear-gradient(160deg, #0D2B1A 0%, #163B20 20%, #0E3028 40%, #0A2035 60%, #0D1E2D 80%, #0B1525 100%)" }}
        >
          <svg viewBox="0 0 390 224" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="390" height="224" fill="url(#skyGrad)" />
            <circle cx="45" cy="30" r="1" fill="#FFFFFF" opacity="0.6" />
            <circle cx="120" cy="18" r="0.8" fill="#FFFFFF" opacity="0.5" />
            <circle cx="200" cy="12" r="1.2" fill="#FFFFFF" opacity="0.7" />
            <circle cx="280" cy="22" r="0.8" fill="#FFFFFF" opacity="0.4" />
            <circle cx="340" cy="40" r="1" fill="#FFFFFF" opacity="0.5" />
            <circle cx="70" cy="55" r="0.6" fill="#FFFFFF" opacity="0.3" />
            <circle cx="310" cy="15" r="0.6" fill="#FFFFFF" opacity="0.5" />
            <circle cx="330" cy="38" r="14" fill="#1A3A50" />
            <circle cx="338" cy="33" r="11" fill="#0D1E2D" />
            <ellipse cx="195" cy="170" rx="250" ry="60" fill="#0C2218" />
            <ellipse cx="80" cy="175" rx="130" ry="50" fill="#102A1E" />
            <ellipse cx="320" cy="172" rx="140" ry="48" fill="#0F2820" />
            <ellipse cx="195" cy="185" rx="160" ry="35" fill="#0B2A3A" />
            <ellipse cx="195" cy="183" rx="155" ry="28" fill="#0D3040" opacity="0.8" />
            <ellipse cx="175" cy="183" rx="40" ry="4" fill="#164255" opacity="0.5" />
            <ellipse cx="230" cy="186" rx="25" ry="3" fill="#164255" opacity="0.3" />
            <ellipse cx="55" cy="145" rx="38" ry="42" fill="#0D2B1A" />
            <ellipse cx="50" cy="150" rx="30" ry="35" fill="#112E1C" />
            <ellipse cx="68" cy="148" rx="25" ry="30" fill="#0F2A1A" />
            <ellipse cx="20" cy="162" rx="22" ry="28" fill="#0D2B1A" />
            <ellipse cx="90" cy="158" rx="20" ry="25" fill="#102B1C" />
            <ellipse cx="130" cy="152" rx="30" ry="35" fill="#0E2A1A" />
            <ellipse cx="145" cy="156" rx="22" ry="28" fill="#112E1C" />
            <ellipse cx="340" cy="148" rx="38" ry="40" fill="#0D2B1A" />
            <ellipse cx="352" cy="153" rx="28" ry="33" fill="#112E1C" />
            <ellipse cx="325" cy="150" rx="26" ry="30" fill="#0F2A1A" />
            <ellipse cx="375" cy="160" rx="20" ry="26" fill="#0D2A1A" />
            <ellipse cx="300" cy="155" rx="22" ry="28" fill="#102B1C" />
            <ellipse cx="255" cy="154" rx="28" ry="32" fill="#0E2A1A" />
            <ellipse cx="268" cy="158" rx="20" ry="26" fill="#112E1C" />
            <rect x="0" y="200" width="390" height="24" fill="#091520" />
            <ellipse cx="195" cy="200" rx="250" ry="12" fill="#091520" />
            <ellipse cx="10" cy="195" rx="18" ry="22" fill="#071018" />
            <ellipse cx="375" cy="193" rx="20" ry="24" fill="#071018" />
            <ellipse cx="155" cy="200" rx="15" ry="18" fill="#081218" />
            <ellipse cx="235" cy="202" rx="14" ry="16" fill="#081218" />
            <text x="195" y="100" textAnchor="middle" fill="#FFFFFF" fillOpacity="0.04" fontSize="36" fontWeight="bold" letterSpacing="6">PRVIO EARTH</text>
            <defs>
              <linearGradient id="skyGrad" x1="0" y1="0" x2="390" y2="224" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0D2B1A" />
                <stop offset="20%" stopColor="#163B20" />
                <stop offset="40%" stopColor="#0E3028" />
                <stop offset="60%" stopColor="#0A2035" />
                <stop offset="80%" stopColor="#0D1E2D" />
                <stop offset="100%" stopColor="#0B1525" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Property Health Card */}
        <div className="mx-4 mt-4 bg-[#131C2E] rounded-2xl p-4 flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[#9CA3AF] text-xs mb-1">Property Health</span>
            <div className="flex items-baseline gap-1">
              <span className="text-white font-bold text-5xl leading-none">87</span>
              <span className="text-[#9CA3AF] text-sm">/100</span>
            </div>
            <span className="text-[#4ADE80] text-xs mt-1">Very Good</span>
          </div>
          <div className="flex justify-end">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4ADE80" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="52" fill="none" stroke="#1A2438" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke="url(#progressGrad)" strokeWidth="8"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={`${strokeDashoffset}`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="65" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold">87</text>
            </svg>
          </div>
        </div>

        {/* Stats Row */}
        <div className="mx-4 mt-3 grid grid-cols-4 gap-2">
          <div className="bg-[#131C2E] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-lg leading-tight">26</div>
            <div className="text-[#9CA3AF] text-xs mt-0.5">Zones</div>
          </div>
          <div className="bg-[#131C2E] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-lg leading-tight">142</div>
            <div className="text-[#9CA3AF] text-xs mt-0.5">Objects</div>
          </div>
          <div className="bg-[#131C2E] rounded-xl p-3 text-center">
            <div className="text-white font-bold text-lg leading-tight">7</div>
            <div className="text-[#9CA3AF] text-xs mt-0.5">Tasks</div>
          </div>
          <div className="bg-[#131C2E] rounded-xl p-3 text-center">
            <div className="text-[#F97316] font-bold text-lg leading-tight">3</div>
            <div className="text-[#9CA3AF] text-xs mt-0.5">Alerts</div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </main>
  );
}
