import SwiftUI

/// App-wide user preferences (Appearance, accent, Units & Currency, Language,
/// Notifications), persisted to `UserDefaults` and applied at the root.
@MainActor
@Observable
final class AppSettings {
    enum Appearance: String, CaseIterable, Identifiable {
        case system, light, dark
        var id: String { rawValue }
        var label: String { rawValue.capitalized }
        var colorScheme: ColorScheme? {
            switch self { case .system: nil; case .light: .light; case .dark: .dark }
        }
        var symbol: String {
            switch self { case .system: "circle.lefthalf.filled"; case .light: "sun.max.fill"; case .dark: "moon.fill" }
        }
    }

    enum AccentChoice: String, CaseIterable, Identifiable {
        case green, cyan, violet, amber, orange
        var id: String { rawValue }
        var label: String { rawValue.capitalized }
        var color: Color {
            switch self {
            case .green: Theme.accent
            case .cyan: Theme.cyan
            case .violet: Theme.violet
            case .amber: Theme.amber
            case .orange: Theme.orange
            }
        }
    }

    enum UnitSystem: String, CaseIterable, Identifiable {
        case metric, imperial
        var id: String { rawValue }
        var label: String { rawValue.capitalized }
    }

    static let currencies = ["EUR", "USD", "GBP", "RON", "CHF"]
    static let languages: [(code: String, label: String)] = [
        ("system", "System"), ("en", "English"), ("ro", "Română"),
    ]

    var appearance: Appearance { didSet { d.set(appearance.rawValue, forKey: "set.appearance") } }
    var accent: AccentChoice { didSet { d.set(accent.rawValue, forKey: "set.accent") } }
    var unitSystem: UnitSystem { didSet { d.set(unitSystem.rawValue, forKey: "set.units") } }
    var currencyCode: String { didSet { d.set(currencyCode, forKey: "set.currency") } }
    var languageCode: String { didSet { d.set(languageCode, forKey: "set.language") } }

    var notifyMaintenance: Bool { didSet { d.set(notifyMaintenance, forKey: "set.n.maintenance") } }
    var notifySecurity: Bool { didSet { d.set(notifySecurity, forKey: "set.n.security") } }
    var notifyTasks: Bool { didSet { d.set(notifyTasks, forKey: "set.n.tasks") } }
    var notifyWeather: Bool { didSet { d.set(notifyWeather, forKey: "set.n.weather") } }

    private let d: UserDefaults

    init() {
        let d = UserDefaults.standard
        self.d = d
        appearance = Appearance(rawValue: d.string(forKey: "set.appearance") ?? "") ?? .system
        accent = AccentChoice(rawValue: d.string(forKey: "set.accent") ?? "") ?? .green
        unitSystem = UnitSystem(rawValue: d.string(forKey: "set.units") ?? "") ?? .metric
        currencyCode = d.string(forKey: "set.currency") ?? "EUR"
        languageCode = d.string(forKey: "set.language") ?? "system"
        notifyMaintenance = d.object(forKey: "set.n.maintenance") as? Bool ?? true
        notifySecurity = d.object(forKey: "set.n.security") as? Bool ?? true
        notifyTasks = d.object(forKey: "set.n.tasks") as? Bool ?? true
        notifyWeather = d.object(forKey: "set.n.weather") as? Bool ?? false
    }

    // Derived values applied at the root.
    var colorScheme: ColorScheme? { appearance.colorScheme }
    var accentColor: Color { accent.color }
    var locale: Locale { languageCode == "system" ? .autoupdatingCurrent : Locale(identifier: languageCode) }

    var currencySymbol: String {
        switch currencyCode {
        case "USD": "$"; case "GBP": "£"; case "RON": "lei"; case "CHF": "CHF"; default: "€"
        }
    }

    /// Format an area in m² per the selected unit system.
    func area(_ sqm: Double) -> String {
        switch unitSystem {
        case .metric: "\(Int(sqm)) m²"
        case .imperial: "\(Int(sqm * 10.7639)) ft²"
        }
    }

    /// Format a money amount with the selected currency symbol.
    func money(_ amount: Double) -> String {
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.maximumFractionDigits = 0
        let n = f.string(from: NSNumber(value: amount)) ?? "\(Int(amount))"
        return currencyCode == "RON" || currencyCode == "CHF" ? "\(n) \(currencySymbol)" : "\(currencySymbol)\(n)"
    }
}
