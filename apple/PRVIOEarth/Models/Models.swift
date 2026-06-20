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
