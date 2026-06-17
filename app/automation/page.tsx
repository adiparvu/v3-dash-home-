"use client";

export default function AutomationBuilder() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0B111E" }}
    >
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Automation Builder
        </h1>
        <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
          Visual automation with Node-RED power
        </p>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 px-4 pb-4">
        <div
          className="rounded-2xl w-full h-full"
          style={{
            backgroundColor: "#131C2E",
            minHeight: "480px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid dot background */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(circle, #1E2A3A 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              opacity: 0.6,
            }}
          />

          {/* SVG Connection Lines */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              zIndex: 1,
            }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  fill="#4B5563"
                />
              </marker>
            </defs>

            {/* When -> And: horizontal line (top row) */}
            {/* When node right edge ~x=238, y=118  |  And node left edge ~x=270, y=118 */}
            <line
              x1="238"
              y1="118"
              x2="270"
              y2="118"
              stroke="#4B5563"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
            />

            {/* And -> Then: vertical arrow down */}
            {/* And node bottom ~x=370, y=160  |  Then node top ~x=310, y=280 */}
            <path
              d="M 370 160 L 370 220 L 310 220 L 310 280"
              stroke="#4B5563"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* And -> Notify: vertical then right */}
            {/* And node right ~x=470, y=118  |  Notify node left ~x=494, y=310 */}
            <path
              d="M 470 118 L 510 118 L 510 310 L 494 310"
              stroke="#4B5563"
              strokeWidth="1.5"
              fill="none"
              markerEnd="url(#arrowhead)"
            />

            {/* Then -> Notify: horizontal line (bottom row) */}
            {/* Then node right ~x=430, y=310  |  Notify node left ~x=494, y=310 */}
            <line
              x1="430"
              y1="310"
              x2="494"
              y2="310"
              stroke="#4B5563"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
            />
          </svg>

          {/* Flow Nodes */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              padding: "48px 32px",
            }}
          >
            {/* Top Row */}
            <div
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "flex-start",
                marginBottom: "40px",
              }}
            >
              {/* Node 1: When */}
              <div
                style={{
                  width: "200px",
                  borderRadius: "14px",
                  backgroundColor: "#1A3A4A",
                  padding: "14px 16px",
                  position: "relative",
                  border: "1px solid #1E4A60",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  When
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  Soil Moisture
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  &lt; 30%
                </p>
                {/* Right connector dot */}
                <div
                  style={{
                    position: "absolute",
                    right: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
              </div>

              {/* Node 2: And */}
              <div
                style={{
                  width: "200px",
                  borderRadius: "14px",
                  backgroundColor: "#1A3A28",
                  padding: "14px 16px",
                  position: "relative",
                  border: "1px solid #1E4A30",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  And &gt;
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  No Rain
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  Forecast
                </p>
                {/* Left connector dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
                {/* Right connector dot */}
                <div
                  style={{
                    position: "absolute",
                    right: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
                {/* Bottom connector dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "-6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
              </div>
            </div>

            {/* Bottom Row */}
            <div
              style={{
                display: "flex",
                gap: "32px",
                alignItems: "flex-start",
                marginLeft: "232px",
              }}
            >
              {/* Node 3: Then */}
              <div
                style={{
                  width: "200px",
                  borderRadius: "14px",
                  backgroundColor: "#1A3A28",
                  padding: "14px 16px",
                  position: "relative",
                  border: "1px solid #1E4A30",
                  flexShrink: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    marginBottom: "6px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Then
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  Start Irrigation
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "700",
                    fontSize: "15px",
                    lineHeight: "1.3",
                  }}
                >
                  Zone 1
                </p>
                {/* Top connector dot */}
                <div
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
                {/* Right connector dot */}
                <div
                  style={{
                    position: "absolute",
                    right: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#0EA5E9",
                    border: "2px solid #131C2E",
                  }}
                />
              </div>

              {/* Node 4: Notify */}
              <div
                style={{
                  width: "160px",
                  borderRadius: "14px",
                  backgroundColor: "#0D1520",
                  padding: "14px 16px",
                  position: "relative",
                  border: "1px solid #1E2A3A",
                  flexShrink: 0,
                  cursor: "pointer",
                }}
              >
                <p
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "1.5",
                  }}
                >
                  Notify &gt;
                </p>
                <p
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "15px",
                    lineHeight: "1.5",
                    textDecoration: "underline",
                    textDecorationColor: "#4B5563",
                  }}
                >
                  User &gt;
                </p>
                {/* Left connector dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#4B5563",
                    border: "2px solid #131C2E",
                  }}
                />
                {/* Top connector dot */}
                <div
                  style={{
                    position: "absolute",
                    top: "-6px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: "#4B5563",
                    border: "2px solid #131C2E",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Toolbar */}
      <div className="px-4 pb-10 pt-2">
        <div className="flex gap-3 justify-center">
          {/* + Node button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#131C2E",
              border: "1px solid #1E2A3A",
              borderRadius: "999px",
              padding: "10px 22px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="#9CA3AF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Node
          </button>

          {/* Test button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#131C2E",
              border: "1px solid #1E2A3A",
              borderRadius: "999px",
              padding: "10px 22px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <polygon
                points="8,2 14,8 8,14 2,8"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Test
          </button>

          {/* Deploy button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "#131C2E",
              border: "1px solid #1E2A3A",
              borderRadius: "999px",
              padding: "10px 22px",
              color: "white",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="2.5"
                y="2.5"
                width="11"
                height="11"
                rx="1.5"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            Deploy
          </button>
        </div>
      </div>

      {/* Back link to More / Home */}
      <div className="px-6 pb-6">
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#6B7280",
            fontSize: "13px",
            textDecoration: "none",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 11L5 7l4-4"
              stroke="#6B7280"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to More
        </a>
      </div>
    </div>
  );
}
