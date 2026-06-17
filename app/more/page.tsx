"use client";

import { useState } from "react";
import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

const periods = ["Today", "7D", "30D", "6M", "1Y"];

const timelineItems = [
  {
    bgColor: "#16A34A",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2a1 1 0 0 1 1 1v.5a5.5 5.5 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm0 1.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"
          fill="white"
        />
        <circle cx="10" cy="10" r="1.5" fill="white" />
        <path
          d="M9 10h2M10 9v2"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "Irrigation completed",
    location: "Garden",
    time: "08:30",
  },
  {
    bgColor: "#1D4ED8",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="white" strokeWidth="1.5" />
        <path
          d="M10 6v4l3 2"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    title: "Water pump turned on",
    location: "Lake",
    time: "06:15",
  },
  {
    bgColor: "#EA580C",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 3L2 17h16L10 3z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M10 9v3"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="10" cy="14" r="0.75" fill="white" />
      </svg>
    ),
    title: "Temperature alert",
    location: "House",
    time: "Yesterday 21:42",
  },
  {
    bgColor: "#CA8A04",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="4"
          y="3"
          width="12"
          height="15"
          rx="2"
          stroke="white"
          strokeWidth="1.5"
        />
        <path
          d="M7 8h6M7 11h6M7 14h4"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
    title: "New document added",
    location: "Property",
    time: "Yesterday 15:20",
  },
  {
    bgColor: "#166534",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 17V10"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M10 10C10 10 6 8 5 5c2 0 4 1.5 5 5z"
          fill="white"
          opacity="0.8"
        />
        <path
          d="M10 10C10 10 14 8 15 5c-2 0-4 1.5-5 5z"
          fill="white"
          opacity="0.8"
        />
        <path
          d="M10 13C10 13 7 12 6 9c1.5 0 3.5 1.5 4 4z"
          fill="white"
          opacity="0.6"
        />
        <path
          d="M10 13C10 13 13 12 14 9c-1.5 0-3.5 1.5-4 4z"
          fill="white"
          opacity="0.6"
        />
      </svg>
    ),
    title: "Tree planted",
    location: "Orchard",
    time: "2 days ago",
  },
];

export default function MorePage() {
  const [activePeriod, setActivePeriod] = useState("Today");

  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col">
      <StatusBar />

      <div className="flex-1 overflow-y-auto pb-24">
        <h1 className="text-white text-2xl font-bold px-5 pt-3">Timeline</h1>

        {/* Period Tabs */}
        <div className="px-5 mt-4 flex gap-2">
          {periods.map((period) => (
            <button
              key={period}
              onClick={() => setActivePeriod(period)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activePeriod === period
                  ? "bg-[#7C3AED] text-white"
                  : "bg-[#131C2E] text-[#9CA3AF]"
              }`}
            >
              {period}
            </button>
          ))}
        </div>

        {/* Today label */}
        <p className="px-5 mt-5 text-[#9CA3AF] text-sm font-medium">Today</p>

        {/* Vertical Timeline */}
        <div className="px-5 mt-3 relative">
          {/* Vertical line */}
          <div
            style={{
              position: "absolute",
              left: 39,
              top: 0,
              bottom: 0,
              width: 1,
              backgroundColor: "#1A2438",
            }}
          />

          {timelineItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 items-start pb-6 relative"
            >
              {/* Circle icon */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: "50%",
                  backgroundColor: item.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1,
                }}
              >
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col pt-1">
                <span className="text-white font-bold text-sm">
                  {item.title}
                </span>
                <span className="text-[#9CA3AF] text-xs">{item.location}</span>
                <span className="text-[#9CA3AF] text-xs mt-0.5">
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Timeline Button */}
        <div className="mx-4 mt-4">
          <button className="w-full bg-[#131C2E] rounded-2xl py-4 text-center text-white font-medium">
            View Full Timeline
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
