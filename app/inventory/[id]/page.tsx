"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../../components/layout/StatusBar";

const assetData: Record<string, {
  name: string;
  category: string;
  location: string;
  status: string;
  statusColor: string;
  icon: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  assetId: string;
  brand: string;
  model: string;
  serial: string;
  purchaseDate: string;
  warranty: string;
}> = {
  "water-pump": {
    name: "Water Pump",
    category: "Equipment",
    location: "Lake Zone",
    status: "On",
    statusColor: "#4ADE80",
    icon: "⚙️",
    accentColor: "#22D3EE",
    gradientFrom: "#0E3A4A",
    gradientTo: "#0A1F2E",
    assetId: "WP-001",
    brand: "Grundfos",
    model: "CM 5-4",
    serial: "GF-2023-0041",
    purchaseDate: "Mar 12, 2023",
    warranty: "Mar 12, 2026",
  },
  "ficus-tree": {
    name: "Ficus Tree",
    category: "Plants",
    location: "Living Room",
    status: "Healthy",
    statusColor: "#4ADE80",
    icon: "🌱",
    accentColor: "#4ADE80",
    gradientFrom: "#0A2E1A",
    gradientTo: "#071A0F",
    assetId: "FT-002",
    brand: "Natura",
    model: "Ficus Benjamina",
    serial: "NT-2022-0118",
    purchaseDate: "Jan 5, 2022",
    warranty: "N/A",
  },
  "air-conditioner": {
    name: "Air Conditioner",
    category: "Devices",
    location: "Master Bedroom",
    status: "On",
    statusColor: "#4ADE80",
    icon: "❄️",
    accentColor: "#22D3EE",
    gradientFrom: "#0D2A40",
    gradientTo: "#071825",
    assetId: "AC-003",
    brand: "Daikin",
    model: "FTXS50K",
    serial: "DK-2021-7823",
    purchaseDate: "Jun 20, 2021",
    warranty: "Jun 20, 2026",
  },
  "lawn-mower": {
    name: "Lawn Mower",
    category: "Equipment",
    location: "Garden",
    status: "Idle",
    statusColor: "#9CA3AF",
    icon: "🌿",
    accentColor: "#4ADE80",
    gradientFrom: "#0A2E1A",
    gradientTo: "#071A0F",
    assetId: "LM-004",
    brand: "Husqvarna",
    model: "Automower 430X",
    serial: "HQ-2022-3301",
    purchaseDate: "Apr 8, 2022",
    warranty: "Apr 8, 2025",
  },
  "security-camera": {
    name: "Security Camera",
    category: "Devices",
    location: "Driveway",
    status: "3 Active",
    statusColor: "#FFFFFF",
    icon: "📷",
    accentColor: "#7C3AED",
    gradientFrom: "#1E0A3A",
    gradientTo: "#110622",
    assetId: "SC-005",
    brand: "Hikvision",
    model: "DS-2CD2T47G2",
    serial: "HK-2023-5590",
    purchaseDate: "Feb 14, 2023",
    warranty: "Feb 14, 2026",
  },
  "irrigation-system": {
    name: "Irrigation System",
    category: "Equipment",
    location: "Orchard",
    status: "Active",
    statusColor: "#4ADE80",
    icon: "💧",
    accentColor: "#22D3EE",
    gradientFrom: "#0E3A4A",
    gradientTo: "#0A1F2E",
    assetId: "IS-006",
    brand: "Rain Bird",
    model: "ESP-TM2",
    serial: "RB-2021-9902",
    purchaseDate: "Sep 3, 2021",
    warranty: "Sep 3, 2024",
  },
};

const defaultAsset = assetData["water-pump"];

const tabs = ["Details", "Maintenance", "Documents", "QR Code"];

const maintenanceItems = [
  { title: "Filter Replacement", date: "Jun 10, 2026", status: "Scheduled", statusColor: "#F59E0B" },
  { title: "Annual Inspection", date: "Apr 2, 2026", status: "Completed", statusColor: "#4ADE80" },
  { title: "Belt Check", date: "Jan 15, 2026", status: "Completed", statusColor: "#4ADE80" },
];

const documents = [
  { name: "User Manual", size: "4.2 MB", icon: "📄" },
  { name: "Warranty Card", size: "1.1 MB", icon: "🛡️" },
  { name: "Purchase Invoice", size: "0.8 MB", icon: "🧾" },
];

export default function InventoryDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("Details");
  const asset = assetData[params.id] ?? defaultAsset;

  return (
    <div className="min-h-screen" style={{ background: "#050A14" }}>
      {/* Hero Section */}
      <div
        className="relative h-64 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${asset.gradientFrom} 0%, ${asset.gradientTo} 100%)`,
        }}
      >
        {/* StatusBar absolute on top */}
        <StatusBar transparent />

        {/* Ambient glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, ${asset.accentColor} 0%, transparent 70%)`,
          }}
        />

        {/* Back button */}
        <Link
          href="/inventory"
          className="absolute top-14 left-5 w-9 h-9 rounded-2xl flex items-center justify-center z-10"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M15 18l-6-6 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        {/* More button */}
        <button
          className="absolute top-14 right-5 w-9 h-9 rounded-2xl flex items-center justify-center z-10"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(16px)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="5" cy="12" r="1.5" fill="white" />
            <circle cx="12" cy="12" r="1.5" fill="white" />
            <circle cx="19" cy="12" r="1.5" fill="white" />
          </svg>
        </button>

        {/* Asset icon in glass circle */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl z-10"
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(20px)",
          }}
        >
          {asset.icon}
        </div>
      </div>

      {/* Bottom sheet */}
      <div
        className="rounded-t-[32px] px-5 pt-5 pb-10 -mt-6 relative z-10"
        style={{
          background: "rgba(10,16,28,0.98)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          minHeight: "calc(100vh - 232px)",
        }}
      >
        {/* Asset name + status */}
        <div className="flex items-start justify-between mb-1">
          <h1 className="text-white font-bold text-2xl leading-tight">{asset.name}</h1>
          <span
            className="mt-1 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{
              background: `${asset.statusColor}18`,
              color: asset.statusColor,
              border: `1px solid ${asset.statusColor}30`,
            }}
          >
            {asset.status}
          </span>
        </div>

        {/* Category · Location */}
        <p className="text-sm mb-4" style={{ color: "#9CA3AF" }}>
          {asset.category}
          <span className="mx-1.5 opacity-40">·</span>
          {asset.location}
        </p>

        {/* Tabs */}
        <div
          className="flex rounded-2xl p-1 mb-5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 text-xs font-medium rounded-xl transition-all"
              style={
                activeTab === tab
                  ? { background: "rgba(255,255,255,0.12)", color: "#FFFFFF" }
                  : { color: "#6B7280" }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Details" && (
          <div>
            {/* Info rows */}
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {[
                { label: "Brand", value: asset.brand },
                { label: "Model", value: asset.model },
                { label: "Serial Number", value: asset.serial },
                { label: "Purchase Date", value: asset.purchaseDate },
                { label: "Warranty", value: asset.warranty },
                { label: "Location", value: asset.location },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-3.5"
                  style={i < arr.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
                >
                  <span className="text-sm" style={{ color: "#6B7280" }}>{row.label}</span>
                  <span className="text-sm font-medium text-white">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#6B7280" }}>
              Quick Actions
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: "History",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#22D3EE" strokeWidth="1.75" />
                      <path d="M12 7v5l3 3" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  color: "#22D3EE",
                },
                {
                  label: "Tasks",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3L22 4" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "#4ADE80",
                },
                {
                  label: "Alert",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="9" x2="12" y2="13" stroke="#F59E0B" strokeWidth="1.75" strokeLinecap="round" />
                      <line x1="12" y1="17" x2="12.01" y2="17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "#F59E0B",
                },
                {
                  label: "Settings",
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="#7C3AED" strokeWidth="1.75" />
                      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="#7C3AED" strokeWidth="1.75" />
                    </svg>
                  ),
                  color: "#7C3AED",
                },
              ].map((action) => (
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 rounded-2xl py-3.5"
                  style={{
                    background: `${action.color}0F`,
                    border: `1px solid ${action.color}20`,
                  }}
                >
                  {action.icon}
                  <span className="text-[10px] font-medium" style={{ color: action.color }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "Maintenance" && (
          <div>
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {maintenanceItems.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between px-4 py-4"
                  style={i < maintenanceItems.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
                >
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{item.date}</p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{
                      background: `${item.statusColor}18`,
                      color: item.statusColor,
                      border: `1px solid ${item.statusColor}30`,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: "rgba(74,222,128,0.12)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}
            >
              + Schedule Maintenance
            </button>
          </div>
        )}

        {activeTab === "Documents" && (
          <div>
            <div
              className="rounded-2xl overflow-hidden mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {documents.map((doc, i) => (
                <div
                  key={doc.name}
                  className="flex items-center gap-3.5 px-4 py-4"
                  style={i < documents.length - 1 ? { borderBottom: "1px solid rgba(255,255,255,0.06)" } : {}}
                >
                  <span className="text-2xl">{doc.icon}</span>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{doc.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{doc.size}</p>
                  </div>
                  <button
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 19l7 0 7 0M5 12l7 7 7-7" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <button
              className="w-full py-3.5 rounded-2xl text-sm font-semibold"
              style={{ background: "rgba(255,255,255,0.07)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              + Upload Document
            </button>
          </div>
        )}

        {activeTab === "QR Code" && (
          <div className="flex flex-col items-center">
            {/* QR card */}
            <div
              className="w-full rounded-2xl p-6 flex flex-col items-center mb-4"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              {/* QR placeholder */}
              <div
                className="w-[180px] h-[180px] rounded-2xl flex items-center justify-center mb-4"
                style={{ background: "white" }}
              >
                <span className="font-bold text-3xl" style={{ color: "#050A14" }}>QR</span>
              </div>

              {/* Asset ID */}
              <p className="text-sm font-medium mb-1" style={{ color: "#9CA3AF" }}>
                Asset ID
              </p>
              <p className="text-white font-bold text-lg tracking-widest">{asset.assetId}</p>
            </div>

            {/* Download QR */}
            <button
              className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-3"
              style={{
                background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
                color: "#050A14",
              }}
            >
              Download QR
            </button>

            {/* Print Label */}
            <button
              className="w-full py-3.5 rounded-2xl text-sm font-semibold"
              style={{
                background: "rgba(255,255,255,0.07)",
                color: "#FFFFFF",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(20px)",
              }}
            >
              Print Label
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
