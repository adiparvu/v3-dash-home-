import ActivityKit
import WidgetKit
import SwiftUI

/// Lock Screen banner + Dynamic Island presentation for an in-progress estate job.
struct MaintenanceLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: MaintenanceActivityAttributes.self) { context in
            LockScreenView(context: context)
                .activityBackgroundTint(Theme.bg1.opacity(0.92))
                .activitySystemActionForegroundColor(Theme.accent)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label(context.attributes.kind, systemImage: context.attributes.symbol)
                        .font(.caption).foregroundStyle(Theme.accent)
                }
                DynamicIslandExpandedRegion(.trailing) {
                    if let eta = context.state.etaMinutes {
                        Text("\(eta)m").font(.caption).foregroundStyle(Theme.text2)
                    }
                }
                DynamicIslandExpandedRegion(.center) {
                    Text(context.attributes.jobTitle).font(.headline).lineLimit(1)
                }
                DynamicIslandExpandedRegion(.bottom) {
                    VStack(alignment: .leading, spacing: 4) {
                        ProgressView(value: context.state.progress).tint(Theme.accent)
                        Text(context.state.status).font(.caption2).foregroundStyle(Theme.text2)
                    }
                }
            } compactLeading: {
                Image(systemName: context.attributes.symbol).foregroundStyle(Theme.accent)
            } compactTrailing: {
                Text("\(Int(context.state.progress * 100))%").foregroundStyle(Theme.text1)
            } minimal: {
                Image(systemName: context.attributes.symbol).foregroundStyle(Theme.accent)
            }
            .keylineTint(Theme.accent)
        }
    }
}

private struct LockScreenView: View {
    let context: ActivityViewContext<MaintenanceActivityAttributes>

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Label(context.attributes.kind, systemImage: context.attributes.symbol)
                    .font(.caption.weight(.semibold)).foregroundStyle(Theme.accent)
                Spacer()
                if let eta = context.state.etaMinutes {
                    Text("ETA \(eta) min").font(.caption).foregroundStyle(Theme.text2)
                }
            }
            Text(context.attributes.jobTitle).font(.headline).foregroundStyle(Theme.text1).lineLimit(1)
            Text("\(context.attributes.propertyName) · \(context.attributes.technician)")
                .font(.caption).foregroundStyle(Theme.text2).lineLimit(1)
            ProgressView(value: context.state.progress).tint(Theme.accent)
            Text(context.state.status).font(.caption2).foregroundStyle(Theme.text3)
        }
        .padding(14)
    }
}
