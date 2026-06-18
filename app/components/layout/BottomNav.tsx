"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Overview",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4.5v-5h-5v5H5a1 1 0 01-1-1z"
          stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/zones",
    label: "Zones",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3.5" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3.5" y="14" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="6.5" height="6.5" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2l9 5v10l-9 5-9-5V7z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3 7l9 5 9-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11.5l2.5 2.5 5-5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/more",
    label: "More",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="5.5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        <circle cx="18.5" cy="12" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-1/2 -translate-x-1/2 z-50 liquid-glass-pill"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 20px) + 12px)",
        padding: "12px 20px",
      }}
    >
      <div className="flex items-center" style={{ gap: "8px" }}>
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform duration-100"
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                color: active ? "var(--tab-icon-active)" : "var(--tab-icon)",
                background: active ? "rgba(74, 222, 128, 0.12)" : "transparent",
                transition: "background 0.15s ease, color 0.15s ease, transform 0.1s ease",
              }}
            >
              {item.icon}
              {/* Active indicator dot */}
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: active ? "var(--tab-icon-active)" : "transparent",
                  marginTop: 2,
                  flexShrink: 0,
                  transition: "background 0.15s ease",
                }}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
