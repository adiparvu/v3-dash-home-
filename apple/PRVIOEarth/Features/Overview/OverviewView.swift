import SwiftUI

struct OverviewView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
    @State private var estate: EstateStore?
    @State private var showProfile = false
    @State private var showChat = false
    @State private var showSettings = false

    private let healthScore = 87

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    liveBadge
                    heroCard
                    healthAndStats
                    WeatherCard()
                    quickZones
                }
                .padding(16)
            }
            .background(AuroraBackground())
            .navigationTitle("Good morning")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Text(estate?.properties.first?.name ?? "PRVIO Earth")
                        .font(.title2.bold())
                        .foregroundStyle(Theme.text1)
                }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    Button { showChat = true } label: { Image(systemName: "bubble.left.and.bubble.right.fill") }
                    Button { showSettings = true } label: { Image(systemName: "gearshape.fill") }
                    Button { showProfile = true } label: {
                        Circle().fill(settings.accentColor.opacity(0.2))
                            .frame(width: 30, height: 30)
                            .overlay(Text(initials).font(.caption.bold()).foregroundStyle(settings.accentColor))
                    }
                }
            }
            .sheet(isPresented: $showProfile) { ProfileView() }
            .sheet(isPresented: $showChat) { ChatListView() }
            .sheet(isPresented: $showSettings) { NavigationStack { SettingsHubView() } }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }

    private var initials: String { (auth.profile ?? DemoData.profile).initials }

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
        VStack(alignment: .leading, spacing: 6) {
            Text(estate?.properties.first?.name ?? "PRVIO Earth")
                .font(.largeTitle.bold()).foregroundStyle(Theme.text1)
            if let line = estate?.properties.first?.locationLine, !line.isEmpty {
                Text(line).font(.subheadline).foregroundStyle(Theme.text2)
            }
            Spacer(minLength: 14)
            if let value = estate?.properties.first?.currentValue {
                Text(settings.money(value)).font(.title.bold()).foregroundStyle(Theme.accent)
                Text("Estate value").font(.caption2).foregroundStyle(Theme.text3)
            }
        }
        .frame(maxWidth: .infinity, minHeight: 172, alignment: .leading)
        .padding(20)
        .background(
            RoundedRectangle(cornerRadius: 26, style: .continuous)
                .fill(LinearGradient(colors: [Theme.accent.opacity(0.20), Theme.violet.opacity(0.10)],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
        )
        .liquidGlass(cornerRadius: 26)
        .shadow(color: Theme.accent.opacity(0.22), radius: 22, y: 10)
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
                        .shadow(color: Theme.accent.opacity(0.6), radius: 10)
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
