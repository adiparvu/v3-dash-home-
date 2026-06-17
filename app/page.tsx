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
        <div className="w-full h-56 mt-3 relative overflow-hidden">
          <img
            src="/images/hero-overview.jpg"
            alt=""
            draggable={false}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to bottom, rgba(11,17,30,0.3) 0%, rgba(11,17,30,0.1) 50%, rgba(11,17,30,0.8) 100%)",
            }}
          />
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
