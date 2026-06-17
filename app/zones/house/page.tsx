import Link from "next/link";

export default function HousePage() {
  return (
    <div className="min-h-screen bg-[#0B111E]">
      {/* Top Image Section */}
      <div className="h-96 relative overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0D0D15 100%)",
          }}
        />

        {/* Floor plan SVG */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 390 384"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer walls */}
          <rect
            x="40"
            y="60"
            width="310"
            height="270"
            rx="4"
            fill="#0F0F1A"
            stroke="#2A2A3A"
            strokeWidth="3"
          />

          {/* Living Room (left large room) */}
          <rect x="40" y="60" width="170" height="165" fill="#111120" stroke="#2A2A3A" strokeWidth="1.5" />
          {/* Kitchen (right top room) */}
          <rect x="210" y="60" width="140" height="110" fill="#0F0F1E" stroke="#2A2A3A" strokeWidth="1.5" />
          {/* Bedroom (right middle) */}
          <rect x="210" y="170" width="140" height="90" fill="#111120" stroke="#2A2A3A" strokeWidth="1.5" />
          {/* Bathroom (small bottom right) */}
          <rect x="270" y="260" width="80" height="70" fill="#0E0E1C" stroke="#2A2A3A" strokeWidth="1.5" />
          {/* Hallway / entry (bottom left) */}
          <rect x="40" y="225" width="170" height="105" fill="#0D0D18" stroke="#2A2A3A" strokeWidth="1.5" />

          {/* Door openings (gaps in walls) */}
          <line x1="130" y1="225" x2="150" y2="225" stroke="#0D0D15" strokeWidth="4" />
          <line x1="210" y1="140" x2="210" y2="165" stroke="#0D0D15" strokeWidth="4" />
          <line x1="270" y1="270" x2="270" y2="290" stroke="#0D0D15" strokeWidth="4" />

          {/* Door arc hints */}
          <path d="M130,225 Q130,210 145,215" fill="none" stroke="#2A2A3A" strokeWidth="1" strokeDasharray="3,2" />
          <path d="M210,140 Q225,140 220,155" fill="none" stroke="#2A2A3A" strokeWidth="1" strokeDasharray="3,2" />

          {/* Room labels */}
          <text x="80" y="145" fill="#3A3A55" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">Living Room</text>
          <text x="230" y="110" fill="#3A3A55" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">Kitchen</text>
          <text x="232" y="218" fill="#3A3A55" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">Bedroom</text>
          <text x="280" y="300" fill="#3A3A55" fontSize="9" fontFamily="system-ui, sans-serif" fontWeight="500">Bath</text>
          <text x="72" y="285" fill="#3A3A55" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="500">Hallway</text>

          {/* Furniture hints - sofa in living room */}
          <rect x="55" y="180" width="60" height="25" rx="4" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />
          <rect x="55" y="175" width="12" height="30" rx="3" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />
          <rect x="103" y="175" width="12" height="30" rx="3" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />

          {/* Kitchen counter */}
          <rect x="215" y="66" width="130" height="18" rx="2" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />
          <rect x="215" y="66" width="18" height="18" rx="2" fill="#1A1A30" stroke="#252535" strokeWidth="1" />

          {/* Bed in bedroom */}
          <rect x="222" y="182" width="55" height="65" rx="5" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />
          <rect x="222" y="182" width="55" height="16" rx="5" fill="#202035" stroke="#252535" strokeWidth="1" />

          {/* Toilet hint */}
          <ellipse cx="305" cy="310" rx="12" ry="14" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />
          <rect x="293" y="288" width="24" height="14" rx="3" fill="#1A1A2E" stroke="#252535" strokeWidth="1" />

          {/* === Icon indicators === */}

          {/* Home icon — living room */}
          <g transform="translate(100, 100)">
            <circle r="14" fill="#1E3A5F" />
            <path d="M0,-7 L8,1 L8,7 L-8,7 L-8,1 Z" fill="none" stroke="#4A9EFF" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M-10,1 L0,-8 L10,1" fill="none" stroke="#4A9EFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="-3" y="2" width="6" height="5" rx="1" fill="#4A9EFF" opacity="0.7" />
          </g>

          {/* Camera icon — hallway */}
          <g transform="translate(115, 262)">
            <circle r="13" fill="#1E3A2A" />
            <rect x="-7" y="-5" width="14" height="10" rx="2" fill="none" stroke="#4ADE80" strokeWidth="1.4" />
            <polygon points="7,-3 12,0 7,3" fill="#4ADE80" />
            <circle cx="-1" cy="0" r="2.5" fill="#4ADE80" opacity="0.7" />
          </g>

          {/* Bell icon — bedroom */}
          <g transform="translate(340, 200)">
            <circle r="13" fill="#3A2A1A" />
            <path d="M0,-7 C-5,-7 -7,-3 -7,2 L-7,5 L7,5 L7,2 C7,-3 5,-7 0,-7 Z" fill="none" stroke="#FBBF24" strokeWidth="1.4" />
            <line x1="-2" y1="5" x2="2" y2="5" stroke="#FBBF24" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="0" y1="-7" x2="0" y2="-9" stroke="#FBBF24" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="0" cy="7" r="1.5" fill="#FBBF24" />
          </g>
        </svg>

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-10 z-10">
          <Link
            href="/zones"
            className="flex items-center gap-2 text-white font-medium text-base"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            House
          </Link>

          {/* Right icon buttons */}
          <div className="flex items-center gap-2">
            {/* Document icon */}
            <button className="bg-[#1A2438] rounded-full w-9 h-9 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </button>
            {/* Mail icon */}
            <button className="bg-[#1A2438] rounded-full w-9 h-9 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </button>
            {/* Grid icon */}
            <button className="bg-[#1A2438] rounded-full w-9 h-9 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-[#131C2E] rounded-t-3xl pt-5 pb-10 px-5 -mt-4 relative z-20">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-bold">Living Room</h1>
          <button className="text-[#9CA3AF]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>

        {/* Status */}
        <p className="text-[#4ADE80] text-sm mt-1">22°C &nbsp; Good</p>

        {/* 2x2 Control Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* Lights */}
          <button className="bg-[#1A2438] rounded-2xl p-4 flex flex-col items-start">
            <div className="mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="3" />
                <path d="M17.66 5.34l-1.41 1.41" />
                <line x1="21" y1="12" x2="19" y2="12" />
                <path d="M17.66 18.66l-1.41-1.41" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <path d="M6.34 18.66l1.41-1.41" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <path d="M6.34 5.34l1.41 1.41" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Lights</span>
            <span className="text-[#4ADE80] text-sm">On</span>
          </button>

          {/* Air Purifier */}
          <button className="bg-[#1A2438] rounded-2xl p-4 flex flex-col items-start">
            <div className="mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a5 5 0 0 1 5 5c0 2-1 3.5-2.5 4.5" />
                <path d="M12 2a5 5 0 0 0-5 5c0 2 1 3.5 2.5 4.5" />
                <path d="M7 11.5C5 13 4 15 4 17a8 8 0 0 0 16 0c0-2-1-4-3-5.5" />
                <circle cx="12" cy="17" r="2" fill="#9CA3AF" opacity="0.4" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Air Purifier</span>
            <span className="text-[#4ADE80] text-sm">On</span>
          </button>

          {/* Humidity */}
          <button className="bg-[#1A2438] rounded-2xl p-4 flex flex-col items-start">
            <div className="mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C12 2 6 10 6 15a6 6 0 0 0 12 0C18 10 12 2 12 2z" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Humidity</span>
            <span className="text-cyan-400 text-sm">45%</span>
          </button>

          {/* Camera */}
          <button className="bg-[#1A2438] rounded-2xl p-4 flex flex-col items-start">
            <div className="mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 7l-7 5 7 5V7z" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
            </div>
            <span className="text-white text-sm font-medium">Camera</span>
            <span className="text-white text-sm">3 Active</span>
          </button>
        </div>
      </div>
    </div>
  );
}
