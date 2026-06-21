import SwiftUI

/// Compact estate glance for Apple Watch, reusing the shared `EstateSnapshot`.
/// (On-watch it shows the demo snapshot until WatchConnectivity sync is added.)
struct WatchRootView: View {
    private let s = SharedStore.load()

    var body: some View {
        TabView {
            healthPage
            statsPage
            tasksPage
        }
        .tabViewStyle(.verticalPage)
        .containerBackground(Theme.bg1.gradient, for: .tabView)
    }

    private var healthPage: some View {
        VStack(spacing: 10) {
            Text(s.propertyName).font(.headline).foregroundStyle(Theme.text1).lineLimit(1)
            Gauge(value: Double(s.healthScore), in: 0...100) {
                Text("Health")
            } currentValueLabel: {
                Text("\(s.healthScore)").foregroundStyle(Theme.text1)
            }
            .gaugeStyle(.accessoryCircularCapacity)
            .tint(Theme.accent)
            Text("Health score").font(.caption2).foregroundStyle(Theme.text2)
        }
        .padding()
    }

    private var statsPage: some View {
        VStack(alignment: .leading, spacing: 10) {
            stat("Zones", "\(s.zoneCount)", "square.grid.2x2.fill")
            stat("Objects", "\(s.objectCount)", "shippingbox.fill")
            stat("Open tasks", "\(s.openTasks)", "checklist")
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
    }

    private var tasksPage: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("\(s.openTasks) open tasks", systemImage: "checklist")
                .font(.headline).foregroundStyle(Theme.text1)
            if let next = s.nextMaintenance {
                Label(next, systemImage: "wrench.and.screwdriver.fill")
                    .font(.caption).foregroundStyle(Theme.text2)
            }
            Spacer()
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding()
    }

    private func stat(_ label: String, _ value: String, _ symbol: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: symbol).foregroundStyle(Theme.accent)
            Text(value).font(.title3.bold()).foregroundStyle(Theme.text1)
            Text(label).font(.caption).foregroundStyle(Theme.text2)
        }
    }
}
