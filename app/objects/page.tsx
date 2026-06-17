"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

const filterTabs = ["All", "Devices", "Plants", "Equipment"];

const objects = [
  {
    href: "/objects/water-pump",
    image: "/images/obj-water-pump.jpg",
    name: "Water Pump",
    location: "Lake",
    statusDot: "#4ADE80",
    statusText: "On",
    statusColor: "#4ADE80",
  },
  {
    href: "/objects/ficus-tree",
    image: "/images/obj-ficus-tree.jpg",
    name: "Ficus Tree",
    location: "Living Room",
    statusDot: "#4ADE80",
    statusText: "Good",
    statusColor: "#4ADE80",
  },
  {
    href: "/objects/air-conditioner",
    image: "/images/obj-air-conditioner.jpg",
    name: "Air Conditioner",
    location: "House",
    statusDot: "#4ADE80",
    statusText: "On",
    statusColor: "#4ADE80",
  },
  {
    href: "/objects/lawn-mower",
    image: "/images/obj-lawn-mower.jpg",
    name: "Lawn Mower",
    location: "Garden",
    statusDot: "#9CA3AF",
    statusText: "Idle",
    statusColor: "#9CA3AF",
  },
  {
    href: "/objects/security-camera",
    image: "/images/obj-security-camera.jpg",
    name: "Security Camera",
    location: "Driveway",
    statusDot: null,
    statusText: "3 Active",
    statusColor: "#FFFFFF",
  },
];

export default function ObjectsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col pb-28">
      <StatusBar />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2">
        <h1 className="text-white font-bold" style={{ fontSize: 26 }}>
          Objects
        </h1>
        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            className="bg-[#1A2438] rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Search"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M16.5 16.5L21 21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          {/* Filter button */}
          <button
            className="bg-[#1A2438] rounded-full w-10 h-10 flex items-center justify-center"
            aria-label="Filter"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H20"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M7 12H17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M10 18H14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
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

      {/* Objects list */}
      <div className="px-4 mt-4 space-y-3">
        {objects.map((obj) => (
          <Link key={obj.href} href={obj.href}>
            <div className="bg-[#131C2E] rounded-2xl p-3 flex items-center gap-3">
              {/* Object thumbnail */}
              <img
                src={obj.image}
                alt=""
                draggable={false}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 12,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />

              {/* Center info */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-base leading-tight">
                  {obj.name}
                </p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">{obj.location}</p>
              </div>

              {/* Right status */}
              <div className="flex-shrink-0">
                <span
                  className="text-sm font-medium"
                  style={{ color: obj.statusColor }}
                >
                  {obj.statusDot && (
                    <span style={{ color: obj.statusDot }}>● </span>
                  )}
                  {obj.statusText}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
