"use client";

import StatusBar from "../components/StatusBar";
import BottomNav from "../components/BottomNav";

const recommendations = [
  {
    bgColor: "#1E3A5F",
    icon: "💧",
    title: "Water quality is excellent",
    subtitle: "Keep monitoring weekly",
  },
  {
    bgColor: "#1A3A1A",
    icon: "🌿",
    title: "Lawn needs fertilization",
    subtitle: "Best time: in 3 days",
  },
  {
    bgColor: "#3A2810",
    icon: "🍂",
    title: "Check trees near the fence",
    subtitle: "Some branches need trimming",
  },
  {
    bgColor: "#3A2008",
    icon: "⚙️",
    title: "Pump maintenance due",
    subtitle: "In 7 days",
  },
];

export default function AIPage() {
  return (
    <div className="min-h-screen bg-[#0B111E] flex flex-col">
      <StatusBar />

      <div className="flex-1 overflow-y-auto pb-24">
        <h1 className="text-white text-2xl font-bold px-5 pt-3">AI Insights</h1>

        {/* Glowing Orb Section */}
        <div className="flex flex-col items-center mt-6 mb-6">
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #9333EA 0%, #7C3AED 40%, #4C1D95 70%, #2E1065 100%)",
              boxShadow:
                "0 0 60px 20px rgba(124, 58, 237, 0.4), 0 0 120px 40px rgba(124, 58, 237, 0.2)",
              position: "relative",
            }}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{ position: "absolute", top: 0, left: 0 }}
            >
              <defs>
                <filter id="glow-eyes">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Left eye */}
              <circle
                cx="70"
                cy="80"
                r="10"
                fill="white"
                filter="url(#glow-eyes)"
              />
              {/* Right eye */}
              <circle
                cx="130"
                cy="80"
                r="10"
                fill="white"
                filter="url(#glow-eyes)"
              />
              {/* Smile */}
              <path
                d="M 65 120 Q 100 145 135 120"
                fill="none"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                filter="url(#glow-eyes)"
              />
            </svg>
          </div>
        </div>

        {/* Proactive Recommendations */}
        <h2 className="text-white font-semibold px-5 mb-3">
          Proactive Recommendations
        </h2>

        <div className="px-4 space-y-3">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-[#131C2E] rounded-2xl p-4 flex items-start gap-3"
            >
              {/* Icon box */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  borderRadius: 12,
                  backgroundColor: rec.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {rec.icon}
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <span className="text-white font-semibold text-sm">
                  {rec.title}
                </span>
                <span className="text-[#9CA3AF] text-xs mt-0.5">
                  {rec.subtitle}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Insights Button */}
        <div className="mx-4 mt-4">
          <button className="w-full bg-[#2D1B69] text-white rounded-2xl py-4 text-center font-semibold">
            View All Insights
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
