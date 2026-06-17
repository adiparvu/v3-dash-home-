export default function StatusBar({ transparent }: { transparent?: boolean }) {
  return (
    <div
      className={`flex justify-between items-center px-6 pt-3 pb-1 text-white text-sm font-semibold ${
        transparent ? "absolute top-0 left-0 right-0 z-20" : "relative"
      }`}
    >
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="0.5" fill="white" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" fill="white" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="white" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="white" />
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
          <path d="M8 9.5C8.69036 9.5 9.25 10.0596 9.25 10.75C9.25 11.4404 8.69036 12 8 12C7.30964 12 6.75 11.4404 6.75 10.75C6.75 10.0596 7.30964 9.5 8 9.5Z" fill="white" />
          <path d="M4.34 7.16C5.28 6.22 6.57 5.65 8 5.65C9.43 5.65 10.72 6.22 11.66 7.16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M1.5 4.5C3.07 2.93 5.42 2 8 2C10.58 2 12.93 2.93 14.5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="white" strokeOpacity="0.35" />
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill="white" />
          <path d="M23 4V8C23.8284 7.66667 24.5 7 24.5 6C24.5 5 23.8284 4.33333 23 4Z" fill="white" fillOpacity="0.4" />
        </svg>
      </div>
    </div>
  );
}
