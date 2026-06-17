"use client";

import Link from "next/link";

export default function FicusTreePage() {
  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col pb-8">

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-center">
          <Link
            href="/objects"
            className="flex items-center text-white"
            aria-label="Back to Objects"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 15L7.5 10L12.5 5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <span className="text-white font-medium text-sm ml-2">
            Ficus Tree
          </span>
          <span className="text-[#6B7280] text-sm ml-1">/ Living Room</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Bell icon */}
          <button
            className="w-9 h-9 rounded-full bg-[#131C2E] flex items-center justify-center"
            aria-label="Notifications"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5C5.515 1.5 3.5 3.515 3.5 6V9.5L2 11V12H6C6 13.105 6.895 14 8 14C9.105 14 10 13.105 10 12H14V11L12.5 9.5V6C12.5 3.515 10.485 1.5 8 1.5Z"
                stroke="#9CA3AF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {/* Shield icon */}
          <button
            className="w-9 h-9 rounded-full bg-[#131C2E] flex items-center justify-center"
            aria-label="Security"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 1.5L2.5 4V8C2.5 11.05 4.9 13.9 8 14.5C11.1 13.9 13.5 11.05 13.5 8V4L8 1.5Z"
                stroke="#9CA3AF"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 8L7 9.5L10.5 6"
                stroke="#9CA3AF"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Plant image area */}
      <div
        className="h-64 relative mx-4 mt-2 rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #0A1A0A 0%, #0E2510 30%, #081808 100%)",
        }}
      >
        <svg
          viewBox="0 0 360 256"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soil / pot base */}
          <ellipse cx="180" cy="238" rx="38" ry="8" fill="#1A0F05" />
          <rect x="158" y="220" width="44" height="22" rx="4" fill="#2A1A08" />
          <rect x="153" y="215" width="54" height="10" rx="3" fill="#3A2410" />

          {/* Main trunk */}
          <path
            d="M176 215 Q178 180 180 140 Q182 100 180 70"
            stroke="#3D2510"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch left 1 */}
          <path
            d="M179 155 Q155 145 135 130"
            stroke="#3D2510"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch right 1 */}
          <path
            d="M180 140 Q205 128 225 118"
            stroke="#3D2510"
            strokeWidth="6"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch left 2 */}
          <path
            d="M180 110 Q155 95 132 88"
            stroke="#3D2510"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch right 2 */}
          <path
            d="M180 100 Q208 88 228 80"
            stroke="#3D2510"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch up-left */}
          <path
            d="M180 80 Q162 62 148 50"
            stroke="#3D2510"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Branch up-right */}
          <path
            d="M180 72 Q198 56 212 46"
            stroke="#3D2510"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Large leaf clusters - dark green */}
          <ellipse cx="118" cy="118" rx="38" ry="30" fill="#0D3010" />
          <ellipse cx="108" cy="110" rx="28" ry="22" fill="#0F3A12" />
          <ellipse cx="135" cy="105" rx="32" ry="24" fill="#0E3511" />

          <ellipse cx="238" cy="108" rx="36" ry="28" fill="#0D3010" />
          <ellipse cx="248" cy="100" rx="26" ry="20" fill="#0F3A12" />
          <ellipse cx="225" cy="96" rx="30" ry="22" fill="#0E3511" />

          <ellipse cx="130" cy="76" rx="32" ry="26" fill="#0E3511" />
          <ellipse cx="115" cy="68" rx="24" ry="18" fill="#0F3A12" />

          <ellipse cx="220" cy="68" rx="30" ry="24" fill="#0E3511" />
          <ellipse cx="235" cy="60" rx="22" ry="18" fill="#0F3A12" />

          {/* Top center cluster */}
          <ellipse cx="178" cy="48" rx="36" ry="28" fill="#0D3010" />
          <ellipse cx="165" cy="38" rx="24" ry="20" fill="#0F3A12" />
          <ellipse cx="192" cy="36" rx="26" ry="20" fill="#112E14" />
          <ellipse cx="178" cy="30" rx="20" ry="16" fill="#143318" />

          {/* Accent lighter leaves */}
          <ellipse cx="145" cy="92" rx="14" ry="10" fill="#1A5220" opacity="0.9" />
          <ellipse cx="215" cy="82" rx="12" ry="9" fill="#1A5220" opacity="0.9" />
          <ellipse cx="162" cy="52" rx="10" ry="8" fill="#1C5C22" opacity="0.85" />
          <ellipse cx="198" cy="44" rx="10" ry="8" fill="#1C5C22" opacity="0.85" />
          <ellipse cx="125" cy="56" rx="9" ry="7" fill="#1A5220" opacity="0.8" />
          <ellipse cx="235" cy="50" rx="9" ry="7" fill="#1A5220" opacity="0.8" />

          {/* Small bright leaf highlights */}
          <ellipse cx="138" cy="86" rx="6" ry="4" fill="#2A7032" opacity="0.7" />
          <ellipse cx="224" cy="75" rx="6" ry="4" fill="#2A7032" opacity="0.7" />
          <ellipse cx="175" cy="22" rx="8" ry="5" fill="#2A7032" opacity="0.6" />

          {/* Drooping small leaves */}
          <path d="M130 135 Q118 148 112 155" stroke="#0F3A12" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="109" cy="158" rx="9" ry="6" fill="#0F3A12" transform="rotate(-20 109 158)" />
          <path d="M232 122 Q243 134 248 142" stroke="#0F3A12" strokeWidth="3" strokeLinecap="round" fill="none" />
          <ellipse cx="251" cy="145" rx="9" ry="6" fill="#0F3A12" transform="rotate(20 251 145)" />

          {/* Ground shadow */}
          <ellipse cx="180" cy="240" rx="60" ry="6" fill="#060E06" opacity="0.6" />
        </svg>
      </div>

      {/* Detail card */}
      <div className="bg-[#131C2E] rounded-3xl mx-0 mt-4 pt-5 pb-8 px-5 flex-1">

        {/* Health row */}
        <div className="flex justify-between items-center">
          <span className="text-[#9CA3AF] text-sm">Health</span>
          <span className="text-[#4ADE80] font-semibold text-sm">Good</span>
          <span className="text-[#4ADE80] font-bold text-2xl">82%</span>
        </div>

        <div className="border-t border-[#1A2438] mt-3 mb-3" />

        {/* Detail rows */}
        <div className="space-y-4">

          {/* Last Watered */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0C2240] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 1C7 1 2.5 6 2.5 8.5C2.5 11.0 4.5 13 7 13C9.5 13 11.5 11.0 11.5 8.5C11.5 6 7 1 7 1Z"
                  fill="#3B82F6"
                  opacity="0.9"
                />
              </svg>
            </div>
            <span className="text-[#9CA3AF] text-sm">Last Watered</span>
            <span className="text-white text-sm font-medium ml-auto">2 days ago</span>
          </div>

          {/* Next Watering */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2A1F00] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="3" fill="#FBBF24" />
                <path d="M7 1V2.5M7 11.5V13M1 7H2.5M11.5 7H13M3 3L4.05 4.05M9.95 9.95L11 11M3 11L4.05 9.95M9.95 4.05L11 3"
                  stroke="#FBBF24" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[#9CA3AF] text-sm">Next Watering</span>
            <span className="text-white text-sm font-medium ml-auto">Tomorrow</span>
          </div>

          {/* Species */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#082A10] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path
                  d="M7 12C7 12 2 8 2 5C2 3.343 3.343 2 5 2C5.9 2 6.7 2.385 7 3C7.3 2.385 8.1 2 9 2C10.657 2 12 3.343 12 5C12 8 7 12 7 12Z"
                  fill="#22C55E"
                  opacity="0.9"
                />
              </svg>
            </div>
            <span className="text-[#9CA3AF] text-sm">Species</span>
            <span className="text-white text-sm font-medium ml-auto">Ficus Benjamina</span>
          </div>

          {/* Age */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A0A2E] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="1.5" y="2.5" width="11" height="10" rx="1.5" stroke="#A855F7" strokeWidth="1.2" />
                <path d="M4.5 1.5V3.5M9.5 1.5V3.5" stroke="#A855F7" strokeWidth="1.2" strokeLinecap="round" />
                <path d="M1.5 5.5H12.5" stroke="#A855F7" strokeWidth="1.2" />
                <rect x="4" y="7.5" width="2" height="2" rx="0.4" fill="#A855F7" />
              </svg>
            </div>
            <span className="text-[#9CA3AF] text-sm">Age</span>
            <span className="text-white text-sm font-medium ml-auto">2 years</span>
          </div>

          {/* Notes */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A1F2E] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1.5" width="10" height="11" rx="1.5" stroke="#9CA3AF" strokeWidth="1.2" />
                <path d="M4.5 5H9.5M4.5 7.5H9.5M4.5 10H7.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[#9CA3AF] text-sm">Notes</span>
            <span className="text-white text-sm font-medium ml-auto">Loves bright light</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-4 gap-2 mt-6">

          {/* Water */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2C10 2 4 9 4 12.5C4 15.538 6.686 18 10 18C13.314 18 16 15.538 16 12.5C16 9 10 2 10 2Z"
                fill="#3B82F6"
                opacity="0.85"
              />
            </svg>
            <span className="text-xs text-[#9CA3AF]">Water</span>
          </button>

          {/* Care Guide */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="2" width="14" height="16" rx="2" stroke="#9CA3AF" strokeWidth="1.4" />
              <path d="M7 7H13M7 10H13M7 13H10" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="text-xs text-[#9CA3AF]">Care Guide</span>
          </button>

          {/* History */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="7.5" stroke="#9CA3AF" strokeWidth="1.4" />
              <path d="M10 6V10.5L12.5 12.5" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xs text-[#9CA3AF]">History</span>
          </button>

          {/* More */}
          <button className="bg-[#1A2438] rounded-2xl p-3 flex flex-col items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="5" cy="10" r="1.5" fill="#9CA3AF" />
              <circle cx="10" cy="10" r="1.5" fill="#9CA3AF" />
              <circle cx="15" cy="10" r="1.5" fill="#9CA3AF" />
            </svg>
            <span className="text-xs text-[#9CA3AF]">More</span>
          </button>
        </div>
      </div>
    </div>
  );
}
