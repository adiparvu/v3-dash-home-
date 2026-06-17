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

      {/* Hero pond illustration */}
      <div
        className="h-64 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #050F18 0%, #07182A 40%, #0A2035 70%, #0D2D45 100%)",
        }}
      >
        <svg
          viewBox="0 0 390 256"
          preserveAspectRatio="xMidYMid slice"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="pondGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0F4A6E" />
              <stop offset="60%" stopColor="#0B3A5A" />
              <stop offset="100%" stopColor="#072840" />
            </radialGradient>
            <radialGradient id="rippleGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1A6A8A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0B3A5A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Pond body */}
          <ellipse cx="195" cy="168" rx="170" ry="72" fill="url(#pondGrad)" />

          {/* Ripple rings */}
          <ellipse cx="195" cy="168" rx="140" ry="58" fill="none" stroke="#1A5A7A" strokeWidth="1" opacity="0.5" />
          <ellipse cx="195" cy="168" rx="110" ry="45" fill="none" stroke="#1A6A8A" strokeWidth="1" opacity="0.4" />
          <ellipse cx="195" cy="168" rx="78" ry="32" fill="none" stroke="#2080A0" strokeWidth="1" opacity="0.35" />
          <ellipse cx="195" cy="168" rx="48" ry="20" fill="none" stroke="#25A0C0" strokeWidth="1" opacity="0.3" />
          <ellipse cx="195" cy="168" rx="22" ry="9" fill="#1A6A8A" opacity="0.4" />

          {/* Water shimmer highlights */}
          <ellipse cx="160" cy="155" rx="25" ry="5" fill="#2090B0" opacity="0.15" transform="rotate(-15 160 155)" />
          <ellipse cx="240" cy="175" rx="20" ry="4" fill="#2090B0" opacity="0.12" transform="rotate(10 240 175)" />
          <ellipse cx="195" cy="148" rx="18" ry="3" fill="#30A8C8" opacity="0.1" />

          {/* Left bank plants */}
          {/* Tall reeds left */}
          <rect x="22" y="100" width="3" height="90" rx="1.5" fill="#0C2A10" />
          <ellipse cx="23.5" cy="96" rx="8" ry="12" fill="#0E3512" />
          <rect x="38" y="115" width="3" height="80" rx="1.5" fill="#0C2A10" />
          <ellipse cx="39.5" cy="111" rx="7" ry="10" fill="#0E3512" />
          <rect x="12" y="120" width="2.5" height="70" rx="1.2" fill="#0A2A0E" />
          <ellipse cx="13.3" cy="117" rx="6" ry="9" fill="#0C3010" />

          {/* Left large bush */}
          <ellipse cx="55" cy="170" rx="55" ry="35" fill="#081A0A" />
          <ellipse cx="35" cy="155" rx="38" ry="28" fill="#0A2010" />
          <ellipse cx="60" cy="148" rx="32" ry="24" fill="#0C2812" />
          <ellipse cx="30" cy="165" rx="28" ry="20" fill="#0A2010" />

          {/* Left medium plants */}
          <ellipse cx="90" cy="190" rx="28" ry="18" fill="#0A2010" />
          <ellipse cx="78" cy="183" rx="20" ry="14" fill="#0C2812" />

          {/* Right bank plants */}
          {/* Tall reeds right */}
          <rect x="362" y="95" width="3" height="95" rx="1.5" fill="#0C2A10" />
          <ellipse cx="363.5" cy="91" rx="8" ry="12" fill="#0E3512" />
          <rect x="348" y="110" width="3" height="85" rx="1.5" fill="#0C2A10" />
          <ellipse cx="349.5" cy="106" rx="7" ry="10" fill="#0E3512" />
          <rect x="375" y="118" width="2.5" height="72" rx="1.2" fill="#0A2A0E" />
          <ellipse cx="376.3" cy="115" rx="6" ry="9" fill="#0C3010" />

          {/* Right large bush */}
          <ellipse cx="335" cy="168" rx="55" ry="35" fill="#081A0A" />
          <ellipse cx="355" cy="152" rx="38" ry="28" fill="#0A2010" />
          <ellipse cx="330" cy="146" rx="32" ry="24" fill="#0C2812" />
          <ellipse cx="360" cy="163" rx="28" ry="20" fill="#0A2010" />

          {/* Right medium plants */}
          <ellipse cx="300" cy="188" rx="28" ry="18" fill="#0A2010" />
          <ellipse cx="312" cy="181" rx="20" ry="14" fill="#0C2812" />

          {/* Lily pads on water */}
          <ellipse cx="155" cy="185" rx="14" ry="7" fill="#0E3A12" opacity="0.8" transform="rotate(-10 155 185)" />
          <ellipse cx="158" cy="185" rx="5" ry="2.5" fill="#143D16" opacity="0.6" transform="rotate(-10 158 185)" />
          <ellipse cx="248" cy="175" rx="12" ry="6" fill="#0E3A12" opacity="0.75" transform="rotate(8 248 175)" />
          <ellipse cx="251" cy="174" rx="4" ry="2" fill="#143D16" opacity="0.6" transform="rotate(8 251 174)" />
          <ellipse cx="200" cy="195" rx="10" ry="5" fill="#0E3A12" opacity="0.7" />

          {/* Water quality floating badge */}
          <rect x="145" y="105" width="100" height="28" rx="14" fill="#0B1E30" opacity="0.85" />
          <circle cx="162" cy="119" r="6" fill="#06B6D4" opacity="0.3" />
          <circle cx="162" cy="119" r="3.5" fill="#06B6D4" opacity="0.8" />
          <text x="173" y="123" fontFamily="system-ui, sans-serif" fontSize="11" fill="#E0F7FF" fontWeight="600">Excellent</text>

          {/* Sky reflections / atmosphere */}
          <ellipse cx="195" cy="50" rx="100" ry="40" fill="#071520" opacity="0.4" />

          {/* Stars / particles */}
          <circle cx="80" cy="30" r="1" fill="#B0D4E8" opacity="0.5" />
          <circle cx="150" cy="18" r="0.8" fill="#B0D4E8" opacity="0.4" />
          <circle cx="260" cy="25" r="1" fill="#B0D4E8" opacity="0.5" />
          <circle cx="320" cy="15" r="0.8" fill="#B0D4E8" opacity="0.4" />
          <circle cx="340" cy="40" r="1" fill="#B0D4E8" opacity="0.3" />
        </svg>
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
