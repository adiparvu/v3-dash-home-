"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../components/layout/StatusBar";
import { useStore } from "../../lib/store";
import { useAssets } from "../../lib/useAssets";
import { useT, type MessageKey } from "../../lib/i18n";
import AssetQrCard from "../../components/inventory/AssetQrCard";
import { useAssetRecords } from "../../lib/useAssetRecords";
import { useAssetDocuments } from "../../lib/useAssetDocuments";

const NAME_KEY: Record<string, MessageKey> = {
  "Water Pump": "qrr.nameWaterPump", "Ficus Tree": "qrr.nameFicus", "Air Conditioner": "qrr.nameAC",
  "Lawn Mower": "qrr.nameMower", "Security Camera": "qrr.nameCamera", "Irrigation System": "qrr.nameIrrigation",
};
const CAT_KEY: Record<string, MessageKey> = {
  Devices: "inv.catDevices", Plants: "inv.catPlants", Equipment: "inv.catEquipment", Vehicles: "inv.catVehicles",
};
const LOC_KEY: Record<string, MessageKey> = {
  "Lake Zone": "qrr.locLakeZone", "Living Room": "qrr.locLivingRoom", "Master Bedroom": "qrr.locMasterBedroom",
  Garden: "qrr.locGarden", Driveway: "qrr.locDriveway", Orchard: "qrr.locOrchard",
  Lake: "inv.locLake", Forest: "inv.locForest", Greenhouse: "inv.locGreenhouse", House: "inv.locHouse",
};
const STATUS_KEY: Record<string, MessageKey> = {
  On: "qrr.statusOn", Healthy: "qrr.statusHealthy", Idle: "qrr.statusIdle", Active: "qrr.statusActive", "3 Active": "qrr.status3Active",
  Active2: "inv.statusActive",
};

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

const tabs: { id: string; labelKey: MessageKey }[] = [
  { id: "Details", labelKey: "idet.tabDetails" },
  { id: "Maintenance", labelKey: "idet.tabMaintenance" },
  { id: "Documents", labelKey: "idet.tabDocuments" },
  { id: "QR Code", labelKey: "idet.tabQr" },
];

const maintenanceItems: { titleKey: MessageKey; date: string; statusKey: MessageKey; statusColor: string }[] = [
  { titleKey: "idet.mFilter", date: "Jun 10, 2026", statusKey: "idet.mScheduled", statusColor: "#F59E0B" },
  { titleKey: "idet.mInspection", date: "Apr 2, 2026", statusKey: "idet.mCompleted", statusColor: "#4ADE80" },
  { titleKey: "idet.mBelt", date: "Jan 15, 2026", statusKey: "idet.mCompleted", statusColor: "#4ADE80" },
];

const documents: { nameKey: MessageKey; size: string; icon: string }[] = [
  { nameKey: "idet.docManual", size: "4.2 MB", icon: "📄" },
  { nameKey: "idet.docWarranty", size: "1.1 MB", icon: "🛡️" },
  { nameKey: "idet.docInvoice", size: "0.8 MB", icon: "🧾" },
];

function humanSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function InventoryDetailPage() {
  const t = useT();
  const tx = (map: Record<string, MessageKey>, v: string) => (map[v] ? t(map[v]) : v);
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Details");
  const [menuOpen, setMenuOpen] = useState(false);
  const { findAsset, removeAsset } = useStore();
  const router = useRouter();
  const { records, addMaintenance, toggleMaintenance, removeMaintenance, addDocument, removeDocument, setLoan, clearLoan } = useAssetRecords(params.id);
  const loan = records.loan ?? null;
  const [maintOpen, setMaintOpen] = useState(false);
  const [maintTitle, setMaintTitle] = useState("");
  const [maintDate, setMaintDate] = useState("");
  const [lendOpen, setLendOpen] = useState(false);
  const [lendBorrower, setLendBorrower] = useState("");
  const [lendContact, setLendContact] = useState("");
  const [lendDate, setLendDate] = useState("");
  const [lendNote, setLendNote] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const editHref = `${(findAsset(params.id)?.href) ?? `/inventory/${params.id}`}/edit`;

  const custom = findAsset(params.id);
  const { assets: liveAssets, source: assetsSource } = useAssets();
  const remote = liveAssets.find((a) => a.href === `/inventory/${params.id}`);
  const synced = !custom && !assetData[params.id] && !!remote && assetsSource === "remote";
  const remoteDocs = useAssetDocuments(params.id, synced);

  const asset = custom
    ? {
        ...defaultAsset,
        name: custom.name,
        category: custom.category,
        location: custom.location,
        status: custom.status,
        statusColor: custom.statusColor,
        icon: custom.icon,
        accentColor: custom.accentColor,
        assetId: params.id.toUpperCase().slice(0, 10),
        brand: custom.brand || "—",
        model: custom.model || "—",
        serial: custom.serial || "—",
        purchaseDate: custom.purchaseDate || "—",
        warranty: custom.warranty || "—",
      }
    : assetData[params.id]
    ? assetData[params.id]
    : synced && remote
    ? {
        ...defaultAsset,
        name: remote.name,
        category: remote.category,
        location: remote.location,
        status: remote.status,
        statusColor: remote.statusColor,
        icon: remote.icon,
        accentColor: remote.accentColor,
        assetId: params.id.toUpperCase().slice(0, 10),
        brand: "—",
        model: "—",
        serial: "—",
        purchaseDate: "—",
        warranty: "—",
      }
    : defaultAsset;

  // Quantity / value / notes only exist on user-added assets.
  const extraQuantity = custom?.quantity?.trim() ?? "";
  const extraValue = custom?.value?.trim() ?? "";
  const extraNotes = custom?.notes?.trim() ?? "";

  // Sample maintenance/document rows are illustrative — only show them on the
  // original demo seed assets, never on custom or synced/real ones.
  const showSamples = !custom && !synced && !!assetData[params.id];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-1)" }}>
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
          onClick={() => setMenuOpen(true)}
          aria-label={t("idet.moreOptions")}
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
          background: "var(--glass-bg)",
          border: "0.5px solid var(--glass-border)",
          backdropFilter: "blur(20px)",
          minHeight: "calc(100vh - 232px)",
        }}
      >
        {/* Asset name + status */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-2xl leading-tight" style={{ color: "var(--text-1)" }}>{tx(NAME_KEY, asset.name)}</h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={synced
              ? { background: "rgba(74,222,128,0.15)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }
              : { background: "rgba(255,255,255,0.06)", color: "#9CA3AF", border: "1px solid rgba(255,255,255,0.12)" }}>
              {synced ? t("idet.synced") : t("idet.demo")}
            </span>
            {loan && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "1px solid rgba(245,158,11,0.30)" }}>
                {t("loan.status")}
              </span>
            )}
          </div>
          <span
            className="mt-1 px-3 py-1 rounded-full text-xs font-semibold flex-shrink-0"
            style={{
              background: `${asset.statusColor}18`,
              color: asset.statusColor,
              border: `1px solid ${asset.statusColor}30`,
            }}
          >
            {tx(STATUS_KEY, asset.status)}
          </span>
        </div>

        {/* Category · Location */}
        <p className="text-sm mb-4" style={{ color: "var(--text-2)" }}>
          {tx(CAT_KEY, asset.category)}
          <span className="mx-1.5 opacity-40">·</span>
          {tx(LOC_KEY, asset.location)}
        </p>

        {/* Tabs */}
        <div
          className="flex rounded-2xl p-1 mb-5"
          style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)" }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 text-xs font-medium rounded-xl transition-all"
              style={
                activeTab === tab.id
                  ? { background: "var(--glass-bg-strong)", color: "var(--text-1)", boxShadow: "var(--glass-shadow)" }
                  : { color: "var(--text-3)" }
              }
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "Details" && (
          <div>
            {/* Info rows */}
            <div className="liquid-glass rounded-2xl overflow-hidden mb-4">
              {[
                { label: t("idet.brand"), value: asset.brand },
                { label: t("idet.model"), value: asset.model },
                { label: t("idet.serial"), value: asset.serial },
                { label: t("idet.purchaseDate"), value: asset.purchaseDate },
                { label: t("idet.warranty"), value: asset.warranty === "N/A" ? t("idet.na") : asset.warranty },
                { label: t("idet.location"), value: tx(LOC_KEY, asset.location) },
                ...(extraQuantity ? [{ label: t("idet.quantity"), value: extraQuantity }] : []),
                ...(extraValue ? [{ label: t("idet.value"), value: extraValue }] : []),
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-4 py-3.5"
                  style={i < arr.length - 1 ? { borderBottom: "0.5px solid var(--glass-border)" } : {}}
                >
                  <span className="text-sm" style={{ color: "var(--text-3)" }}>{row.label}</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Notes */}
            {extraNotes && (
              <div className="liquid-glass rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "var(--text-3)" }}>{t("idet.notes")}</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-1)" }}>{extraNotes}</p>
              </div>
            )}

            {/* Loan */}
            <div className="liquid-glass rounded-2xl p-4 mb-4" style={loan ? { border: "1px solid rgba(245,158,11,0.30)" } : undefined}>
              {loan ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: "#F59E0B" }}>{t("loan.onLoan")}</p>
                  <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t("loan.lentTo")} {loan.borrower}</p>
                  {loan.contact && <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{loan.contact}</p>}
                  {loan.since && <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{t("loan.since")} {loan.since}</p>}
                  {loan.note && <p className="text-sm mt-1.5" style={{ color: "var(--text-2)" }}>{loan.note}</p>}
                  <button onClick={clearLoan} className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform" style={{ background: "rgba(74,222,128,0.12)", color: "var(--accent)", border: "1px solid rgba(74,222,128,0.25)" }}>
                    {t("loan.markReturned")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => { setLendBorrower(""); setLendContact(""); setLendDate(""); setLendNote(""); setLendOpen(true); }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  style={{ background: "var(--glass-bg)", color: "var(--text-1)", border: "0.5px solid var(--glass-border)" }}
                >
                  <span>🤝</span> {t("loan.lendItem")}
                </button>
              )}
            </div>

            {/* Loan history — who borrowed it and when it came back */}
            {(records.loanHistory?.length ?? 0) > 0 && (
              <div className="liquid-glass rounded-2xl p-4 mb-4">
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>{t("loan.history")}</p>
                <div className="space-y-3">
                  {records.loanHistory!.map((h, i) => (
                    <div key={`${h.borrower}-${h.returnedAt}-${i}`} className="flex items-start gap-3">
                      <span className="text-base mt-0.5">↩️</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{h.borrower}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>
                          {h.since} → {t("loan.returned")} {h.returnedAt}
                        </p>
                        {h.note && <p className="text-xs mt-0.5" style={{ color: "var(--text-2)" }}>{h.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "var(--text-3)" }}>
              {t("idet.quickActions")}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {[
                {
                  label: t("idet.actHistory"),
                  onClick: () => setActiveTab("Maintenance"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="#22D3EE" strokeWidth="1.75" />
                      <path d="M12 7v5l3 3" stroke="#22D3EE" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ),
                  color: "#22D3EE",
                },
                {
                  label: t("idet.actTasks"),
                  onClick: () => router.push("/tasks"),
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 11l3 3L22 4" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="#4ADE80" strokeWidth="1.75" strokeLinecap="round" />
                    </svg>
                  ),
                  color: "#4ADE80",
                },
                {
                  label: t("idet.actAlert"),
                  onClick: () => router.push("/diagnostics"),
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
                  label: t("idet.actSettings"),
                  onClick: () => router.push(editHref),
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
                  onClick={action.onClick}
                  className="flex flex-col items-center gap-2 rounded-2xl py-3.5 active:scale-95 transition-transform"
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
            <div className="liquid-glass rounded-2xl overflow-hidden mb-4">
              {/* User-scheduled maintenance (tap title to toggle done) */}
              {records.maintenance.map((m) => {
                const color = m.done ? "#4ADE80" : "#F59E0B";
                return (
                  <div key={m.id} className="flex items-center justify-between px-4 py-4" style={{ borderBottom: "0.5px solid var(--glass-border)" }}>
                    <button onClick={() => toggleMaintenance(m.id)} className="flex-1 text-left min-w-0 pr-2">
                      <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{m.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{m.date || "—"}</p>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold" style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}>
                        {m.done ? t("idet.mCompleted") : t("idet.mScheduled")}
                      </span>
                      <button onClick={() => removeMaintenance(m.id)} aria-label={t("idet.remove")} className="text-sm px-1" style={{ color: "#EF4444" }}>✕</button>
                    </div>
                  </div>
                );
              })}
              {/* Sample maintenance history (demo seed assets only) */}
              {showSamples && maintenanceItems.map((item, i) => (
                <div
                  key={item.titleKey}
                  className="flex items-center justify-between px-4 py-4"
                  style={i < maintenanceItems.length - 1 ? { borderBottom: "0.5px solid var(--glass-border)" } : {}}
                >
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(item.titleKey)}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{item.date}</p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                    style={{
                      background: `${item.statusColor}18`,
                      color: item.statusColor,
                      border: `1px solid ${item.statusColor}30`,
                    }}
                  >
                    {t(item.statusKey)}
                  </span>
                </div>
              ))}
              {/* Empty state when there is nothing to show */}
              {records.maintenance.length === 0 && !showSamples && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>{t("idet.noMaintenance")}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => { setMaintTitle(""); setMaintDate(""); setMaintOpen(true); }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-transform"
              style={{ background: "rgba(74,222,128,0.12)", color: "var(--accent)", border: "1px solid rgba(74,222,128,0.25)" }}
            >
              {t("idet.scheduleMaint")}
            </button>
          </div>
        )}

        {activeTab === "Documents" && (() => {
          // Prefer the Supabase-backed list when available; otherwise the local
          // prototype store. Shape both into one view model.
          const userDocs = remoteDocs.active
            ? remoteDocs.documents.map((d) => ({ id: d.id, name: d.name, size: d.size, url: d.url }))
            : records.documents.map((d) => ({ id: d.id, name: d.name, size: d.size, url: d.dataUrl }));
          const removeDoc = remoteDocs.active ? remoteDocs.remove : removeDocument;
          return (
          <div>
            <div className="liquid-glass rounded-2xl overflow-hidden mb-4">
              {/* User documents (remote Storage or local) */}
              {userDocs.map((doc) => (
                <div key={doc.id} className="flex items-center gap-3.5 px-4 py-4" style={{ borderBottom: "0.5px solid var(--glass-border)" }}>
                  <span className="text-2xl">📎</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--text-1)" }}>{doc.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{doc.size}</p>
                  </div>
                  {doc.url && (
                    <a
                      href={doc.url}
                      download={doc.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t("idet.download")}
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-2)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 19l7 0 7 0M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  )}
                  <button onClick={() => removeDoc(doc.id)} aria-label={t("idet.remove")} className="text-sm px-1 flex-shrink-0" style={{ color: "#EF4444" }}>✕</button>
                </div>
              ))}
              {/* Sample documents (demo seed assets only) */}
              {showSamples && documents.map((doc, i) => (
                <div
                  key={doc.nameKey}
                  className="flex items-center gap-3.5 px-4 py-4"
                  style={i < documents.length - 1 ? { borderBottom: "0.5px solid var(--glass-border)" } : {}}
                >
                  <span className="text-2xl">{doc.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "var(--text-1)" }}>{t(doc.nameKey)}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-3)" }}>{doc.size}</p>
                  </div>
                </div>
              ))}
              {/* Empty state when there is nothing to show */}
              {userDocs.length === 0 && !showSamples && (
                <div className="px-4 py-8 text-center">
                  <p className="text-sm" style={{ color: "var(--text-3)" }}>{t("idet.noDocuments")}</p>
                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (remoteDocs.active) {
                  remoteDocs.upload(file);
                } else {
                  const reader = new FileReader();
                  reader.onload = () => addDocument(file.name, humanSize(file.size), typeof reader.result === "string" ? reader.result : undefined);
                  reader.readAsDataURL(file);
                }
                e.target.value = "";
              }}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-transform"
              style={{ background: "var(--glass-bg)", color: "var(--text-2)", border: "0.5px solid var(--glass-border)" }}
            >
              {t("idet.uploadDoc")}
            </button>
          </div>
          );
        })()}

        {activeTab === "QR Code" && (
          <AssetQrCard
            path={custom?.href ?? `/inventory/${params.id}`}
            assetName={tx(NAME_KEY, asset.name)}
            assetId={asset.assetId}
            location={tx(LOC_KEY, asset.location)}
          />
        )}
      </div>

      {/* Schedule-maintenance sheet */}
      {maintOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setMaintOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <p className="font-bold text-base mb-4" style={{ color: "var(--text-1)" }}>{t("idet.scheduleTitle")}</p>
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("idet.maintTitleLabel")}</label>
            <input
              value={maintTitle}
              onChange={(e) => setMaintTitle(e.target.value)}
              placeholder={t("idet.maintTitlePh")}
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3"
              style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }}
            />
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("idet.maintDateLabel")}</label>
            <input
              type="date"
              value={maintDate}
              onChange={(e) => setMaintDate(e.target.value)}
              className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-4"
              style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)", colorScheme: "dark" }}
            />
            <button
              onClick={() => { if (maintTitle.trim()) { addMaintenance(maintTitle.trim(), maintDate); setMaintOpen(false); } }}
              disabled={!maintTitle.trim()}
              className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 transition-all"
              style={maintTitle.trim() ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
            >
              {t("idet.save")}
            </button>
            <button onClick={() => setMaintOpen(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("idet.cancel")}</button>
          </div>
        </div>
      )}

      {/* Lend-item sheet */}
      {lendOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setLendOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <p className="font-bold text-base mb-4" style={{ color: "var(--text-1)" }}>{t("loan.lendItem")}</p>
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("loan.borrower")}</label>
            <input value={lendBorrower} onChange={(e) => setLendBorrower(e.target.value)} placeholder={t("loan.borrowerPh")} className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }} />
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("loan.contact")}</label>
            <input value={lendContact} onChange={(e) => setLendContact(e.target.value)} placeholder={t("loan.contactPh")} className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }} />
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("loan.date")}</label>
            <input type="date" value={lendDate} onChange={(e) => setLendDate(e.target.value)} className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-3" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)", colorScheme: "dark" }} />
            <label className="text-xs font-medium block mb-1.5 px-1" style={{ color: "var(--text-2)" }}>{t("loan.note")}</label>
            <input value={lendNote} onChange={(e) => setLendNote(e.target.value)} placeholder={t("loan.notePh")} className="w-full rounded-2xl px-4 py-3 text-sm outline-none mb-4" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)", caretColor: "var(--accent)" }} />
            <button
              onClick={() => { if (lendBorrower.trim()) { setLoan({ borrower: lendBorrower.trim(), contact: lendContact.trim() || undefined, since: lendDate || new Date().toISOString().slice(0, 10), note: lendNote.trim() || undefined }); setLendOpen(false); } }}
              disabled={!lendBorrower.trim()}
              className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 transition-all"
              style={lendBorrower.trim() ? { background: "var(--accent)", color: "#08111E" } : { background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-3)" }}
            >
              {t("idet.save")}
            </button>
            <button onClick={() => setLendOpen(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("idet.cancel")}</button>
          </div>
        </div>
      )}

      {/* Action sheet */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: "rgba(0,0,0,0.45)" }} onClick={() => setMenuOpen(false)}>
          <div className="w-full md:w-[390px] rounded-t-[28px] p-5 pb-8 animate-slide-up liquid-glass-strong" onClick={(e) => e.stopPropagation()}>
            <div className="w-10 h-1 rounded-full mx-auto mb-4" style={{ background: "var(--glass-border)" }} />
            <p className="font-bold text-base mb-1" style={{ color: "var(--text-1)" }}>{tx(NAME_KEY, asset.name)}</p>
            <p className="text-xs mb-5" style={{ color: "var(--text-2)" }}>{custom ? t("idet.customAsset") : t("idet.seedAsset")}</p>
            {custom ? (
              <>
                <button
                  onClick={() => router.push(`${custom.href}/edit`)}
                  className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                  style={{ background: "var(--glass-bg)", color: "var(--text-1)", border: "0.5px solid var(--glass-border)" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t("idet.editAsset")}
                </button>
                <button
                  onClick={() => { removeAsset(custom.href); router.push("/inventory"); }}
                  className="w-full py-3.5 rounded-2xl font-semibold text-base mb-2 active:scale-[0.97] transition-transform flex items-center justify-center gap-2"
                  style={{ background: "rgba(239,68,68,0.12)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.30)" }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H6a1 1 0 01-1-1V6m4 5v6m6-6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {t("idet.deleteAsset")}
                </button>
              </>
            ) : (
              <p className="text-center text-sm py-2 mb-2" style={{ color: "var(--text-3)" }}>{t("idet.cantDelete")}</p>
            )}
            <button onClick={() => setMenuOpen(false)} className="w-full py-3.5 rounded-2xl font-medium text-base" style={{ background: "var(--glass-bg)", border: "0.5px solid var(--glass-border)", color: "var(--text-1)" }}>{t("idet.cancel")}</button>
          </div>
        </div>
      )}
    </div>
  );
}
