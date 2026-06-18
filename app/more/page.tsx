import StatusBar from "../components/layout/StatusBar";
import BottomNav from "../components/layout/BottomNav";
import Link from "next/link";

const sections = [
  {
    title: "Estate",
    items: [
      { href: "/automations", label: "Automations", icon: "⚡", desc: "Smart rules & triggers", badge: "3 active" },
      { href: "/chat", label: "Chat", icon: "💬", desc: "Household live messages", badge: "6 unread" },
      { href: "/ai", label: "AI Assistant", icon: "✨", desc: "Your personal estate AI", badge: "Beta" },
      { href: "/properties", label: "Properties", icon: "🏠", desc: "Manage your properties", badge: null },
      { href: "/documents", label: "Documents", icon: "📄", desc: "Deeds, manuals & records", badge: "12" },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { href: "/sensors", label: "Sensors", icon: "📡", desc: "26 connected sensors", badge: "Live" },
      { href: "/maintenance", label: "Maintenance", icon: "🔧", desc: "Schedule & history", badge: "1 due" },
      { href: "/contractors", label: "Contractors", icon: "👷", desc: "Service providers", badge: null },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/settings", label: "Settings", icon: "⚙️", desc: "Preferences & security", badge: null },
      { href: "/settings/security", label: "Security", icon: "🔒", desc: "Face ID, sessions & audit log", badge: null },
      { href: "/settings/privacy", label: "Privacy & Data", icon: "🛡️", desc: "GDPR, exports & deletion", badge: null },
    ],
  },
];

export default function MorePage() {
  return (
    <div className="min-h-screen pb-28" style={{ background: "#050A14" }}>
      <StatusBar />

      {/* Header + Profile */}
      <div className="px-5 pt-1 pb-4">
        <h1 className="text-white font-bold text-2xl mb-4">More</h1>

        {/* Profile card */}
        <div
          className="rounded-3xl p-4 flex items-center gap-4"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #4ADE80, #22D3EE)", boxShadow: "0 0 16px rgba(74,222,128,0.3)" }}
          >
            <span className="text-bg font-bold text-xl">A</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-base">Alex Owner</p>
            <p className="text-text-secondary text-xs">alex@prvio.earth</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green" />
              <span className="text-accent-green text-[10px] font-medium">Pro Member · since 2024</span>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 space-y-5">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="text-text-secondary text-xs font-medium tracking-wide uppercase mb-2 px-1">
              {section.title}
            </p>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href}>
                  <div
                    className="flex items-center gap-3.5 px-4 py-3.5 active:bg-white/[0.06] transition-colors"
                    style={{ borderBottom: i < section.items.length - 1 ? "1px solid rgba(255,255,255,0.06)" : undefined }}
                  >
                    <span className="text-xl w-8 text-center flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{item.label}</p>
                      <p className="text-text-secondary text-xs">{item.desc}</p>
                    </div>
                    {item.badge && (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: "rgba(74,222,128,0.15)", color: "#4ADE80" }}
                      >
                        {item.badge}
                      </span>
                    )}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#6B7280" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Sign out */}
        <button
          className="w-full rounded-2xl py-3.5 text-sm font-medium"
          style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.20)", color: "#EF4444" }}
        >
          Sign Out
        </button>

        <p className="text-text-tertiary text-center text-xs pb-2">PRVIO EARTH · v1.0.0</p>
      </div>

      <BottomNav />
    </div>
  );
}
