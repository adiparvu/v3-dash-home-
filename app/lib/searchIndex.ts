export type SearchKind = "Zone" | "Asset" | "Task" | "Page";

export type SearchEntry = {
  kind: SearchKind;
  name: string;
  subtitle: string;
  href: string;
  icon: string;
};

/** Static index of the app's seed content + navigable pages. */
export const searchIndex: SearchEntry[] = [
  // Zones
  { kind: "Zone", name: "Lake", subtitle: "Freshwater Ecosystem", href: "/zones/lake", icon: "💧" },
  { kind: "Zone", name: "Forest", subtitle: "Mixed Forest Zone", href: "/zones/forest", icon: "🌲" },
  { kind: "Zone", name: "Greenhouse", subtitle: "Main Greenhouse", href: "/zones/greenhouse", icon: "🏡" },
  { kind: "Zone", name: "Orchard", subtitle: "Apple Orchard", href: "/zones/orchard", icon: "🍎" },
  { kind: "Zone", name: "Smart Pond", subtitle: "Koi & Aquatic Garden", href: "/zones/smart-pond", icon: "🐟" },
  { kind: "Zone", name: "Garden", subtitle: "Main Garden", href: "/zones/garden", icon: "🌿" },
  { kind: "Zone", name: "House", subtitle: "Main Residence", href: "/zones/house", icon: "🏠" },
  { kind: "Zone", name: "Driveway", subtitle: "Gate & Access Control", href: "/zones/driveway", icon: "🚗" },
  { kind: "Zone", name: "Smart Home", subtitle: "Home Automation Hub", href: "/zones/smart-home", icon: "🤖" },

  // Assets
  { kind: "Asset", name: "Water Pump", subtitle: "Equipment · Lake", href: "/inventory/water-pump", icon: "⚙️" },
  { kind: "Asset", name: "Ficus Tree", subtitle: "Plants · Living Room", href: "/inventory/ficus-tree", icon: "🌱" },
  { kind: "Asset", name: "Air Conditioner", subtitle: "Devices · House", href: "/inventory/air-conditioner", icon: "❄️" },
  { kind: "Asset", name: "Lawn Mower", subtitle: "Equipment · Garden", href: "/inventory/lawn-mower", icon: "🌿" },
  { kind: "Asset", name: "Security Camera", subtitle: "Devices · Driveway", href: "/inventory/security-camera", icon: "📷" },
  { kind: "Asset", name: "Irrigation System", subtitle: "Equipment · Orchard", href: "/inventory/irrigation-system", icon: "💧" },

  // Pages
  { kind: "Page", name: "Overview", subtitle: "Estate dashboard", href: "/", icon: "🏠" },
  { kind: "Page", name: "Zones", subtitle: "All monitored areas", href: "/zones", icon: "🗺️" },
  { kind: "Page", name: "Inventory", subtitle: "Assets & objects", href: "/inventory", icon: "📦" },
  { kind: "Page", name: "Tasks", subtitle: "To-do & maintenance", href: "/tasks", icon: "✅" },
  { kind: "Page", name: "Automations", subtitle: "Smart rules", href: "/automations", icon: "⚡" },
  { kind: "Page", name: "Sensors", subtitle: "Live sensor readings", href: "/sensors", icon: "📡" },
  { kind: "Page", name: "Chat", subtitle: "Household messages", href: "/chat", icon: "💬" },
  { kind: "Page", name: "Documents", subtitle: "Deeds, manuals & records", href: "/documents", icon: "📄" },
  { kind: "Page", name: "Maintenance", subtitle: "Schedule & history", href: "/maintenance", icon: "🔧" },
  { kind: "Page", name: "Contractors", subtitle: "Service providers", href: "/contractors", icon: "👷" },
  { kind: "Page", name: "Properties", subtitle: "Manage properties", href: "/properties", icon: "🏘️" },
  { kind: "Page", name: "AI Assistant", subtitle: "Your estate AI", href: "/ai", icon: "✨" },
  { kind: "Page", name: "Settings", subtitle: "Preferences & security", href: "/settings", icon: "⚙️" },
  { kind: "Page", name: "Appearance", subtitle: "Theme & accent", href: "/settings/appearance", icon: "🎨" },
  { kind: "Page", name: "Notifications", subtitle: "Alerts & push", href: "/settings/notifications", icon: "🔔" },
];
