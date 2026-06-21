import Foundation

/// The platform's versioned response envelope: `{ "apiVersion": "1.0.0", "data": … }`
/// or `{ "apiVersion": "1.0.0", "error": "…" }`.
struct APIEnvelope<T: Decodable>: Decodable {
    let apiVersion: String
    let data: T?
    let error: String?
}

// MARK: - Estate

struct Property: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let description: String?
    let address: String?
    let city: String?
    let country: String?
    let totalAreaSqm: Double?
    let currency: String?
    let isActive: Bool?
    let createdAt: String?

    var locationLine: String {
        [city, country].compactMap { $0 }.joined(separator: ", ")
    }
}

struct PropertiesPayload: Decodable { let properties: [Property] }

struct Zone: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let description: String?
    let areaSqm: Double?
    let color: String?
    let icon: String?
}

struct ZonesPayload: Decodable { let zones: [Zone] }

struct Asset: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let manufacturer: String?
    let model: String?
    let currentValue: Double?
    let condition: String?
}

struct AssetsPayload: Decodable { let assets: [Asset] }

// MARK: - Identity

struct Profile: Decodable, Hashable {
    let id: String
    let email: String
    let firstName: String?
    let lastName: String?
    let displayName: String?
    let phone: String?
    let notes: String?
    let avatarRingColor: Int?
    let createdAt: String?

    var name: String {
        if let d = displayName, !d.isEmpty { return d }
        let composed = [firstName, lastName].compactMap { $0 }.joined(separator: " ")
        return composed.isEmpty ? email : composed
    }

    var initials: String {
        let parts = name.split(separator: " ").prefix(2)
        let letters = parts.compactMap { $0.first }.map(String.init).joined()
        return letters.isEmpty ? "?" : letters.uppercased()
    }
}

struct ProfilePayload: Decodable { let profile: Profile }

// MARK: - Notifications

struct NotificationItem: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let body: String
    let type: String?
    let category: String?
    let isRead: Bool?
    let createdAt: String?
}

struct NotificationsPayload: Decodable { let notifications: [NotificationItem] }

// MARK: - Twin: sensors & devices

struct SensorReading: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let type: String?
    let unit: String?
    let value: Double?
    let recordedAt: String?
}

struct SensorsPayload: Decodable { let sensors: [SensorReading] }

struct Device: Decodable, Identifiable, Hashable {
    let id: String
    let name: String?
    let type: String?
    let status: String?
    let manufacturer: String?

    var displayName: String { name ?? type ?? "Device" }
}

struct DevicesPayload: Decodable { let devices: [Device] }

// MARK: - Automations

struct Schedule: Decodable, Identifiable, Hashable {
    let id: String
    let automationId: String?
    let area: String?
    let atTime: String?
    let enabled: Bool?
}

struct SchedulesPayload: Decodable { let schedules: [Schedule] }

// MARK: - Contractors

struct Contractor: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let company: String?
    let phone: String?
    let email: String?
    let rating: Double?
    let isPreferred: Bool?
}

struct ContractorsPayload: Decodable { let contractors: [Contractor] }

// MARK: - Operations: tasks, maintenance, documents

struct TaskItem: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let status: String
    let due: String?
    let priority: String?
}

struct TasksPayload: Decodable { let tasks: [TaskItem] }

struct MaintenanceItem: Decodable, Identifiable, Hashable {
    let id: String
    let title: String
    let asset: String?
    let due: String?
    let status: String
}

struct MaintenancePayload: Decodable { let maintenance: [MaintenanceItem] }

struct DocumentItem: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let kind: String?
    let size: String?
    let updatedAt: String?
}

struct DocumentsPayload: Decodable { let documents: [DocumentItem] }

// MARK: - Apple Home (HomeKit)

/// A flattened, view-friendly representation of a HomeKit accessory. Decoupled
/// from the `HomeKit` framework types so the UI (and demo data) need not import
/// HomeKit and so it stays `Sendable`/`Hashable`.
struct HomeAccessory: Identifiable, Hashable {
    let id: String
    let name: String
    let room: String?
    /// Friendly category label, e.g. "Lightbulb", "Outlet", "Sensor".
    let category: String
    let isReachable: Bool
    /// Current power state, or `nil` when the accessory exposes no power characteristic.
    var isOn: Bool?
}
