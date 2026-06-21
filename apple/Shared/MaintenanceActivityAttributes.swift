import Foundation
import ActivityKit

/// Live Activity for an in-progress estate job (maintenance, delivery, inspection,
/// incident). Compiled into both the app (which starts/updates/ends the activity)
/// and the widget extension (which renders the Lock Screen + Dynamic Island).
struct MaintenanceActivityAttributes: ActivityAttributes {
    /// Dynamic, push-/local-updatable state.
    public struct ContentState: Codable, Hashable {
        var status: String        // "Scheduled", "En route", "In progress", "Completing"
        var progress: Double      // 0.0 ... 1.0
        var etaMinutes: Int?
    }

    /// Static attributes set when the activity starts.
    var kind: String              // "Maintenance", "Delivery", "Inspection", "Incident"
    var jobTitle: String
    var propertyName: String
    var technician: String

    var symbol: String {
        switch kind {
        case "Delivery": return "shippingbox.fill"
        case "Inspection": return "checkmark.seal.fill"
        case "Incident": return "exclamationmark.triangle.fill"
        default: return "wrench.and.screwdriver.fill"
        }
    }
}
