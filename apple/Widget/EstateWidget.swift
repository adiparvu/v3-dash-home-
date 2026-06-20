import WidgetKit
import SwiftUI
import PrvioKit

// Reference WidgetKit extension for the PRVIO Earth Home Screen widgets. Add to
// an Xcode Widget Extension target that depends on PrvioKit. The timeline pulls
// the estate snapshot from the backend and renders the same content the web
// Widget Gallery previews — small/medium/large via the widget family.

struct EstateEntry: TimelineEntry {
    let date: Date
    let data: WidgetData
}

struct EstateProvider: TimelineProvider {
    // A placeholder snapshot for previews / redacted states.
    static let placeholder = EstateSnapshot(
        estateName: "Prvio Estate", healthScore: 87, zones: 26, objects: 142,
        openTasks: 7, alerts: 3, maintenanceDue: 1, nextMaintenanceDays: 3,
        propertyValue: 2_400_000, appreciationPct: 4.2,
        weather: Weather(tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, source: "fallback"),
        security: .init(armed: true, cameras: 8, camerasOnline: 7, openDoors: 0),
        month: Calendar.current.component(.month, from: Date()) - 1
    )

    func placeholder(in context: Context) -> EstateEntry {
        EstateEntry(date: Date(), data: WidgetContent.build(.propertyStatus, from: Self.placeholder))
    }

    func getSnapshot(in context: Context, completion: @escaping (EstateEntry) -> Void) {
        completion(placeholder(in: context))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<EstateEntry>) -> Void) {
        // Production: fetch the snapshot from the backend, then build the widget.
        let entry = EstateEntry(date: Date(), data: WidgetContent.build(.propertyStatus, from: Self.placeholder))
        // Refresh every 30 minutes.
        completion(Timeline(entries: [entry], policy: .after(Date().addingTimeInterval(1800))))
    }
}

struct EstateWidgetView: View {
    let entry: EstateEntry

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(entry.data.icon)
                Spacer()
                Circle().fill(.green).frame(width: 6, height: 6)
            }
            Spacer()
            Text(entry.data.primary)
                .font(.system(size: 30, weight: .bold, design: .rounded))
            Text(entry.data.title).font(.caption).bold()
            if let secondary = entry.data.secondary {
                Text(secondary).font(.caption2).foregroundStyle(.secondary)
            }
        }
        .padding()
        .widgetURL(URL(string: "prvio:/\(entry.data.deepLink)"))
    }
}

struct EstateWidget: Widget {
    let kind = "EstateWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: EstateProvider()) { entry in
            EstateWidgetView(entry: entry)
        }
        .configurationDisplayName("Estate Status")
        .description("Health score, tasks and alerts at a glance.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
