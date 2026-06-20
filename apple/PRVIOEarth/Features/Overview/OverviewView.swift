import SwiftUI

struct OverviewView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?

    private let healthScore = 87

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    liveBadge
                    heroCard
                    healthAndStats
                    quickZones
                }
                .padding(16)
            }
            .background(Theme.bg1.ignoresSafeArea())
            .navigationTitle("Good morning")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Text(estate?.properties.first?.name ?? "PRVIO Earth")
                        .font(.title2.bold())
                        .foregroundStyle(Theme.text1)
                }
            }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }

    private var liveBadge: some View {
        HStack(spacing: 6) {
            Circle().fill(Theme.accent).frame(width: 6, height: 6)
            Text("Live").font(.caption.weight(.medium)).foregroundStyle(Theme.accent)
            Text("· Updated just now").font(.caption).foregroundStyle(Theme.text3)
            Spacer()
            if let estate {
                Badge(text: estate.source == .synced ? "Synced" : "Demo",
                      color: estate.source == .synced ? Theme.accent : Theme.amber)
            }
        }
    }

    private var heroCard: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(LinearGradient(colors: [Color(hex: 0x0D1F35), Color(hex: 0x071830)],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(height: 180)
                .overlay(
                    RoundedRectangle(cornerRadius: 18, style: .continuous)
                        .strokeBorder(Theme.accent.opacity(0.4), lineWidth: 1.5)
                        .padding(28)
                )
            Text("\(estate?.zones.count ?? 0) zones · \(estate?.assets.count ?? 0) objects")
                .font(.caption).foregroundStyle(Theme.text2)
                .padding(12)
        }
    }

    private var healthAndStats: some View {
        HStack(spacing: 12) {
            VStack(spacing: 8) {
                Text("Health Score").font(.system(size: 10, weight: .medium)).foregroundStyle(Theme.text2)
                ZStack {
                    Circle().stroke(Color.white.opacity(0.08), lineWidth: 8)
                    Circle()
                        .trim(from: 0, to: CGFloat(healthScore) / 100)
                        .stroke(Theme.estateGradient, style: StrokeStyle(lineWidth: 8, lineCap: .round))
                        .rotationEffect(.degrees(-90))
                    Text("\(healthScore)").font(.title2.bold()).foregroundStyle(Theme.text1)
                }
                .frame(width: 76, height: 76)
                Text("Very Good").font(.caption.weight(.medium)).foregroundStyle(Theme.accent)
            }
            .padding(16)
            .liquidGlass()

            let stats: [(String, String, Color)] = [
                ("\(estate?.zones.count ?? 0)", "Zones", Theme.text1),
                ("\(estate?.assets.count ?? 0)", "Objects", Theme.text1),
                ("7", "Tasks", Theme.text1),
                ("3", "Alerts", Theme.orange),
            ]
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                ForEach(stats, id: \.1) { value, label, color in
                    VStack(alignment: .leading, spacing: 2) {
                        Text(value).font(.title3.bold()).foregroundStyle(color)
                        Text(label).font(.caption).foregroundStyle(Theme.text2)
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
                    .liquidGlass(cornerRadius: 16)
                }
            }
        }
    }

    private var quickZones: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Quick Access").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 8) {
                ForEach(estate?.zones ?? []) { zone in
                    VStack(spacing: 6) {
                        Text(zone.icon ?? "📍").font(.title3)
                        Text(zone.name).font(.system(size: 10, weight: .medium))
                            .foregroundStyle(Theme.text1).lineLimit(1)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 10)
                    .liquidGlass(cornerRadius: 16)
                }
            }
        }
    }
}
