"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import StatusBar from "../../../components/layout/StatusBar";

const assetLookup: Record<string, {
  name: string;
  category: string;
  location: string;
  status: string;
  statusColor: string;
  icon: string;
  accentColor: string;
  assetId: string;
  detailHref: string;
}> = {
  "WP-001": {
    name: "Water Pump",
    category: "Equipment",
    location: "Lake Zone",
    status: "On",
    statusColor: "#4ADE80",
    icon: "⚙️",
    accentColor: "#22D3EE",
    assetId: "WP-001",
    detailHref: "/inventory/water-pump",
  },
  "FT-002": {
    name: "Ficus Tree",
    category: "Plants",
    location: "Living Room",
    status: "Healthy",
    statusColor: "#4ADE80",
    icon: "🌱",
    accentColor: "#4ADE80",
    assetId: "FT-002",
    detailHref: "/inventory/ficus-tree",
  },
  "AC-003": {
    name: "Air Conditioner",
    category: "Devices",
    location: "Master Bedroom",
    status: "On",
    statusColor: "#4ADE80",
    icon: "❄️",
    accentColor: "#22D3EE",
    assetId: "AC-003",
    detailHref: "/inventory/air-conditioner",
  },
  "LM-004": {
    name: "Lawn Mower",
    category: "Equipment",
    location: "Garden",
    status: "Idle",
    statusColor: "#9CA3AF",
    icon: "🌿",
    accentColor: "#4ADE80",
    assetId: "LM-004",
    detailHref: "/inventory/lawn-mower",
  },
  "SC-005": {
    name: "Security Camera",
    category: "Devices",
    location: "Driveway",
    status: "3 Active",
    statusColor: "#FFFFFF",
    icon: "📷",
    accentColor: "#7C3AED",
    assetId: "SC-005",
    detailHref: "/inventory/security-camera",
  },
  "IS-006": {
    name: "Irrigation System",
    category: "Equipment",
    location: "Orchard",
    status: "Active",
    statusColor: "#4ADE80",
    icon: "💧",
    accentColor: "#22D3EE",
    assetId: "IS-006",
    detailHref: "/inventory/irrigation-system",
  },
};

export default function QRResultPage() {
  const params = useParams<{ code: string }>();
  const decodedCode = decodeURIComponent(params.code).toUpperCase();
  const asset = assetLookup[decodedCode];

  if (!asset) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#050A14" }}>
        <StatusBar />

        {/* Header */}
        <div className="px-5 pt-1 pb-5 flex items-center gap-3">
          <Link
            href="/inventory/qr"
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
          <h1 className="text-white font-bold text-xl">Scan Result</h1>
        </div>

        {/* Not found state */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-16">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.75" />
              <path d="M15 9l-6 6M9 9l6 6" stroke="#EF4444" strokeWidth="1.75" strokeLinecap="round" />
            </svg>
          </div>

          <h2 className="text-white font-bold text-2xl mb-2">Asset Not Found</h2>
          <p className="text-sm text-center mb-1" style={{ color: "#9CA3AF" }}>
            No asset matched the code
          </p>
          <p
            className="text-sm font-mono font-semibold mb-8 px-3 py-1.5 rounded-xl"
            style={{ color: "#EF4444", background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)" }}
          >
            {decodedCode}
          </p>

          <Link
            href="/inventory/qr"
            className="w-full max-w-xs py-3.5 rounded-2xl text-sm font-semibold text-center block mb-3"
            style={{
              background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
              color: "#050A14",
            }}
          >
            Try Again
          </Link>
          <Link
            href="/inventory"
            className="w-full max-w-xs py-3.5 rounded-2xl text-sm font-semibold text-center block"
            style={{
              background: "rgba(255,255,255,0.07)",
              color: "#9CA3AF",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header */}
      <div className="px-5 pt-1 pb-5 flex items-center gap-3">
        <Link
          href="/inventory/qr"
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
        <h1 className="text-white font-bold text-xl">Scan Result</h1>
      </div>

      <div className="flex-1 flex flex-col items-center px-5 pb-10">
        {/* Success indicator */}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-5 mt-4"
          style={{
            background: "rgba(74,222,128,0.12)",
            border: "1px solid rgba(74,222,128,0.30)",
            boxShadow: "0 0 32px rgba(74,222,128,0.15)",
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#4ADE80" strokeWidth="1.75" />
            <path d="M8 12l3 3 5-5" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-sm font-medium mb-1" style={{ color: "#4ADE80" }}>Asset Found</p>
        <h2 className="text-white font-bold text-2xl mb-6">{asset.name}</h2>

        {/* Asset card */}
        <div
          className="w-full rounded-2xl mb-5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          {/* Icon row */}
          <div
            className="flex items-center gap-4 px-4 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background: `${asset.accentColor}12`,
                border: `1px solid ${asset.accentColor}25`,
              }}
            >
              {asset.icon}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{asset.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{asset.category}</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{
                background: `${asset.statusColor}18`,
                color: asset.statusColor,
                border: `1px solid ${asset.statusColor}30`,
              }}
            >
              {asset.status}
            </span>
          </div>

          {/* Info rows */}
          <div
            className="flex items-center justify-between px-4 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm" style={{ color: "#6B7280" }}>Location</span>
            <span className="text-sm font-medium text-white">{asset.location}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm" style={{ color: "#6B7280" }}>Asset ID</span>
            <span className="text-sm font-mono font-semibold" style={{ color: asset.accentColor }}>
              {asset.assetId}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <Link
          href={asset.detailHref}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-center block mb-3"
          style={{
            background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
            color: "#050A14",
          }}
        >
          View Details
        </Link>

        <button
          className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-3"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          Add Task
        </button>

        <button
          className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-6"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.20)",
          }}
        >
          Report Issue
        </button>

        {/* Back link */}
        <Link href="/inventory" className="text-sm" style={{ color: "#6B7280" }}>
          Back to Inventory
        </Link>
      </div>
    </div>
  );
}
