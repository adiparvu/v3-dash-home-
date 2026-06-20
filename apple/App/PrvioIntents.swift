import AppIntents
import PrvioKit

// Siri Shortcuts for PRVIO Earth, built on the App Intents framework.
//
// Add this file to the Xcode App target (alongside PrvioApp.swift). The intents
// reuse PrvioKit so Siri, Spotlight, the Shortcuts app and the Action Button all
// drive the same versioned backend the rest of the app uses. Phrases are
// registered by PrvioShortcuts (an AppShortcutsProvider) so they work with zero
// user setup.

// MARK: - Check estate weather (fully wired — hits /api/v1/weather)

struct CheckWeatherIntent: AppIntent {
    static var title: LocalizedStringResource = "Check estate weather"
    static var description = IntentDescription("Reports the current weather at your estate.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let weather = await WeatherService(client: Backend.client).current()
        let dialog = IntentDialog(
            "\(weather.condition), \(Int(weather.tempC)) degrees, with a high of \(Int(weather.high)) and a low of \(Int(weather.low))."
        )
        return .result(dialog: dialog)
    }
}

// MARK: - Check estate health (uses the estate snapshot endpoint)

struct EstateHealthIntent: AppIntent {
    static var title: LocalizedStringResource = "Check estate health"
    static var description = IntentDescription("Reports your PRVIO Earth estate health score and open tasks.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Backend snapshot endpoint (Phase 8 backlog): GET /api/v1/estate/snapshot
        let snapshot = try await Backend.client.get("estate/snapshot", as: EstateSnapshot.self)
        let dialog = IntentDialog(
            "Estate health is \(snapshot.healthScore) out of 100, with \(snapshot.openTasks) open tasks and \(snapshot.alerts) alerts."
        )
        return .result(dialog: dialog)
    }
}

// MARK: - Open a screen (navigation intent)

enum PrvioScreen: String, AppEnum {
    case diagnostics, energy, insights, widgets, cameras

    static var typeDisplayRepresentation = TypeDisplayRepresentation(name: "PRVIO Screen")
    static var caseDisplayRepresentations: [PrvioScreen: DisplayRepresentation] = [
        .diagnostics: "Diagnostics",
        .energy: "Energy",
        .insights: "Insights",
        .widgets: "Widgets",
        .cameras: "Cameras",
    ]

    /// Deep-link path consumed by the app's router (prvio:/<path>).
    var path: String {
        switch self {
        case .diagnostics: return "/diagnostics"
        case .energy: return "/twin/energy"
        case .insights: return "/insights"
        case .widgets: return "/widgets"
        case .cameras: return "/cameras"
        }
    }
}

struct OpenPrvioScreenIntent: AppIntent {
    static var title: LocalizedStringResource = "Open PRVIO screen"
    static var description = IntentDescription("Opens a PRVIO Earth screen.")
    static var openAppWhenRun = true

    @Parameter(title: "Screen")
    var screen: PrvioScreen

    func perform() async throws -> some IntentResult {
        // The app observes the deep link and routes accordingly.
        NotificationCenter.default.post(name: .prvioOpenScreen, object: screen.path)
        return .result()
    }
}

extension Notification.Name {
    static let prvioOpenScreen = Notification.Name("prvioOpenScreen")
}

// MARK: - Siri phrases (zero-setup shortcuts)

struct PrvioShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: CheckWeatherIntent(),
            phrases: [
                "What's the weather at my \(.applicationName) estate",
                "Check my estate weather in \(.applicationName)",
            ],
            shortTitle: "Estate weather",
            systemImageName: "cloud.sun"
        )
        AppShortcut(
            intent: EstateHealthIntent(),
            phrases: [
                "How is my estate in \(.applicationName)",
                "Check estate health in \(.applicationName)",
            ],
            shortTitle: "Estate health",
            systemImageName: "house"
        )
        AppShortcut(
            intent: OpenPrvioScreenIntent(),
            phrases: [
                "Open \(\.$screen) in \(.applicationName)",
            ],
            shortTitle: "Open screen",
            systemImageName: "square.grid.2x2"
        )
    }
}
