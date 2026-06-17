import Link from "next/link";

export default function LakePage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0B111E]">
      {/* Top Image Section */}
      <div className="h-96 relative overflow-hidden">
        {/* Gradient background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #051520 0%, #072030 30%, #0A3040 60%, #0D3550 80%, #082540 100%)",
          }}
        />

        {/* SVG Landscape */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 390 384"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Far background mountains */}
          <polygon points="0,240 60,160 130,220 200,140 270,200 340,150 390,200 390,384 0,384" fill="#061825" />

          {/* Mid mountains */}
          <polygon points="0,270 80,200 160,250 240,190 320,240 390,210 390,384 0,384" fill="#081F2E" />

          {/* Foreground hills */}
          <polygon points="0,300 100,250 200,280 300,255 390,270 390,384 0,384" fill="#0A2535" />

          {/* Lake ellipse */}
          <ellipse cx="195" cy="310" rx="130" ry="50" fill="#0D4A5A" opacity="0.85" />

          {/* Lake inner glow */}
          <ellipse cx="195" cy="308" rx="110" ry="40" fill="#0F5A6E" opacity="0.5" />

          {/* Lake highlight shimmer */}
          <ellipse cx="185" cy="300" rx="50" ry="12" fill="#1A8FA8" opacity="0.18" />

          {/* Water reflection lines */}
          <line x1="120" y1="310" x2="270" y2="310" stroke="#1ABDD4" strokeWidth="0.5" opacity="0.25" />
          <line x1="135" y1="318" x2="255" y2="318" stroke="#1ABDD4" strokeWidth="0.5" opacity="0.15" />
          <line x1="150" y1="325" x2="240" y2="325" stroke="#1ABDD4" strokeWidth="0.5" opacity="0.1" />

          {/* Trees - left cluster */}
          <circle cx="68" cy="278" r="18" fill="#061E14" />
          <circle cx="88" cy="270" r="22" fill="#072418" />
          <circle cx="54" cy="285" r="14" fill="#061E14" />
          <circle cx="108" cy="275" r="16" fill="#082A1C" />
          <rect x="84" y="292" width="6" height="18" fill="#04120C" />
          <rect x="65" y="296" width="5" height="14" fill="#04120C" />

          {/* Trees - right cluster */}
          <circle cx="322" cy="275" r="20" fill="#061E14" />
          <circle cx="302" cy="270" r="16" fill="#072418" />
          <circle cx="340" cy="280" r="18" fill="#082A1C" />
          <circle cx="358" cy="272" r="15" fill="#061E14" />
          <rect x="319" y="294" width="6" height="18" fill="#04120C" />
          <rect x="338" y="297" width="5" height="14" fill="#04120C" />

          {/* Small trees near lake */}
          <circle cx="140" cy="290" r="12" fill="#061E14" />
          <circle cx="250" cy="288" r="14" fill="#072418" />
          <circle cx="158" cy="294" r="9" fill="#082A1C" />
          <circle cx="234" cy="292" r="10" fill="#061E14" />

          {/* Stars */}
          <circle cx="50" cy="40" r="1" fill="#FFFFFF" opacity="0.6" />
          <circle cx="120" cy="25" r="1.2" fill="#FFFFFF" opacity="0.5" />
          <circle cx="200" cy="50" r="0.8" fill="#FFFFFF" opacity="0.7" />
          <circle cx="280" cy="30" r="1" fill="#FFFFFF" opacity="0.55" />
          <circle cx="350" cy="45" r="1.2" fill="#FFFFFF" opacity="0.6" />
          <circle cx="170" cy="70" r="0.8" fill="#FFFFFF" opacity="0.4" />
          <circle cx="310" cy="65" r="1" fill="#FFFFFF" opacity="0.5" />
          <circle cx="80" cy="80" r="0.8" fill="#FFFFFF" opacity="0.45" />
        </svg>

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
