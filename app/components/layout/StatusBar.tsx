export default function StatusBar({ transparent }: { transparent?: boolean }) {
  return (
    <div
      className={`flex justify-between items-center px-6 pt-3.5 pb-1 ${
        transparent ? "absolute top-0 left-0 right-0 z-20" : "relative"
      }`}
      style={{ color: "var(--text-1)" }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "-0.3px",
          color: "var(--text-1)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        9:41
      </span>

      {/* Dynamic Island placeholder (pill shape) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          top: 10,
          width: 120,
          height: 34,
          borderRadius: 20,
          background: "#000000",
        }}
      />

      {/* Status icons */}
      <div className="flex items-center gap-1.5" style={{ color: "var(--text-1)" }}>
        {/* Cellular signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0"    y="8"   width="3" height="4"   rx="0.8" />
          <rect x="4.5"  y="5.5" width="3" height="6.5" rx="0.8" />
          <rect x="9"    y="3"   width="3" height="9"   rx="0.8" />
          <rect x="13.5" y="0"   width="3" height="12"  rx="0.8" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <circle cx="8" cy="11" r="1.4" fill="currentColor" />
          <path d="M4.5 7.4C5.38 6.52 6.62 6 8 6s2.62.52 3.5 1.4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M1.8 4.7C3.4 3.1 5.6 2.1 8 2.1s4.6 1 6.2 2.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" strokeOpacity="0.30" />
          <rect x="2"   y="2"   width="17" height="8"   rx="1.8" fill="currentColor" />
          <path d="M23 4v4c.83-.4 1.4-1.15 1.4-2S23.83 4.4 23 4z" fill="currentColor" fillOpacity="0.38" />
        </svg>
      </div>
    </div>
  );
}
