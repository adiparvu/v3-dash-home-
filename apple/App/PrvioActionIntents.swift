import AppIntents
import PrvioKit

// Action Siri Shortcuts — these *do* something (vs. the read/navigation intents
// in PrvioIntents.swift). They post commands through the backend, which performs
// authorization + policy validation before acting (per the security spec).
// High-risk actions (security changes) require explicit confirmation.

// MARK: - Run diagnostics (read → reports fault count)

struct RunDiagnosticsIntent: AppIntent {
    static var title: LocalizedStringResource = "Run estate diagnostics"
    static var description = IntentDescription("Checks the estate for possible faults and reports the count.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        let snapshot = try await Backend.client.get("estate/snapshot", as: EstateSnapshot.self)
        let n = snapshot.alerts
        let dialog: IntentDialog = n == 0
            ? "No issues detected — your estate is healthy."
            : "\(n) issue\(n == 1 ? "" : "s") need attention. Opening Diagnostics."
        return .result(dialog: dialog)
    }
}

// MARK: - Charge EV now

struct ChargeEVNowIntent: AppIntent {
    static var title: LocalizedStringResource = "Charge the EV now"
    static var description = IntentDescription("Starts charging the EV immediately, overriding the cheap-window schedule.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        try await Backend.client.post("twin/devices/ev/charge", body: ["action": "start"])
        return .result(dialog: "Charging the EV now.")
    }
}

// MARK: - Arm security (high-risk → requires confirmation)

struct ArmSecurityIntent: AppIntent {
    static var title: LocalizedStringResource = "Arm estate security"
    static var description = IntentDescription("Arms cameras and sensors across the estate.")

    func perform() async throws -> some IntentResult & ProvidesDialog {
        // Security-impacting action: confirm before performing.
        try await requestConfirmation(result: .result(dialog: "Arm estate security?"))
        try await Backend.client.post("security/arm", body: ["armed": "true"])
        return .result(dialog: "Estate security is now armed.")
    }
}

// MARK: - Siri phrases for the action intents

struct PrvioActionShortcuts: AppShortcutsProvider {
    static var appShortcuts: [AppShortcut] {
        AppShortcut(
            intent: RunDiagnosticsIntent(),
            phrases: [
                "Run diagnostics in \(.applicationName)",
                "Check my estate for faults in \(.applicationName)",
            ],
            shortTitle: "Run diagnostics",
            systemImageName: "stethoscope"
        )
        AppShortcut(
            intent: ChargeEVNowIntent(),
            phrases: [
                "Charge my car in \(.applicationName)",
                "Start charging in \(.applicationName)",
            ],
            shortTitle: "Charge EV",
            systemImageName: "bolt.car"
        )
        AppShortcut(
            intent: ArmSecurityIntent(),
            phrases: [
                "Arm security in \(.applicationName)",
                "Secure my estate in \(.applicationName)",
            ],
            shortTitle: "Arm security",
            systemImageName: "lock.shield"
        )
    }
}
