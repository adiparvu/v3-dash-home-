"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

const filterTabs = ["All", "Outdoor", "Buildings", "Utilities"];

const zones = [
  {
    href: "/zones/lake",
    image: "/images/zone-lake-thumb.jpg",
    name: "Lake",
    status: "Excellent",
    temp: "18.4 °C",
    taskBadge: "2 Tasks",
    numberBadge: null,
  },
  {
    href: "/zones/house",
    image: "/images/zone-house-thumb.jpg",
    name: "House",
    status: "Good",
    temp: "22 °C",
    taskBadge: "3 Tasks",
    numberBadge: null,
  },
  {
    href: "/zones/garden",
    image: "/images/zone-garden-thumb.jpg",
    name: "Garden",
    status: "Good",
    temp: "",
    taskBadge: "1 Task",
    numberBadge: "3",
  },
  {
    href: "/zones/orchard",
    image: "/images/zone-orchard-thumb.jpg",
    name: "Orchard",
    status: "Excellent",
    temp: "—",
    taskBadge: null,
    numberBadge: "3",
  },
  {
    href: "/zones/driveway",
    image: "/images/zone-driveway-thumb.jpg",
    name: "Driveway",
    status: "Good",
    temp: "—",
    taskBadge: "2 Tasks",
    numberBadge: null,
  },
];

export default function ZonesPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col pb-28">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <h1 className="text-white font-bold" style={{ fontSize: 26 }}>
          Zones
        </h1>
        <button
          className="bg-[#1A2438] rounded-full w-10 h-10 flex items-center justify-center text-white text-xl"
          aria-label="Add zone"
        >
          +
        </button>
      </div>

      {/* Filter tabs */}
      <div className="px-5 mt-4 flex gap-3 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? "bg-[#7C3AED] text-white rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap flex-shrink-0"
                : "text-[#9CA3AF] text-sm px-4 py-1.5 whitespace-nowrap flex-shrink-0"
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Zones list */}
      <div className="px-4 mt-4 space-y-3">
        {zones.map((zone) => (
          <Link key={zone.href} href={zone.href}>
            <div className="bg-[#131C2E] rounded-2xl p-3 flex items-center gap-3">
              {/* Zone thumbnail */}
              <img
                src={zone.image}
                alt=""
                draggable={false}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 12,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              {/* Center info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">
                  {zone.name}
                </p>
                <p className="text-[#4ADE80] text-xs mt-0.5">{zone.status}</p>
                {zone.temp ? (
                  <p className="text-[#9CA3AF] text-xs mt-1">{zone.temp}</p>
                ) : null}
              </div>

              {/* Right badges */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {zone.taskBadge && (
                  <span className="bg-[#1A2438] text-[#9CA3AF] rounded-full px-3 py-1 text-xs">
                    {zone.taskBadge}
                  </span>
                )}
                {zone.numberBadge && (
                  <span className="bg-[#1A2438] text-[#9CA3AF] rounded-full w-7 h-7 flex items-center justify-center text-xs font-semibold">
                    {zone.numberBadge}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
