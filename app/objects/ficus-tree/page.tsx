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
        style={{ background: "#0A1A0A" }}
      >
        <img
          src="/images/obj-ficus-detail.jpg"
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(10,26,10,0.1) 0%, rgba(10,26,10,0.3) 100%)",
          }}
        />
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
