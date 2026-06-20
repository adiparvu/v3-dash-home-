"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import StatusBar from "../../../components/layout/StatusBar";
import { useT, type MessageKey } from "../../../lib/i18n";
import { useStore } from "../../../lib/store";
import { useAssets } from "../../../lib/useAssets";
import { useAssetRecords } from "../../../lib/useAssetRecords";
import QrPrinter from "../../../components/inventory/QrPrinter";

// Translate stored (English) category/location/status values for display.
const CAT_KEY: Record<string, MessageKey> = { Devices: "inv.catDevices", Plants: "inv.catPlants", Equipment: "inv.catEquipment", Vehicles: "inv.catVehicles" };
const LOC_KEY: Record<string, MessageKey> = { Lake: "inv.locLake", Forest: "inv.locForest", Greenhouse: "inv.locGreenhouse", Orchard: "inv.locOrchard", Garden: "inv.locGarden", House: "inv.locHouse", Driveway: "inv.locDriveway" };
const STATUS_KEY: Record<string, MessageKey> = { Active: "inv.statusActive", Idle: "inv.statusIdle", Offline: "inv.statusOffline" };

type Resolved = { name: string; category: string; location: string; status: string; statusColor: string; icon: string; accentColor: string; assetId: string; detailHref: string };

const assetLookup: Record<string, {
  nameKey: MessageKey;
  categoryKey: MessageKey;
  locationKey: MessageKey;
  statusKey: MessageKey;
  statusColor: string;
  icon: string;
  accentColor: string;
  assetId: string;
  detailHref: string;
}> = {
  "WP-001": {
    nameKey: "qrr.nameWaterPump",
    categoryKey: "inv.catEquipment",
    locationKey: "qrr.locLakeZone",
    statusKey: "qrr.statusOn",
    statusColor: "#4ADE80",
    icon: "⚙️",
    accentColor: "#22D3EE",
    assetId: "WP-001",
    detailHref: "/inventory/water-pump",
  },
  "FT-002": {
    nameKey: "qrr.nameFicus",
    categoryKey: "inv.catPlants",
    locationKey: "qrr.locLivingRoom",
    statusKey: "qrr.statusHealthy",
    statusColor: "#4ADE80",
    icon: "🌱",
    accentColor: "#4ADE80",
    assetId: "FT-002",
    detailHref: "/inventory/ficus-tree",
  },
  "AC-003": {
    nameKey: "qrr.nameAC",
    categoryKey: "inv.catDevices",
    locationKey: "qrr.locMasterBedroom",
    statusKey: "qrr.statusOn",
    statusColor: "#4ADE80",
    icon: "❄️",
    accentColor: "#22D3EE",
    assetId: "AC-003",
    detailHref: "/inventory/air-conditioner",
  },
  "LM-004": {
    nameKey: "qrr.nameMower",
    categoryKey: "inv.catEquipment",
    locationKey: "qrr.locGarden",
    statusKey: "qrr.statusIdle",
    statusColor: "#9CA3AF",
    icon: "🌿",
    accentColor: "#4ADE80",
    assetId: "LM-004",
    detailHref: "/inventory/lawn-mower",
  },
  "SC-005": {
    nameKey: "qrr.nameCamera",
    categoryKey: "inv.catDevices",
    locationKey: "qrr.locDriveway",
    statusKey: "qrr.status3Active",
    statusColor: "#FFFFFF",
    icon: "📷",
    accentColor: "#7C3AED",
    assetId: "SC-005",
    detailHref: "/inventory/security-camera",
  },
  "IS-006": {
    nameKey: "qrr.nameIrrigation",
    categoryKey: "inv.catEquipment",
    locationKey: "qrr.locOrchard",
    statusKey: "qrr.statusActive",
    statusColor: "#4ADE80",
    icon: "💧",
    accentColor: "#22D3EE",
    assetId: "IS-006",
    detailHref: "/inventory/irrigation-system",
  },
};

export default function QRResultPage() {
  const t = useT();
  const tx = (m: Record<string, MessageKey>, v: string) => (m[v] ? t(m[v]) : v);
  const [printing, setPrinting] = useState(false);
  const router = useRouter();
  const params = useParams<{ code: string }>();
  const decodedCode = decodeURIComponent(params.code).toUpperCase();
  const { findAsset, estateName, profile } = useStore();
  const { assets: liveAssets } = useAssets();

  // Resolve a scanned/typed code: demo catalog first, then real assets (custom
  // store + live/seed inventory) matched by slug.
  const demo = assetLookup[decodedCode];
  const slug = decodedCode.toLowerCase();
  const real = !demo ? (findAsset(slug) ?? liveAssets.find((a) => a.href === `/inventory/${slug}`)) : undefined;

  const resolved: Resolved | null = demo
    ? { name: t(demo.nameKey), category: t(demo.categoryKey), location: t(demo.locationKey), status: t(demo.statusKey), statusColor: demo.statusColor, icon: demo.icon, accentColor: demo.accentColor, assetId: demo.assetId, detailHref: demo.detailHref }
    : real
    ? { name: real.name, category: tx(CAT_KEY, real.category), location: tx(LOC_KEY, real.location), status: tx(STATUS_KEY, real.status), statusColor: real.statusColor, icon: real.icon, accentColor: real.accentColor, assetId: decodedCode, detailHref: real.href }
    : null;

  // Loan state lives in localStorage keyed by the asset's detail slug.
  const loanSlug = resolved ? (resolved.detailHref.split("/").filter(Boolean).pop() ?? "") : "";
  const { records: assetRecords, clearLoan } = useAssetRecords(loanSlug);
  const loan = assetRecords.loan ?? null;

  if (!resolved) {
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
          <h1 className="text-white font-bold text-xl">{t("qrr.scanResult")}</h1>
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

          <h2 className="text-white font-bold text-2xl mb-2">{t("qrr.notFound")}</h2>
          <p className="text-sm text-center mb-1" style={{ color: "#9CA3AF" }}>
            {t("qrr.noMatch")}
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
            {t("qrr.tryAgain")}
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
            {t("qrr.backToInventory")}
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
        <h1 className="text-white font-bold text-xl">{t("qrr.scanResult")}</h1>
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

        <p className="text-sm font-medium mb-1" style={{ color: "#4ADE80" }}>{t("qrr.assetFound")}</p>
        <h2 className="text-white font-bold text-2xl mb-6">{resolved.name}</h2>

        {/* Loan banner — visible to whoever scans the item */}
        {loan && (
          <div className="w-full rounded-2xl p-4 mb-4" style={{ background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.30)" }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">🤝</span>
              <p className="text-sm font-semibold" style={{ color: "#F59E0B" }}>{t("loan.lentTo")} {loan.borrower}</p>
            </div>
            {loan.contact && <p className="text-xs" style={{ color: "#9CA3AF" }}>{loan.contact}</p>}
            {loan.since && <p className="text-xs" style={{ color: "#9CA3AF" }}>{t("loan.since")} {loan.since}</p>}
            {loan.note && <p className="text-sm mt-1" style={{ color: "#C9CDD6" }}>{loan.note}</p>}
            <button onClick={clearLoan} className="w-full mt-3 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-transform" style={{ background: "rgba(74,222,128,0.14)", color: "#4ADE80", border: "1px solid rgba(74,222,128,0.25)" }}>
              {t("loan.markReturned")}
            </button>
          </div>
        )}

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
                background: `${resolved.accentColor}12`,
                border: `1px solid ${resolved.accentColor}25`,
              }}
            >
              {resolved.icon}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold">{resolved.name}</p>
              <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{resolved.category}</p>
            </div>
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-semibold flex-shrink-0"
              style={{
                background: `${resolved.statusColor}18`,
                color: resolved.statusColor,
                border: `1px solid ${resolved.statusColor}30`,
              }}
            >
              {resolved.status}
            </span>
          </div>

          {/* Info rows */}
          <div
            className="flex items-center justify-between px-4 py-3.5"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm" style={{ color: "#6B7280" }}>{t("qrr.location")}</span>
            <span className="text-sm font-medium text-white">{resolved.location}</span>
          </div>
          <div className="flex items-center justify-between px-4 py-3.5">
            <span className="text-sm" style={{ color: "#6B7280" }}>{t("qrr.assetId")}</span>
            <span className="text-sm font-mono font-semibold" style={{ color: resolved.accentColor }}>
              {resolved.assetId}
            </span>
          </div>
        </div>

        {/* Owner — so a finder knows whose item this is */}
        <div className="w-full rounded-2xl mb-5 px-4 py-3.5" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}>
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: "#6B7280" }}>{t("loan.owner")}</p>
          <p className="text-sm font-medium text-white">{profile.displayName}</p>
          <p className="text-xs mt-0.5" style={{ color: "#9CA3AF" }}>{t("loan.propertyOf")} {estateName}</p>
          {(profile.phone || profile.email) && (
            <a href={profile.phone ? `tel:${profile.phone}` : `mailto:${profile.email}`} className="inline-block text-xs font-medium mt-2" style={{ color: "#22D3EE" }}>
              {t("loan.contactOwner")} · {profile.phone || profile.email}
            </a>
          )}
        </div>

        {/* Action buttons */}
        <Link
          href={resolved.detailHref}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-center block mb-3"
          style={{
            background: "linear-gradient(135deg, #4ADE80, #22D3EE)",
            color: "#050A14",
          }}
        >
          {t("qrr.viewDetails")}
        </Link>

        <button
          onClick={() => setPrinting(true)}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-3 flex items-center justify-center gap-2"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t("idet.printLabel")}
        </button>

        <button
          onClick={() => router.push("/tasks")}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-3 active:scale-[0.98] transition-transform"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "#FFFFFF",
            border: "1px solid rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
          }}
        >
          {t("qrr.addTask")}
        </button>

        <button
          onClick={() => router.push("/diagnostics")}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold mb-6 active:scale-[0.98] transition-transform"
          style={{
            background: "rgba(239,68,68,0.08)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.20)",
          }}
        >
          {t("qrr.reportIssue")}
        </button>

        {/* Back link */}
        <Link href="/inventory" className="text-sm" style={{ color: "#6B7280" }}>
          {t("qrr.backToInventory")}
        </Link>
      </div>

      {printing && (
        <QrPrinter
          path={resolved.detailHref}
          name={resolved.name}
          assetId={resolved.assetId}
          location={resolved.location}
          onDone={() => setPrinting(false)}
        />
      )}
    </div>
  );
}
