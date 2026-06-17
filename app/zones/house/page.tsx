import Link from "next/link";

export default function HousePage() {
  return (
    <div className="min-h-screen bg-[#0B111E]">
      {/* Top Image Section */}
      <div className="h-96 relative overflow-hidden">
        {/* Real aerial house photo */}
        <img
          src="https://images.unsplash.com/photo-1656646549863-fdea73acf3df?w=800&q=80&fit=crop&auto=format"
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 50%, rgba(11,17,30,0.9) 100%)",
          }}
        />

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
