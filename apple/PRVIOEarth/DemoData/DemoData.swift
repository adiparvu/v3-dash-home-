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
        autoLockSeconds: 300,
        loginAlerts: true,
        createdAt: "2024-01-01T00:00:00Z"
    )

    static let socialLinks: [SocialLink] = [
        SocialLink(id: "sl1", platform: "instagram", label: nil, url: "https://instagram.com/prvio"),
        SocialLink(id: "sl2", platform: "linkedin", label: nil, url: "https://linkedin.com/in/prvio"),
    ]

    static let trustedPersons: [TrustedPerson] = [
        TrustedPerson(id: "tp1", name: "Maria Ionescu", relationship: "Spouse", email: "maria@example.com",
                      permissions: ["emergency_access", "recovery_approvals"]),
        TrustedPerson(id: "tp2", name: "Andrei Pop", relationship: "Lawyer", email: "andrei@law.ro",
                      permissions: ["ownership_transfer", "estate_continuity"]),
    ]

    static let sessions: [UserSession] = [
        UserSession(id: "se1", deviceName: "iPhone 16 Pro", platform: "iOS", location: "Brașov, RO",
                    isTrusted: true, isCurrent: true, lastActiveAt: "2026-06-21T08:30:00Z"),
        UserSession(id: "se2", deviceName: "MacBook Pro", platform: "macOS", location: "Brașov, RO",
                    isTrusted: true, isCurrent: false, lastActiveAt: "2026-06-20T19:10:00Z"),
        UserSession(id: "se3", deviceName: "Safari", platform: "Web", location: "București, RO",
                    isTrusted: false, isCurrent: false, lastActiveAt: "2026-06-18T11:02:00Z"),
    ]

    static let audit: [AuditEntry] = [
        AuditEntry(id: "a1", action: "profile.update", resource: "profiles", detail: "Updated: display_name", createdAt: "2026-06-21T08:31:00Z"),
        AuditEntry(id: "a2", action: "session.revoke", resource: "user_sessions", detail: "Old iPad", createdAt: "2026-06-20T20:00:00Z"),
        AuditEntry(id: "a3", action: "property.update", resource: "properties", detail: "Prvio Estate", createdAt: "2026-06-19T14:45:00Z"),
    ]

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

    static let notifications: [NotificationItem] = [
        NotificationItem(id: "n1", title: "Irrigation completed", body: "Greenhouse cycle finished in 42 min.", type: "info", category: "maintenance", isRead: false, createdAt: "2026-06-21T06:30:00Z"),
        NotificationItem(id: "n2", title: "Low water pressure", body: "Irrigation pump CR-15 reported a dip overnight.", type: "warning", category: "sensors", isRead: false, createdAt: "2026-06-20T22:10:00Z"),
        NotificationItem(id: "n3", title: "Contractor confirmed", body: "Solar service scheduled for Friday 09:00.", type: "info", category: "contractors", isRead: true, createdAt: "2026-06-19T14:00:00Z"),
    ]

    static let sensors: [SensorReading] = [
        SensorReading(id: "s-soil", name: "Soil moisture", type: "moisture", unit: "%", value: 38, recordedAt: "2026-06-21T07:00:00Z"),
        SensorReading(id: "s-temp", name: "Air temperature", type: "temperature", unit: "°C", value: 21.4, recordedAt: "2026-06-21T07:00:00Z"),
        SensorReading(id: "s-tank", name: "Water tank", type: "level", unit: "%", value: 72, recordedAt: "2026-06-21T07:00:00Z"),
    ]

    static let devices: [Device] = [
        Device(id: "d-gw", name: "Estate Gateway", type: "hub", status: "online", manufacturer: "Home Assistant"),
        Device(id: "d-pw", name: "Powerwall", type: "battery", status: "online", manufacturer: "Tesla"),
        Device(id: "d-valve", name: "Irrigation Valve", type: "valve", status: "offline", manufacturer: "Rachio"),
    ]

    static let schedules: [Schedule] = [
        Schedule(id: "sc1", automationId: "irrigation", area: "Greenhouse", atTime: "06:00", enabled: true),
        Schedule(id: "sc2", automationId: "lighting", area: "Orchard", atTime: "Sunset", enabled: true),
        Schedule(id: "sc3", automationId: "gate", area: "Main entrance", atTime: "22:00", enabled: false),
    ]

    static let contractors: [Contractor] = [
        Contractor(id: "c1", name: "Ana Pop", company: "GreenScape SRL", phone: "+40 712 345 678", email: "ana@greenscape.ro", rating: 4.8, isPreferred: true),
        Contractor(id: "c2", name: "Mihai Ene", company: "SolarTech", phone: "+40 733 222 111", email: "mihai@solartech.ro", rating: 4.5, isPreferred: false),
    ]

    static let tasks: [TaskItem] = [
        TaskItem(id: "t1", title: "Service irrigation pump", status: "open", due: "in 3 days", priority: "high"),
        TaskItem(id: "t2", title: "Inspect solar inverter", status: "open", due: "Friday", priority: "medium"),
        TaskItem(id: "t3", title: "Prune orchard rows 4–7", status: "in_progress", due: "this week", priority: "low"),
        TaskItem(id: "t4", title: "Replace greenhouse filter", status: "done", due: "done", priority: "low"),
    ]

    static let maintenance: [MaintenanceItem] = [
        MaintenanceItem(id: "m1", title: "Irrigation service", asset: "Irrigation Pump", due: "in 3 days", status: "scheduled"),
        MaintenanceItem(id: "m2", title: "Solar array cleaning", asset: "Solar Array", due: "Friday", status: "scheduled"),
        MaintenanceItem(id: "m3", title: "Tractor oil change", asset: "Kubota Tractor", due: "overdue", status: "overdue"),
    ]

    static let homeAccessories: [HomeAccessory] = [
        HomeAccessory(id: "hk1", name: "Living Room Lamp", room: "Living Room", category: "Lightbulb", isReachable: true, isOn: true),
        HomeAccessory(id: "hk2", name: "Front Gate", room: "Entrance", category: "Door", isReachable: true, isOn: false),
        HomeAccessory(id: "hk3", name: "Greenhouse Outlet", room: "Greenhouse", category: "Outlet", isReachable: true, isOn: true),
        HomeAccessory(id: "hk4", name: "Hallway Motion", room: "Hallway", category: "Sensor", isReachable: false, isOn: nil),
        HomeAccessory(id: "hk5", name: "Thermostat", room: "Living Room", category: "Thermostat", isReachable: true, isOn: nil),
    ]

    static let documents: [DocumentItem] = [
        DocumentItem(id: "doc1", name: "Estate deed.pdf", kind: "Legal", size: "2.1 MB", updatedAt: "2024-02-01"),
        DocumentItem(id: "doc2", name: "Solar warranty.pdf", kind: "Warranty", size: "640 KB", updatedAt: "2023-09-14"),
        DocumentItem(id: "doc3", name: "Insurance policy.pdf", kind: "Insurance", size: "1.3 MB", updatedAt: "2025-01-20"),
    ]
}
