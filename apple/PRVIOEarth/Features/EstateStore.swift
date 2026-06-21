import Foundation
import Observation

/// Loads estate data from the versioned API, falling back to `DemoData` so screens
/// always render. `source` drives the "Synced / Demo" badge, mirroring the web app.
@MainActor
@Observable
final class EstateStore {
    enum Source { case synced, demo }

    private(set) var properties: [Property] = DemoData.properties
    private(set) var zones: [Zone] = DemoData.zones
    private(set) var assets: [Asset] = DemoData.assets
    private(set) var source: Source = .demo
    private(set) var isLoading = false

    private let api: APIClient?

    init(api: APIClient?) { self.api = api }

    func load() async {
        guard let api else { source = .demo; return }
        isLoading = true
        defer { isLoading = false }
        do {
            async let props = api.get("/properties", as: PropertiesPayload.self).properties
            let loaded = try await props
            properties = loaded.isEmpty ? DemoData.properties : loaded
            source = loaded.isEmpty ? .demo : .synced
            if let first = loaded.first {
                if let z = try? await api.get("/properties/\(first.id)/zones", as: ZonesPayload.self).zones, !z.isEmpty {
                    zones = z
                }
                if let a = try? await api.get("/properties/\(first.id)/assets", as: AssetsPayload.self).assets, !a.isEmpty {
                    assets = a
                }
            }
        } catch {
            // Keep demo data; stay browsable.
            source = .demo
        }
        publishSnapshot()
    }

    var portfolioValue: Double {
        assets.compactMap(\.currentValue).reduce(0, +)
    }

    /// Publish a compact snapshot for the widget extension (App Group + WidgetKit)
    /// and push it to the paired Apple Watch via WatchConnectivity.
    private func publishSnapshot() {
        let snapshot = EstateSnapshot(
            propertyName: properties.first?.name ?? "PRVIO Earth",
            healthScore: 87,
            zoneCount: zones.count,
            objectCount: assets.count,
            openTasks: 7,
            nextMaintenance: "Irrigation service · in 3 days",
            estateValue: properties.first?.currentValue ?? (portfolioValue > 0 ? portfolioValue : nil),
            updatedAt: Date()
        )
        SharedStore.save(snapshot)
        WatchBridge.shared.send(snapshot)
    }
}
