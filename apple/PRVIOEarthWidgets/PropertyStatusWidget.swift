import WidgetKit
import SwiftUI

/// Estate health, zones and objects — Home Screen (small/medium) and Lock Screen
/// (accessory) families.
struct PropertyStatusWidget: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: "PropertyStatus", provider: EstateProvider()) { entry in
            PropertyStatusView(entry: entry)
                .containerBackground(Theme.bg1, for: .widget)
        }
        .configurationDisplayName("Property Status")
        .description("Estate health, zones and objects at a glance.")
        .supportedFamilies([
            .systemSmall, .systemMedium,
            .accessoryRectangular, .accessoryCircular, .accessoryInline,
        ])
    }
}

private struct PropertyStatusView: View {
    @Environment(\.widgetFamily) private var family
    let entry: EstateEntry

    private var s: EstateSnapshot { entry.snapshot }

    var body: some View {
        switch family {
        case .accessoryInline:
            Text("\(s.propertyName) · \(s.healthScore)%")
        case .accessoryCircular:
            Gauge(value: Double(s.healthScore), in: 0...100) {
                Text("Health")
            } currentValueLabel: {
                Text("\(s.healthScore)")
            }
            .gaugeStyle(.accessoryCircular)
        case .accessoryRectangular:
            VStack(alignment: .leading, spacing: 2) {
                Text(s.propertyName).font(.headline).lineLimit(1)
                Text("Health \(s.healthScore)% · \(s.zoneCount) zones")
                Text("\(s.objectCount) objects · \(s.openTasks) tasks")
            }
            .font(.caption)
        case .systemMedium:
            HStack(spacing: 16) {
                healthRing
                VStack(alignment: .leading, spacing: 6) {
                    Text(s.propertyName).font(.headline).foregroundStyle(Theme.text1).lineLimit(1)
                    stat("Zones", "\(s.zoneCount)")
                    stat("Objects", "\(s.objectCount)")
                    stat("Open tasks", "\(s.openTasks)")
                }
                Spacer()
            }
        default: // systemSmall
            VStack(alignment: .leading, spacing: 8) {
                HStack {
                    Circle().fill(Theme.accent).frame(width: 6, height: 6)
                    Text("Live").font(.system(size: 10, weight: .medium)).foregroundStyle(Theme.accent)
                }
                Spacer()
                Text("\(s.healthScore)")
                    .font(.system(size: 34, weight: .bold)).foregroundStyle(Theme.text1)
                Text("Health score").font(.caption2).foregroundStyle(Theme.text2)
                Text("\(s.zoneCount) zones · \(s.objectCount) obj")
                    .font(.caption2).foregroundStyle(Theme.text3)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var healthRing: some View {
        ZStack {
            Circle().stroke(Color.white.opacity(0.1), lineWidth: 7)
            Circle()
                .trim(from: 0, to: CGFloat(s.healthScore) / 100)
                .stroke(Theme.estateGradient, style: StrokeStyle(lineWidth: 7, lineCap: .round))
                .rotationEffect(.degrees(-90))
            Text("\(s.healthScore)").font(.title3.bold()).foregroundStyle(Theme.text1)
        }
        .frame(width: 64, height: 64)
    }

    private func stat(_ label: String, _ value: String) -> some View {
        HStack(spacing: 6) {
            Text(value).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text(label).font(.caption2).foregroundStyle(Theme.text2)
        }
    }
}
