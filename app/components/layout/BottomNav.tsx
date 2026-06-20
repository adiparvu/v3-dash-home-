"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useT, type MessageKey } from "../../lib/i18n";

/* Apple SF Symbol–style icons: strokeWidth 1.6, round caps/joins, 26×26 */
const navItems: { href: string; tkey: MessageKey; icon: (active: boolean) => React.ReactNode }[] = [
  {
    href: "/",
    tkey: "nav.overview",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-4.5v-5h-5v5H5a1 1 0 01-1-1z"
          stroke="currentColor"
          strokeWidth="1.65"
          fill={active ? "currentColor" : "none"}
          fillOpacity={active ? 0.15 : 0}
        />
      </svg>
    ),
  },
  {
    href: "/zones",
    tkey: "nav.zones",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7.2" height="7.2" rx="2.2" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
        <rect x="13.8" y="3" width="7.2" height="7.2" rx="2.2" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
        <rect x="3" y="13.8" width="7.2" height="7.2" rx="2.2" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
        <rect x="13.8" y="13.8" width="7.2" height="7.2" rx="2.2" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} />
      </svg>
    ),
  },
  {
    href: "/inventory",
    tkey: "nav.inventory",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2.5l8.5 4.75v9.5L12 21.5l-8.5-4.75v-9.5z" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.12 : 0} />
        <path d="M12 21.5V12" stroke="currentColor" strokeWidth="1.65" />
        <path d="M3.5 7.25L12 12l8.5-4.75" stroke="currentColor" strokeWidth="1.65" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    tkey: "nav.tasks",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4.5" stroke="currentColor" strokeWidth="1.65" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.12 : 0} />
        <path d="M8.5 12l2.8 2.8 5.2-5.6" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    href: "/more",
    tkey: "nav.more",
    icon: (active: boolean) => (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="5.5" cy="12" r={active ? 1.8 : 1.6} fill="currentColor" />
        <circle cx="12"  cy="12" r={active ? 1.8 : 1.6} fill="currentColor" />
        <circle cx="18.5" cy="12" r={active ? 1.8 : 1.6} fill="currentColor" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const t = useT();

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-50 w-full md:w-[390px]"
      style={{ bottom: 0, pointerEvents: "none" }}
    >
      {/* Gradient fade above the bar so content fades into it */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to top, var(--bg-1) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <nav
        className="liquid-glass-pill relative mx-auto"
        style={{
          pointerEvents: "auto",
          width: "calc(100% - 32px)",
          maxWidth: 358,
          marginBottom: "calc(env(safe-area-inset-bottom, 10px) + 12px)",
          padding: "10px 16px 12px",
          zIndex: 1,
        }}
      >
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={t(item.tkey)}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-0.5 active:scale-90 transition-transform duration-100"
                style={{
                  minWidth: 48,
                  padding: "6px 8px 4px",
                  borderRadius: 14,
                  color: active ? "var(--tab-icon-active)" : "var(--tab-icon)",
                  background: active ? "var(--tab-active-bg)" : "transparent",
                  transition: "background 0.18s ease, color 0.18s ease, transform 0.1s ease",
                }}
              >
                {item.icon(active)}
                {/* Active indicator — tiny dot */}
                <span
                  style={{
                    display: "block",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: active ? "var(--tab-icon-active)" : "transparent",
                    transition: "background 0.18s ease",
                    flexShrink: 0,
                  }}
                />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
