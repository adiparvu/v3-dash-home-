"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    href: "/",
    label: "Overview",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/zones",
    label: "Zones",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="2" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
        <rect x="13" y="3" width="8" height="8" rx="2" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
        <rect x="3" y="13" width="8" height="8" rx="2" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
        <rect x="13" y="13" width="8" height="8" rx="2" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
      </svg>
    ),
  },
  {
    href: "/inventory",
    label: "Inventory",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2V22" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" />
        <path d="M3 7L12 12L21 7" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 11L12 14L22 4" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16"
          stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/more",
    label: "More",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "#4ADE80" : "#9CA3AF"} strokeWidth="1.75" />
        <circle cx="8.5" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
        <circle cx="12" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
        <circle cx="15.5" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full md:w-[390px] z-50"
      style={{
        background: "rgba(5,10,20,0.88)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-6">
        {navItems.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2 active:scale-90 transition-transform"
            >
              {item.icon(active)}
              <span
                className="text-[10px] font-medium leading-none"
                style={{ color: active ? "#4ADE80" : "#9CA3AF" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
