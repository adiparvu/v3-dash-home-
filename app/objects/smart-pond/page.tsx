"use client";

import Link from "next/link";

export default function SmartPondPage() {
  const circumference = 2 * Math.PI * 78; // ≈ 490.09
  const progress = 0.92;
  const strokeDashoffset = circumference * (1 - progress); // ≈ 39.2

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
          <div className="ml-2">
            <span className="text-white font-medium text-sm">Smart Pond</span>
            <span className="text-[#6B7280] text-sm ml-1">
              / Water Quality Excellent
            </span>
          </div>
        </div>

        {/* More button */}
        <button
          className="w-9 h-9 rounded-full bg-[#131C2E] flex items-center justify-center"
          aria-label="More options"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="3.5" cy="8" r="1.3" fill="#9CA3AF" />
            <circle cx="8" cy="8" r="1.3" fill="#9CA3AF" />
            <circle cx="12.5" cy="8" r="1.3" fill="#9CA3AF" />
          </svg>
        </button>
      </div>

      {/* Hero pond image */}
      <div className="h-64 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1692555073611-002b040ea5f4?w=800&q=80&fit=crop&auto=format"
          alt=""
          draggable={false}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, rgba(5,15,24,0.4) 0%, rgba(7,24,42,0.2) 50%, rgba(13,45,69,0.7) 100%)",
          }}
        />
      </div>

      {/* Circular health score */}
      <div className="flex justify-center mt-6">
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0EA5E9" />
            </linearGradient>
          </defs>
          {/* Background ring */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="#1A2438"
            strokeWidth="10"
          />
          {/* Progress arc */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 90 90)"
          />
          {/* Center text */}
          <text
            x="90"
            y="84"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="28"
            fontWeight="700"
            fill="white"
          >
            92%
          </text>
          <text
            x="90"
            y="102"
            textAnchor="middle"
            fontFamily="system-ui, -apple-system, sans-serif"
            fontSize="11"
            fill="#9CA3AF"
          >
            Health Score
          </text>
        </svg>
      </div>

      {/* Metric cards */}
      <div className="px-4 mt-4 grid grid-cols-3 gap-2">
        <div className="bg-[#131C2E] rounded-xl p-3 text-center">
          <p className="text-white font-bold text-sm">22.4 °C</p>
          <p className="text-[#9CA3AF] text-xs mt-0.5">Temperature</p>
        </div>
        <div className="bg-[#131C2E] rounded-xl p-3 text-center">
          <p className="text-white font-bold text-sm">7.2</p>
          <p className="text-[#9CA3AF] text-xs mt-0.5">pH Level</p>
        </div>
        <div className="bg-[#131C2E] rounded-xl p-3 text-center">
          <p className="text-white font-bold text-sm">8.1 mg/L</p>
          <p className="text-[#9CA3AF] text-xs mt-0.5">Oxygen</p>
        </div>
      </div>

      {/* Area chart card */}
      <div className="mx-4 mt-3 bg-[#131C2E] rounded-2xl p-4">
        <p className="text-white font-semibold text-sm mb-3">Water Quality</p>
        <svg
          width="100%"
          height="60"
          viewBox="0 0 280 60"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area fill */}
          <path
            d="M 0,50 C 20,46 40,42 60,36 S 100,30 120,26 S 160,20 190,22 S 225,24 250,20 L 280,18 L 280,60 L 0,60 Z"
            fill="url(#areaGrad)"
          />
          {/* Line */}
          <path
            d="M 0,50 C 20,46 40,42 60,36 S 100,30 120,26 S 160,20 190,22 S 225,24 250,20 L 280,18"
            fill="none"
            stroke="#06B6D4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Data point dots */}
          <circle cx="0" cy="50" r="2.5" fill="#06B6D4" />
          <circle cx="60" cy="36" r="2.5" fill="#06B6D4" />
          <circle cx="120" cy="26" r="2.5" fill="#06B6D4" />
          <circle cx="190" cy="22" r="2.5" fill="#06B6D4" />
          <circle cx="250" cy="20" r="2.5" fill="#06B6D4" />
          <circle cx="280" cy="18" r="2.5" fill="#0EA5E9" />
        </svg>
      </div>

      {/* Equipment card */}
      <div className="mx-4 mt-3 bg-[#131C2E] rounded-2xl p-4 pb-2">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-white font-semibold text-sm">Equipment</p>
          <p className="text-[#4ADE80] text-xs">All systems operational</p>
        </div>

        <div className="border-t border-[#1A2438]" />

        {/* Pumps */}
        <div className="flex justify-between items-center py-3 border-b border-[#1A2438]">
          <span className="text-[#9CA3AF] text-sm">Pumps</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">2/2</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 10.5L8.5 7L5 3.5" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center py-3 border-b border-[#1A2438]">
          <span className="text-[#9CA3AF] text-sm">Filters</span>
          <div className="flex items-center gap-2">
            <span className="text-white font-medium text-sm">3/3</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 10.5L8.5 7L5 3.5" stroke="#6B7280" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* UV Systems */}
        <div className="flex justify-between items-center py-3">
          <span className="text-[#9CA3AF] text-sm">UV Systems</span>
          <span className="text-white font-medium text-sm">1/1</span>
        </div>
      </div>
    </div>
  );
}
