import Foundation

/// Seeded data used when the backend is unreachable or unconfigured, mirroring the
/// web client's localStorage prototype so the UI is fully browsable offline.
enum DemoData {
    static let profile = Profile(
        id: "demo-user",
        email: "alex@prvio.earth",
        firstName: "Alex",
        lastName: "Owner",
        displayName: "Alex Owner",
        phone: nil,
        notes: nil,
        avatarRingColor: 0x4ADE80,
        createdAt: "2024-01-01T00:00:00Z"
    )

    static let properties: [Property] = [
        Property(id: "demo-estate", name: "Prvio Estate", description: "Private estate",
                 address: nil, city: "Brașov", country: "România",
                 totalAreaSqm: 42000, currency: "EUR", isActive: true,
                 createdAt: "2019-06-01T00:00:00Z"),
        Property(id: "demo-villa", name: "Lakeside Villa", description: nil,
                 address: nil, city: "Sinaia", country: "România",
                 totalAreaSqm: 5400, currency: "EUR", isActive: true,
                 createdAt: "2021-03-12T00:00:00Z"),
    ]

    static let zones: [Zone] = [
        Zone(id: "z-lake", name: "Lake", description: "Spring-fed lake", areaSqm: 8200, color: "#22D3EE", icon: "💧"),
        Zone(id: "z-forest", name: "Forest", description: "Mixed woodland", areaSqm: 21000, color: "#4ADE80", icon: "🌲"),
        Zone(id: "z-greenhouse", name: "Greenhouse", description: nil, areaSqm: 320, color: "#4ADE80", icon: "🏡"),
        Zone(id: "z-orchard", name: "Orchard", description: nil, areaSqm: 4100, color: "#F59E0B", icon: "🍎"),
    ]

    static let assets: [Asset] = [
        Asset(id: "a-tractor", name: "Kubota Tractor", manufacturer: "Kubota", model: "L3301", currentValue: 24000, condition: "good"),
        Asset(id: "a-pump", name: "Irrigation Pump", manufacturer: "Grundfos", model: "CR-15", currentValue: 3200, condition: "fair"),
        Asset(id: "a-pv", name: "Solar Array", manufacturer: "SunPower", model: "Maxeon 6", currentValue: 48000, condition: "excellent"),
    ]
}
