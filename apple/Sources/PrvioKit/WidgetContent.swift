import Foundation

/// Home-screen widget kinds — parity with the web `WidgetKind`.
public enum WidgetKind: String, CaseIterable, Sendable {
    case tasks, propertyStatus, weather, seasonal, maintenance, propertyValue, security
}

/// A rendered widget snapshot the WidgetKit views consume.
public struct WidgetData: Equatable, Sendable {
    public struct Item: Equatable, Sendable {
        public let label: String
        public let value: String?
        public let done: Bool?
    }
    public let kind: WidgetKind
    public let title: String
    public let icon: String
    public let primary: String
    public let secondary: String?
    public let items: [Item]
    public let deepLink: String
}

public enum WidgetContent {
    /// Compact currency for hero values: €2.4M / €860K / €420 — parity with the
    /// web `formatValue`.
    public static func formatValue(_ value: Double) -> String {
        if value >= 1_000_000 {
            let m = value / 1_000_000
            return m.truncatingRemainder(dividingBy: 1) == 0 ? "€\(Int(m))M" : String(format: "€%.1fM", m)
        }
        if value >= 1_000 { return "€\(Int((value / 1_000).rounded()))K" }
        return "€\(Int(value))"
    }

    public struct Season: Equatable, Sendable {
        public let name: String
        public let icon: String
        public let items: [(label: String, done: Bool)]

        public static func == (lhs: Season, rhs: Season) -> Bool {
            lhs.name == rhs.name && lhs.icon == rhs.icon
                && lhs.items.map(\.label) == rhs.items.map(\.label)
                && lhs.items.map(\.done) == rhs.items.map(\.done)
        }
    }

    /// Northern-hemisphere seasonal checklist by month (0–11) — parity with web.
    public static func seasonalChecklist(month: Int) -> Season {
        switch month {
        case 11, 0, 1:
            return Season(name: "Winter", icon: "❄️", items: [
                ("Insulate exposed pipes", true), ("Service heating / heat-pump", true),
                ("Clear gutters of debris", false), ("Check roof after storms", false),
            ])
        case 2, 3, 4:
            return Season(name: "Spring", icon: "🌱", items: [
                ("Prune orchard & vines", true), ("Test irrigation system", false),
                ("Inspect greenhouse seals", false), ("Lake water-quality check", false),
            ])
        case 5, 6, 7:
            return Season(name: "Summer", icon: "☀️", items: [
                ("Pool / pond maintenance", true), ("Solar panel cleaning", true),
                ("Fire-break clearing", false), ("AC filter replacement", false),
            ])
        default:
            return Season(name: "Autumn", icon: "🍂", items: [
                ("Harvest orchard", true), ("Leaf clearing & mulching", false),
                ("Winterize outdoor taps", false), ("Chimney sweep & service", false),
            ])
        }
    }

    private static func healthLabel(_ score: Int) -> String {
        switch score {
        case 90...: return "Excellent"
        case 80..<90: return "Very Good"
        case 65..<80: return "Good"
        case 50..<65: return "Fair"
        default: return "Needs attention"
        }
    }

    /// Build a widget snapshot from the estate state — parity with web `buildWidget`.
    public static func build(_ kind: WidgetKind, from s: EstateSnapshot) -> WidgetData {
        switch kind {
        case .propertyStatus:
            return WidgetData(kind: kind, title: s.estateName, icon: "🏡",
                primary: "\(s.healthScore)", secondary: "\(healthLabel(s.healthScore)) · \(s.zones) zones",
                items: [], deepLink: "/")
        case .tasks:
            return WidgetData(kind: kind, title: "Open Tasks", icon: "✅",
                primary: "\(s.openTasks)", secondary: s.openTasks == 0 ? "All clear" : "\(s.openTasks) to do · \(s.alerts) alerts",
                items: [], deepLink: "/tasks")
        case .weather:
            return WidgetData(kind: kind, title: "Estate Weather", icon: s.weather.icon,
                primary: "\(Int(s.weather.tempC))°", secondary: "\(s.weather.condition) · H:\(Int(s.weather.high))° L:\(Int(s.weather.low))°",
                items: [], deepLink: "/")
        case .seasonal:
            let sc = seasonalChecklist(month: s.month)
            let done = sc.items.filter(\.1).count
            return WidgetData(kind: kind, title: "\(sc.name) Checklist", icon: sc.icon,
                primary: "\(done)/\(sc.items.count)", secondary: "Seasonal estate tasks",
                items: sc.items.map { .init(label: $0.label, value: nil, done: $0.done) }, deepLink: "/maintenance")
        case .maintenance:
            return WidgetData(kind: kind, title: "Maintenance Due", icon: "🔧",
                primary: "\(s.maintenanceDue)", secondary: s.maintenanceDue == 0 ? "Nothing scheduled" : "Next in \(s.nextMaintenanceDays)d",
                items: [], deepLink: "/maintenance")
        case .propertyValue:
            let arrow = s.appreciationPct >= 0 ? "▲" : "▼"
            return WidgetData(kind: kind, title: "Property Value", icon: "📈",
                primary: formatValue(s.propertyValue), secondary: "\(arrow) \(String(format: "%.1f", abs(s.appreciationPct)))% est. appreciation",
                items: [], deepLink: "/properties")
        case .security:
            return WidgetData(kind: kind, title: "Security", icon: s.security.armed ? "🛡️" : "🔓",
                primary: s.security.armed ? "Armed" : "Disarmed",
                secondary: "\(s.security.camerasOnline)/\(s.security.cameras) cameras · \(s.security.openDoors) open",
                items: [], deepLink: "/settings/security")
        }
    }
}
