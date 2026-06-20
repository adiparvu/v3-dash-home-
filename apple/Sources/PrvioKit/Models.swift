import Foundation

/// Live estate weather — decodes `GET /api/v1/weather`'s `data` object.
public struct Weather: Codable, Equatable, Sendable {
    public let tempC: Double
    public let condition: String
    public let icon: String
    public let high: Double
    public let low: Double
    public let source: String

    public init(tempC: Double, condition: String, icon: String, high: Double, low: Double, source: String) {
        self.tempC = tempC
        self.condition = condition
        self.icon = icon
        self.high = high
        self.low = low
        self.source = source
    }
}

/// Estate snapshot — the Swift parity of the web `EstateSnapshot` that drives
/// widgets. Populated from the backend (property/security/energy endpoints);
/// kept identical in shape so WidgetKit timelines render like the web preview.
public struct EstateSnapshot: Codable, Equatable, Sendable {
    public struct Security: Codable, Equatable, Sendable {
        public let armed: Bool
        public let cameras: Int
        public let camerasOnline: Int
        public let openDoors: Int
    }

    public let estateName: String
    public let healthScore: Int
    public let zones: Int
    public let objects: Int
    public let openTasks: Int
    public let alerts: Int
    public let maintenanceDue: Int
    public let nextMaintenanceDays: Int
    public let propertyValue: Double
    public let appreciationPct: Double
    public let weather: Weather
    public let security: Security
    public let month: Int
}

/// Account profile — a subset of `GET /api/v1/profile`'s `data.profile`.
public struct Profile: Codable, Equatable, Sendable {
    public let firstName: String?
    public let lastName: String?
    public let displayName: String?
    public let email: String?

    enum CodingKeys: String, CodingKey {
        case firstName = "first_name"
        case lastName = "last_name"
        case displayName = "display_name"
        case email
    }
}
