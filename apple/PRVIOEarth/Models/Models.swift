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
    let latitude: Double?
    let longitude: Double?
    let totalAreaSqm: Double?
    let currency: String?
    let isActive: Bool?
    let purchasePrice: Double?
    let currentValue: Double?
    let marketNotes: String?
    let createdAt: String?

    var locationLine: String {
        [city, country].compactMap { $0 }.joined(separator: ", ")
    }

    /// Appreciation over purchase price, as a percentage, when both are known.
    var appreciationPercent: Double? {
        guard let purchasePrice, purchasePrice > 0, let currentValue else { return nil }
        return (currentValue - purchasePrice) / purchasePrice * 100
    }
}

struct PropertiesPayload: Decodable { let properties: [Property] }

struct PropertyValuation: Decodable, Identifiable, Hashable {
    let id: String
    let value: Double
    let note: String?
    let recordedAt: String?
}

struct ValuationsPayload: Decodable { let valuations: [PropertyValuation] }

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
    let autoLockSeconds: Int?
    let loginAlerts: Bool?
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

// MARK: - Identity bundle (social links, trusted persons, sessions, audit)

struct SocialLink: Decodable, Identifiable, Hashable {
    let id: String
    let platform: String
    let label: String?
    let url: String
}

struct TrustedPerson: Decodable, Identifiable, Hashable {
    let id: String
    let name: String
    let relationship: String?
    let email: String?
    let permissions: [String]
}

struct UserSession: Decodable, Identifiable, Hashable {
    let id: String
    let deviceName: String?
    let platform: String?
    let location: String?
    let isTrusted: Bool
    let isCurrent: Bool
    let lastActiveAt: String?
}

struct AuditEntry: Decodable, Identifiable, Hashable {
    let id: String
    let action: String
    let resource: String?
    let detail: String?
    let createdAt: String?
}

/// `GET /api/v1/profile` returns the profile plus its identity bundle.
struct ProfileBundle: Decodable {
    let profile: Profile
    let socialLinks: [SocialLink]
    let trustedPersons: [TrustedPerson]
    let sessions: [UserSession]
}

struct SessionsPayload: Decodable { let sessions: [UserSession] }
struct AuditPayload: Decodable { let entries: [AuditEntry] }
struct SocialLinkPayload: Decodable { let link: SocialLink }
struct TrustedPersonPayload: Decodable { let person: TrustedPerson }

/// Decodes any non-null `data` object when the caller doesn't need the payload
/// (e.g. DELETE/PATCH acknowledgements).
struct EmptyOK: Decodable {}

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

// MARK: - Privacy & compliance

struct Consent: Decodable, Identifiable, Hashable {
    var id: String { consentKey }
    let consentKey: String
    let granted: Bool
}
struct ConsentsPayload: Decodable { let consents: [Consent] }

struct PrivacyRequestItem: Decodable, Identifiable, Hashable {
    let id: String
    let type: String
    let regulation: String?
    let status: String
    let createdAt: String?
}
struct PrivacyRequestsPayload: Decodable { let requests: [PrivacyRequestItem] }
struct PrivacyRequestPayload: Decodable { let request: PrivacyRequestItem }

struct RetentionItem: Decodable, Identifiable, Hashable {
    var id: String { category }
    let category: String
    let period: String
}
struct RetentionPayload: Decodable { let retention: [RetentionItem] }

// MARK: - AI knowledge retrieval

struct KnowledgeChunk: Decodable, Identifiable, Hashable {
    let id: String
    let scope: String
    let title: String
    let content: String
}

struct RetrievePayload: Decodable { let chunks: [KnowledgeChunk] }

// MARK: - Communication (chat)

struct ChatRoom: Identifiable, Hashable {
    let id: String
    let name: String
    let icon: String
    /// One of: group, property, zone, asset, task, dm.
    let type: String
    let unread: Int
    var phone: String?
}

struct ChatMessage: Identifiable, Hashable {
    let id: String
    let author: String
    let role: String?
    let text: String
    let time: String
    let mine: Bool
    let avatarColor: Int
}

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
