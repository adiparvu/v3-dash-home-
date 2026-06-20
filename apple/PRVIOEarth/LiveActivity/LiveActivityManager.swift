import Foundation
import ActivityKit

/// Starts, updates and ends estate-job Live Activities. Lives in the app target;
/// the UI is declared in the widget extension (`MaintenanceLiveActivity`).
@MainActor
final class LiveActivityManager {
    static let shared = LiveActivityManager()
    private init() {}

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
            _ = try Activity.request(
                attributes: attributes,
                content: .init(state: initial, staleDate: nil)
            )
            return true
        } catch {
            return false
        }
    }

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
