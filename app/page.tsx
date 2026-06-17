import Link from "next/link";

export default function More() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0B111E" }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-white tracking-tight">More</h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Tools &amp; advanced features
        </p>
      </div>

      {/* Menu Items */}
      <div className="px-4 flex flex-col gap-3">
        {/* Automation Builder */}
        <Link href="/automation" style={{ textDecoration: "none" }}>
          <div
            style={{
              backgroundColor: "#131C2E",
              border: "1px solid #1E2A3A",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              cursor: "pointer",
            }}
          >
            {/* Icon */}
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "#1A3A4A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Node-RED style icon: two nodes connected */}
                <rect
                  x="1"
                  y="7"
                  width="7"
                  height="5"
                  rx="1.5"
                  fill="#0EA5E9"
                  opacity="0.9"
                />
                <rect
                  x="14"
                  y="7"
                  width="7"
                  height="5"
                  rx="1.5"
                  fill="#22C55E"
                  opacity="0.9"
                />
                <line
                  x1="8"
                  y1="9.5"
                  x2="14"
                  y2="9.5"
                  stroke="#4B5563"
                  strokeWidth="1.5"
                />
                <circle cx="8" cy="9.5" r="1.5" fill="#0EA5E9" />
                <circle cx="14" cy="9.5" r="1.5" fill="#22C55E" />
                {/* lower nodes hinting more complexity */}
                <rect
                  x="7"
                  y="14"
                  width="6"
                  height="4"
                  rx="1"
                  fill="#1E3A50"
                  opacity="0.7"
                />
                <line
                  x1="10"
                  y1="12"
                  x2="10"
                  y2="14"
                  stroke="#4B5563"
                  strokeWidth="1.2"
                />
              </svg>
            </div>
            {/* Text */}
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Automation Builder
              </p>
              <p style={{ color: "#6B7280", fontSize: "13px" }}>
                Visual Node-RED workflow editor
              </p>
            </div>
            {/* Chevron */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 5l4 4-4 4"
                stroke="#4B5563"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </Link>

        {/* Placeholder items to suggest a fuller More screen */}
        {[
          {
            label: "Settings",
            desc: "Account & app preferences",
            color: "#2A1A3A",
            iconColor: "#A855F7",
          },
          {
            label: "Data Export",
            desc: "Download your sensor data",
            color: "#1A3A1A",
            iconColor: "#22C55E",
          },
          {
            label: "Integrations",
            desc: "Connect third-party services",
            color: "#3A2A1A",
            iconColor: "#F59E0B",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              backgroundColor: "#131C2E",
              border: "1px solid #1E2A3A",
              borderRadius: "16px",
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              opacity: 0.55,
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: item.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <p
                style={{
                  color: "white",
                  fontWeight: "600",
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                {item.label}
              </p>
              <p style={{ color: "#6B7280", fontSize: "13px" }}>{item.desc}</p>
            </div>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 5l4 4-4 4"
                stroke="#4B5563"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Bottom Nav hint */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#0D1520",
          borderTop: "1px solid #1E2A3A",
          display: "flex",
          justifyContent: "space-around",
          padding: "14px 0 20px",
        }}
      >
        {[
          { label: "Home", icon: "⌂", active: false },
          { label: "Data", icon: "◈", active: false },
          { label: "Map", icon: "◎", active: false },
          { label: "More", icon: "···", active: true },
        ].map((tab) => (
          <div
            key={tab.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              cursor: "pointer",
            }}
          >
            <span
              style={{
                fontSize: "18px",
                color: tab.active ? "#0EA5E9" : "#4B5563",
                lineHeight: 1,
              }}
            >
              {tab.icon}
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: tab.active ? "600" : "400",
                color: tab.active ? "#0EA5E9" : "#4B5563",
              }}
            >
              {tab.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
