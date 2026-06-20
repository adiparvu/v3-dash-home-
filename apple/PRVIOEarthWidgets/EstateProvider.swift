import WidgetKit

struct EstateEntry: TimelineEntry {
    let date: Date
    let snapshot: EstateSnapshot
}

/// Feeds widgets from the App Group snapshot the app publishes. Reloads are driven
/// by `SharedStore.save(_:)` / WidgetKit; the timeline also refreshes periodically.
struct EstateProvider: TimelineProvider {
    func placeholder(in context: Context) -> EstateEntry {
        EstateEntry(date: .now, snapshot: .demo)
    }

    func getSnapshot(in context: Context, completion: @escaping (EstateEntry) -> Void) {
        completion(EstateEntry(date: .now, snapshot: SharedStore.load()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<EstateEntry>) -> Void) {
        let entry = EstateEntry(date: .now, snapshot: SharedStore.load())
        let next = Calendar.current.date(byAdding: .minute, value: 30, to: .now) ?? .now
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}
