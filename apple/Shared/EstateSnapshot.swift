import Foundation
#if canImport(WidgetKit)
import WidgetKit
#endif

/// A compact, Codable snapshot of estate state shared between the app and its
/// widget extension via an App Group container. The app writes it after loading
/// data; widgets read it (no network in the widget process).
struct EstateSnapshot: Codable, Hashable {
    var propertyName: String
    var healthScore: Int
    var zoneCount: Int
    var objectCount: Int
    var openTasks: Int
    var nextMaintenance: String?
    var updatedAt: Date

    static let demo = EstateSnapshot(
        propertyName: "Prvio Estate",
        healthScore: 87,
        zoneCount: 4,
        objectCount: 142,
        openTasks: 7,
        nextMaintenance: "Irrigation service · in 3 days",
        updatedAt: Date()
    )
}

/// Reads and writes the shared snapshot in the App Group, and nudges WidgetKit to
/// refresh when the app publishes a new one.
enum SharedStore {
    static let appGroup = "group.earth.prvio.app"
    private static let key = "estate-snapshot"

    static func save(_ snapshot: EstateSnapshot) {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let data = try? JSONEncoder().encode(snapshot) else { return }
        defaults.set(data, forKey: key)
        #if canImport(WidgetKit)
        WidgetCenter.shared.reloadAllTimelines()
        #endif
    }

    /// Returns the stored snapshot, or the demo snapshot when none exists yet.
    static func load() -> EstateSnapshot {
        guard let defaults = UserDefaults(suiteName: appGroup),
              let data = defaults.data(forKey: key),
              let snapshot = try? JSONDecoder().decode(EstateSnapshot.self, from: data)
        else { return .demo }
        return snapshot
    }
}
