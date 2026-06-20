import WidgetKit
import SwiftUI

/// Open tasks + the next maintenance item — Home Screen (small/medium) and Lock
/// Screen (accessory) families.
struct TasksWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "Tasks", provider: EstateProvider()) { entry in
            TasksView(entry: entry)
                .containerBackground(Theme.bg1, for: .widget)
        }
        .configurationDisplayName("Tasks & Maintenance")
        .description("Open tasks and the next maintenance due.")
        .supportedFamilies([.systemSmall, .systemMedium, .accessoryInline, .accessoryCircular])
    }
}

private struct TasksView: View {
    @Environment(\.widgetFamily) private var family
    let entry: EstateEntry

    private var s: EstateSnapshot { entry.snapshot }

    var body: some View {
        switch family {
        case .accessoryInline:
            Text("\(s.openTasks) open tasks")
        case .accessoryCircular:
            Gauge(value: Double(min(s.openTasks, 10)), in: 0...10) {
                Image(systemName: "checklist")
            } currentValueLabel: {
                Text("\(s.openTasks)")
            }
            .gaugeStyle(.accessoryCircular)
        case .systemMedium:
            VStack(alignment: .leading, spacing: 8) {
                header
                if let next = s.nextMaintenance {
                    Label(next, systemImage: "wrench.and.screwdriver.fill")
                        .font(.caption).foregroundStyle(Theme.text2).lineLimit(1)
                }
                Spacer()
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        default: // systemSmall
            VStack(alignment: .leading, spacing: 6) {
                Image(systemName: "checklist").foregroundStyle(Theme.accent)
                Spacer()
                Text("\(s.openTasks)").font(.system(size: 34, weight: .bold)).foregroundStyle(Theme.text1)
                Text("Open tasks").font(.caption2).foregroundStyle(Theme.text2)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var header: some View {
        HStack {
            Image(systemName: "checklist").foregroundStyle(Theme.accent)
            Text("\(s.openTasks) open tasks").font(.headline).foregroundStyle(Theme.text1)
            Spacer()
        }
    }
}
