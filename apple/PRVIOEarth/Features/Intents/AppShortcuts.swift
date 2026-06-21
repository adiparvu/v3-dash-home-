import AppIntents

/// App Intents + App Shortcuts (spec: Widgets & iOS Experience → App Intents).
/// Exposes Siri / Spotlight / Shortcuts actions. `EstateStatusIntent` answers
/// from the shared App Group snapshot without launching the app.

struct EstateStatusIntent: AppIntent {
    static var title: LocalizedStringResource = "Estate Status"
    static var description = IntentDescription("Get your estate health and open tasks at a glance.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let s = SharedStore.load()
        return .result(dialog: "\(s.propertyName): health \(s.healthScore)%, \(s.openTasks) open tasks.")
    }
}

struct OpenAssistantIntent: AppIntent {
    static var title: LocalizedStringResource = "Open Assistant"
    static var description = IntentDescription("Open PRVIO Earth to ask the estate assistant.")
    static var openAppWhenRun = true

    func perform() async throws -> some IntentResult { .result() }
}

struct PrvioShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: EstateStatusIntent(),
            phrases: [
                "Check my estate in \(.applicationName)",
                "\(.applicationName) estate status",
            ],
            shortTitle: "Estate Status",
            systemImageName: "house.fill"
        )
        AppShortcut(
            intent: OpenAssistantIntent(),
            phrases: [
                "Open \(.applicationName) assistant",
                "Ask \(.applicationName)",
            ],
            shortTitle: "Assistant",
            systemImageName: "sparkles"
        )
    }
}
