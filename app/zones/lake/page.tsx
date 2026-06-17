import Link from "next/link";

export default function LakePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B111E]">
      {/* Top Image Section */}
      <div className="h-96 relative overflow-hidden">
        {/* Real lake aerial photo */}
        <img
          src="https://images.unsplash.com/photo-1536663094815-aa7e99627504?w=800&q=80&fit=crop&auto=format"
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

        {/* Neon glow over lake */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "50%",
            top: "72%",
            transform: "translate(-50%, -50%)",
            width: "260px",
            height: "100px",
            boxShadow:
              "0 0 40px 15px rgba(0, 200, 255, 0.28), 0 0 80px 30px rgba(0, 160, 220, 0.14)",
          }}
        />

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-10 z-10">
          <Link href="/zones" className="flex items-center gap-2 text-white">
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
          </Link>
          <span className="text-white font-semibold text-base">My Property ↓</span>
          <button className="bg-[#1A2438] rounded-full w-10 h-10 flex items-center justify-center text-white text-lg">
            •••
          </button>
        </div>

        {/* Center badge */}
        <div
          className="absolute z-10"
          style={{ left: "50%", top: "52%", transform: "translate(-50%, -50%)" }}
        >
          <div className="bg-[#0D4A5A] rounded-xl p-3 flex items-center justify-center"
            style={{ boxShadow: "0 0 20px 6px rgba(0,200,255,0.25)" }}>
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Water drop icon */}
              <path
                d="M12 2C12 2 5 10 5 15a7 7 0 0 0 14 0C19 10 12 2 12 2z"
                fill="#00D4F5"
                opacity="0.9"
              />
              <path
                d="M12 8c0 0-3.5 5-3.5 8a3.5 3.5 0 0 0 7 0C15.5 13 12 8 12 8z"
                fill="#082540"
                opacity="0.35"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-[#131C2E] rounded-t-3xl pt-5 pb-10 px-5 -mt-4 relative z-20">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">Lake</h1>
          <button className="text-[#9CA3AF] text-xl">•••</button>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 mt-1">
          <span className="w-2 h-2 rounded-full bg-[#4ADE80] inline-block" />
          <span className="text-[#4ADE80] text-sm">Excellent</span>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1A2438] mt-3 mb-3" />

        {/* Stats */}
        <div className="space-y-3">
          {[
            { label: "Water Quality", value: "Excellent" },
            { label: "Temperature", value: "18.4 °C" },
            { label: "Depth (avg)", value: "2.8 m" },
            { label: "Volume", value: "1,250 m³" },
            { label: "Fish", value: "Healthy" },
            { label: "Last Maintenance", value: "5 days ago" },
          ].map((row) => (
            <div key={row.label} className="flex justify-between items-center">
              <span className="text-[#9CA3AF] text-sm">{row.label}</span>
              <span className="text-white text-sm font-medium">{row.value}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-2 mt-6">
          {/* History */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[#9CA3AF] text-xs">History</span>
          </button>

          {/* Tasks */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
            <span className="text-[#9CA3AF] text-xs">Tasks</span>
          </button>

          {/* Documents */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className="text-[#9CA3AF] text-xs">Documents</span>
          </button>

          {/* Sensors */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <circle cx="12" cy="20" r="1" fill="#9CA3AF" />
            </svg>
            <span className="text-[#9CA3AF] text-xs">Sensors</span>
          </button>
        </div>
      </div>
    </div>
  );
}
