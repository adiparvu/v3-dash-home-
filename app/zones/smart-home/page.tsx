import Link from "next/link";

export default function SmartHomePage() {
  return (
    <div className="bg-[#0B111E] min-h-screen">
      {/* Header */}
      <div className="px-5 pt-4 flex items-center justify-between">
        <Link href="/zones" className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-white text-sm font-medium">Smart Home / Overview</span>
        </Link>
        <button className="w-8 h-8 rounded-full bg-[#1C2A40] flex items-center justify-center">
          <span className="text-[#9CA3AF] text-lg leading-none pb-0.5">···</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="px-4 space-y-3 mt-4 pb-8">
        {/* All Systems card */}
        <div
          className="bg-[#131C2E] rounded-2xl p-5 relative overflow-hidden h-32 flex flex-col justify-between"
          style={{
            background: "linear-gradient(135deg, #0A1A2E 0%, #0D2040 100%)",
          }}
        >
          <div>
            <p className="text-[#9CA3AF] text-sm">All Systems</p>
            <p className="text-white font-bold text-xl mt-1">🟢 Good</p>
          </div>
          <div className="absolute bottom-4 right-4">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Energy Today + Active Devices */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">Energy Today</p>
            <p className="text-white font-bold text-xl">8.4 kWh</p>
            <span className="text-lg mt-1 block">💧</span>
          </div>
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">Active Devices</p>
            <div className="flex items-center gap-1">
              <p className="text-white font-bold text-xl">48</p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5">
                <path d="M6 4L10 8L6 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Security card */}
        <div className="bg-[#131C2E] rounded-2xl p-5 h-32 flex flex-col justify-center">
          <p className="text-[#9CA3AF] text-sm">Security</p>
          <p className="text-white font-bold text-xl mt-1">🔒 All Secure</p>
        </div>

        {/* Climate + Lighting */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">Climate</p>
            <p className="text-white font-bold text-xl">22.5 °C</p>
          </div>
          <div className="bg-[#131C2E] rounded-2xl p-4">
            <p className="text-[#9CA3AF] text-xs mb-1">Lighting</p>
            <div className="flex items-center gap-1">
              <p className="text-white font-bold text-xl">18 On</p>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5">
                <path d="M6 4L10 8L6 12" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
