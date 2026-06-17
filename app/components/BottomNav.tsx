"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
  icon: (active: boolean) => React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Overview",
    href: "/",
    icon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Zones",
    href: "/zones",
    icon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 21H21"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M5 21V7L12 3L19 7V21"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 21V15H15V21"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 11H10M14 11H15M9 7H10M14 7H15"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: "Objects",
    href: "/objects",
    icon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L21 7V17L12 22L3 17V7L12 2Z"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 2V22"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M3 7L12 12L21 7"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "AI",
    href: "/ai",
    icon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L13.5 8.5L20 7L14.5 11L17 17.5L12 13.5L7 17.5L9.5 11L4 7L10.5 8.5L12 2Z"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill={active ? "#4ADE8022" : "none"}
        />
        <circle
          cx="19"
          cy="19"
          r="2"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.5"
        />
        <path
          d="M5 5L5.5 6.5L7 7L5.5 7.5L5 9L4.5 7.5L3 7L4.5 6.5L5 5Z"
          fill={active ? "#4ADE80" : "#9CA3AF"}
        />
      </svg>
    ),
  },
  {
    label: "More",
    href: "/more",
    icon: (active) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke={active ? "#4ADE80" : "#9CA3AF"}
          strokeWidth="1.75"
        />
        <circle cx="8.5" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
        <circle cx="12" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
        <circle cx="15.5" cy="12" r="1.25" fill={active ? "#4ADE80" : "#9CA3AF"} />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (href: string): boolean => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 w-full bg-[#0B111E]/95 backdrop-blur border-t border-[#1A2438] px-2 py-3 pb-6"
      style={{ zIndex: 50 }}
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 min-w-[56px] py-1 px-2"
            >
              <span className="flex items-center justify-center">
                {item.icon(active)}
              </span>
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
