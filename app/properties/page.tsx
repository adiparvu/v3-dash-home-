"use client";

import Link from "next/link";
import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";

export default function PropertiesPage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <h1 className="text-white font-bold text-2xl">Properties</h1>
        <Link href="/properties/new">
          <button
            className="w-9 h-9 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(74,222,128,0.15)", border: "1px solid rgba(74,222,128,0.30)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#4ADE80" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </Link>
      </div>

      {/* Summary card */}
      <div className="px-4 mb-4">
        <div
          className="rounded-3xl p-4"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p className="text-[#9CA3AF] text-xs mb-3">Portfolio Overview</p>
          <div className="grid grid-cols-4 gap-2">
            <div className="text-center">
              <p className="text-white font-bold text-xl">1</p>
              <p className="text-[#6B7280] text-[10px] leading-tight mt-0.5">Properties</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">45</p>
              <p className="text-[#6B7280] text-[10px] leading-tight mt-0.5">ha total</p>
            </div>
            <div className="text-center">
              <p className="text-white font-bold text-xl">€2.4M</p>
              <p className="text-[#6B7280] text-[10px] leading-tight mt-0.5">Value</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1">
                <p className="text-[#4ADE80] font-bold text-xl">87</p>
              </div>
              <p className="text-[#6B7280] text-[10px] leading-tight mt-0.5">Health avg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Properties list */}
      <div className="px-4 mb-3">
        <p className="text-[#9CA3AF] text-xs font-medium mb-3 uppercase tracking-wider">My Properties</p>

        {/* Prvio Estate card */}
        <Link href="/properties/prvio-estate">
          <div
            className="rounded-3xl overflow-hidden active:scale-[0.98] transition-transform mb-3"
            style={{ border: "1px solid rgba(255,255,255,0.10)" }}
          >
            {/* Hero gradient background */}
            <div
              className="h-36 relative flex items-end p-4"
              style={{
                background: "linear-gradient(135deg, #0B1A2E 0%, #0D2137 25%, #0A1F35 50%, #0B2A3A 75%, #072030 100%)",
              }}
            >
              {/* Topographic / satellite style overlay shapes */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse 70% 50% at 70% 40%, rgba(34,211,238,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 60% at 20% 60%, rgba(74,222,128,0.06) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 20%, rgba(124,58,237,0.05) 0%, transparent 60%)",
                }}
              />
              {/* Grid lines subtle overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                }}
              />

              {/* Status dot */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "#4ADE80" }}
                  />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "#4ADE80" }} />
                </span>
                <span className="text-[10px] text-[#4ADE80] font-medium">Live</span>
              </div>

              {/* Health badge */}
              <div className="absolute top-3 left-3">
                <div
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(74,222,128,0.18)", border: "1px solid rgba(74,222,128,0.30)" }}
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                      fill="#4ADE80"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold" style={{ color: "#4ADE80" }}>
                    87 · Very Good
                  </span>
                </div>
              </div>

              {/* Property name on hero */}
              <div className="relative z-10">
                <p className="text-[#9CA3AF] text-xs mb-0.5">Estate</p>
                <h3 className="text-white font-bold text-lg leading-tight">Prvio Estate</h3>
              </div>
            </div>

            {/* Card body */}
            <div className="p-4" style={{ background: "rgba(255,255,255,0.05)" }}>
              {/* Location */}
              <div className="flex items-center gap-1.5 mb-3">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                    fill="#9CA3AF"
                  />
                </svg>
                <span className="text-[#9CA3AF] text-xs">Cluj-Napoca, România</span>
              </div>

              {/* Stats row */}
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z"
                      stroke="#22D3EE"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#9CA3AF] text-[11px]">
                    <span className="text-white font-semibold">26</span> zones
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#7C3AED" strokeWidth="1.75" />
                    <circle cx="12" cy="12" r="3" fill="#7C3AED" />
                  </svg>
                  <span className="text-[#9CA3AF] text-[11px]">
                    <span className="text-white font-semibold">142</span> objects
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="2" width="20" height="20" rx="2" stroke="#4ADE80" strokeWidth="1.75" />
                  </svg>
                  <span className="text-[#9CA3AF] text-[11px]">
                    <span className="text-white font-semibold">45 ha</span>
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="#6B7280" strokeWidth="1.75" />
                    <path d="M12 7V12L15 15" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                  <span className="text-[#6B7280] text-[11px]">Updated 2h ago</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6L15 12L9 18" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Add Property button */}
      <div className="px-4 mb-6">
        <Link href="/properties/new">
          <button
            className="w-full py-4 rounded-3xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            style={{
              background: "transparent",
              border: "1.5px dashed rgba(255,255,255,0.15)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5V19M5 12H19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-[#9CA3AF] text-sm font-medium">Add Property</span>
          </button>
        </Link>
      </div>

      <BottomNav />
    </div>
  );
}
