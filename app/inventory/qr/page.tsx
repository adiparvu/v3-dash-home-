"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const recentScans = [
  { name: "Water Pump", id: "WP-001", time: "2h ago", icon: "⚙️", href: "/inventory/water-pump" },
  { name: "Ficus Tree", id: "FT-002", time: "1d ago", icon: "🌱", href: "/inventory/ficus-tree" },
  { name: "AC Unit", id: "AC-003", time: "3d ago", icon: "❄️", href: "/inventory/air-conditioner" },
];

export default function QRScannerPage() {
  const [manualCode, setManualCode] = useState("");

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-5 flex items-center gap-3">
        <Link
          href="/inventory"
          className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <h1 className="text-white font-bold text-xl">Scan QR Code</h1>
      </div>

      {/* Viewfinder */}
      <div className="flex flex-col items-center px-5 mb-6">
        <div
          className="relative rounded-3xl flex items-center justify-center"
          style={{
            width: 280,
            height: 280,
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}
        >
          {/* Corner marks */}
          {/* Top-left */}
          <svg
            className="absolute top-4 left-4"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M2 16V2H16" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Top-right */}
          <svg
            className="absolute top-4 right-4"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M30 16V2H16" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Bottom-left */}
          <svg
            className="absolute bottom-4 left-4"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M2 16V30H16" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {/* Bottom-right */}
          <svg
            className="absolute bottom-4 right-4"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path d="M30 16V30H16" stroke="#4ADE80" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* QR icon in center */}
          <div className="flex flex-col items-center gap-3 opacity-30">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="white" strokeWidth="1.5" />
              <rect x="5" y="5" width="3" height="3" fill="white" />
              <rect x="16" y="5" width="3" height="3" fill="white" />
              <rect x="5" y="16" width="3" height="3" fill="white" />
              <path d="M14 14h2v2h-2zM18 14h3v3h-3M14 18h3v3h-3" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Scan line animation */}
          <div
            className="absolute left-8 right-8 h-[2px] rounded-full"
            style={{
              background: "linear-gradient(90deg, transparent, #4ADE80, transparent)",
              top: "50%",
              animation: "none",
            }}
          />
        </div>

        <p className="mt-4 text-sm text-center" style={{ color: "#9CA3AF" }}>
          Point camera at QR code
        </p>
        <p className="mt-1 text-xs text-center" style={{ color: "#6B7280" }}>
          Camera access will be requested on mobile
        </p>
      </div>

      {/* Manual entry */}
      <div className="px-5 mb-6">
        <div
          className="rounded-2xl p-4"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <p className="text-white font-semibold text-sm mb-3">Enter code manually</p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WP-001"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none placeholder-opacity-50"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
              }}
            />
            <Link
              href={manualCode.trim() ? `/inventory/qr/${encodeURIComponent(manualCode.trim())}` : "#"}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center flex-shrink-0"
              style={{
                background: manualCode.trim()
                  ? "linear-gradient(135deg, #4ADE80, #22D3EE)"
                  : "rgba(255,255,255,0.08)",
                color: manualCode.trim() ? "#050A14" : "#6B7280",
                border: manualCode.trim() ? "none" : "1px solid rgba(255,255,255,0.10)",
                pointerEvents: manualCode.trim() ? "auto" : "none",
              }}
            >
              Find Asset
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="px-5">
        <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>
          Recent Scans
        </p>
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {recentScans.map((scan, i) => (
            <Link key={scan.id} href={scan.href}>
              <div
                className="flex items-center gap-3.5 px-4 py-3.5 active:bg-white/5 transition-colors"
                style={i < recentScans.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}
                >
                  {scan.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{scan.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                    {scan.id} · {scan.time}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
