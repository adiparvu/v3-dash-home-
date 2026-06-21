import Foundation
import ActivityKit

/// Starts, updates and ends estate-job Live Activities. Lives in the app target;
/// the UI is declared in the widget extension (`MaintenanceLiveActivity`).
@MainActor
final class LiveActivityManager {
    static let shared = LiveActivityManager()
    private init() {}

    /// API client used to register push tokens with the backend (set after sign-in).
    private var api: APIClient?
    func configure(api: APIClient?) { self.api = api }

    var areActivitiesEnabled: Bool {
        ActivityAuthorizationInfo().areActivitiesEnabled
    }

    /// Returns true if an activity was started.
    @discardableResult
    func startMaintenance(
        kind: String = "Maintenance",
        job: String,
        property: String,
        technician: String
    ) -> Bool {
        guard areActivitiesEnabled else { return false }
        let attributes = MaintenanceActivityAttributes(
            kind: kind, jobTitle: job, propertyName: property, technician: technician
        )
        let initial = MaintenanceActivityAttributes.ContentState(
            status: "Scheduled", progress: 0.05, etaMinutes: 45
        )
        do {
            // `.token` lets the backend push ContentState updates over APNs.
            let activity = try Activity.request(
                attributes: attributes,
                content: .init(state: initial, staleDate: nil),
                pushType: .token
            )
            observePushToken(for: activity)
            return true
        } catch {
            return false
        }
    }

    /// Stream the per-activity APNs push token and hand it to the backend, which
    /// uses it to push live updates. (No token is delivered on the simulator.)
    private func observePushToken(for activity: Activity<MaintenanceActivityAttributes>) {
        Task {
            for await tokenData in activity.pushTokenUpdates {
                let hex = tokenData.map { String(format: "%02x", $0) }.joined()
                await registerPushToken(hex, activityId: activity.id)
            }
        }
    }

    /// Forward the Live Activity push token to the backend, which uses it to push
    /// ContentState updates over APNs (`POST /api/v1/twin/live-activities`).
    private func registerPushToken(_ token: String, activityId: String) async {
        latestPushToken = token
        guard let api else { return }
        struct Registered: Decodable { let id: String }
        _ = try? await api.post(
            "/twin/live-activities",
            body: ["activityId": activityId, "pushToken": token],
            as: Registered.self
        )
    }

    /// Most recent Live Activity push token (for diagnostics / backend wiring).
    private(set) var latestPushToken: String?

    /// Push a new state to all running maintenance activities.
    func update(status: String, progress: Double, etaMinutes: Int?) async {
        let state = MaintenanceActivityAttributes.ContentState(
            status: status, progress: progress, etaMinutes: etaMinutes
        )
        for activity in Activity<MaintenanceActivityAttributes>.activities {
            await activity.update(.init(state: state, staleDate: nil))
        }
    }

    /// End all running maintenance activities.
    func endAll() async {
        let final = MaintenanceActivityAttributes.ContentState(
            status: "Completed", progress: 1.0, etaMinutes: 0
        )
        for activity in Activity<MaintenanceActivityAttributes>.activities {
            await activity.end(.init(state: final, staleDate: nil), dismissalPolicy: .default)
        }
    }
}
