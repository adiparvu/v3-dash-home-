import SwiftUI
import MapKit

/// Home dashboard — property header, a live map hero with the estate health
/// ring, quick stat chips, and an overview grid of summary cards. Native, light,
/// minimal (matching the PRVIO reference).
struct OverviewView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
    @State private var estate: EstateStore?
    @State private var showProfile = false
    @State private var showSearch = false
    @State private var showNotifications = false

    private let healthScore = 81

    private var property: Property? { estate?.properties.first }
    private var propertyName: String { property?.name ?? "PRVIO Earth" }
    private var zones: Int { estate?.zones.count ?? 0 }
    private var objects: Int { estate?.assets.count ?? 0 }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    mapHero
                    statChips
                    overviewGrid
                }
                .padding(16)
            }
            .background(ScreenBackground())
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) { propertyHeader }
                ToolbarItemGroup(placement: .topBarTrailing) {
                    healthBadge
                    Button { showSearch = true } label: { Image(systemName: "magnifyingglass") }
                    Button { showNotifications = true } label: { Image(systemName: "bell") }
                }
            }
            .sheet(isPresented: $showProfile) { ProfileView() }
            .sheet(isPresented: $showSearch) { NavigationStack { SearchView() } }
            .sheet(isPresented: $showNotifications) { NavigationStack { NotificationsView() } }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }

    // MARK: - Header

    private var propertyHeader: some View {
        Button { showProfile = true } label: {
            HStack(spacing: 9) {
                Circle().fill(settings.accentColor.opacity(0.2)).frame(width: 30, height: 30)
                    .overlay(Text(initials).font(.caption.bold()).foregroundStyle(settings.accentColor))
                VStack(alignment: .leading, spacing: 1) {
                    HStack(spacing: 3) {
                        Text(propertyName).font(.headline).foregroundStyle(Theme.text1).lineLimit(1)
                        Image(systemName: "chevron.down").font(.caption2).foregroundStyle(Theme.text2)
                    }
                    HStack(spacing: 4) {
                        Circle().fill(Theme.accent).frame(width: 5, height: 5)
                        Text("Live").font(.caption2).foregroundStyle(Theme.accent)
                    }
                }
            }
        }
        .buttonStyle(.plain)
    }

    private var initials: String { (auth.profile ?? DemoData.profile).initials }

    private var healthBadge: some View {
        ZStack {
            Circle().stroke(Theme.accent, lineWidth: 2).frame(width: 26, height: 26)
            Text("\(healthScore)").font(.system(size: 11, weight: .bold)).foregroundStyle(Theme.accent)
        }
    }

    // MARK: - Map hero

    private var region: MKCoordinateRegion {
        let coord = CLLocationCoordinate2D(
            latitude: property?.latitude ?? 45.6580,
            longitude: property?.longitude ?? 25.6012
        )
        return MKCoordinateRegion(center: coord, latitudinalMeters: 600, longitudinalMeters: 600)
    }

    private var mapHero: some View {
        Map(initialPosition: .region(region))
            .mapStyle(.hybrid)
            .allowsHitTesting(false)
            .frame(height: 200)
            .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
            .overlay(alignment: .bottomLeading) { healthRingBadge.padding(12) }
            .overlay(alignment: .bottomTrailing) {
                VStack(alignment: .trailing, spacing: 1) {
                    Text(propertyName).font(.subheadline.weight(.semibold)).foregroundStyle(.white)
                    if let loc = property?.locationLine, !loc.isEmpty {
                        Text(loc).font(.caption2).foregroundStyle(.white.opacity(0.85))
                    }
                }
                .shadow(radius: 4)
                .padding(12)
            }
    }

    private var healthRingBadge: some View {
        HStack(spacing: 8) {
            ZStack {
                Circle().stroke(.white.opacity(0.25), lineWidth: 4)
                Circle().trim(from: 0, to: CGFloat(healthScore) / 100)
                    .stroke(Theme.accent, style: StrokeStyle(lineWidth: 4, lineCap: .round))
                    .rotationEffect(.degrees(-90))
                Text("\(healthScore)").font(.caption.bold()).foregroundStyle(.white)
            }
            .frame(width: 40, height: 40)
            Text("Good").font(.caption2.weight(.medium)).foregroundStyle(.white)
        }
        .padding(8)
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
        .environment(\.colorScheme, .dark)
    }

    // MARK: - Stat chips

    private var statChips: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                chip("square.grid.2x2.fill", "\(zones)", "Zones", Theme.cyan)
                chip("shippingbox.fill", "\(objects)", "Objects", Theme.accent)
                chip("checklist", "1", "Tasks", Theme.amber)
                chip("exclamationmark.triangle.fill", "1", "Alerts", Theme.orange)
            }
        }
    }

    private func chip(_ icon: String, _ value: String, _ label: String, _ color: Color) -> some View {
        HStack(spacing: 6) {
            Image(systemName: icon).font(.caption2).foregroundStyle(color)
            Text(value).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text(label).font(.caption).foregroundStyle(Theme.text2)
        }
        .padding(.horizontal, 12).padding(.vertical, 8)
        .background(Theme.bg2, in: Capsule())
    }

    // MARK: - Overview grid

    private var overviewGrid: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("OVERVIEW").font(.caption.weight(.semibold)).foregroundStyle(Theme.text3)
            LazyVGrid(columns: [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)], spacing: 12) {
                statCard("checklist", Theme.amber, big: "1", small: "urgent", title: "Tasks")
                statCard("creditcard.fill", Theme.accent, big: settings.money(property?.currentValue ?? 0), small: "value", title: "Finances")
                statCard("doc.fill", Theme.violet, big: "\(estate?.assets.count ?? 0)", small: "tracked", title: "Inventory")
                statCard("person.2.fill", Theme.cyan, big: "\(estate?.zones.count ?? 0)", small: "areas", title: "Zones")
            }
        }
    }

    private func statCard(_ icon: String, _ color: Color, big: String, small: String, title: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Image(systemName: icon).font(.headline).foregroundStyle(color)
            Spacer(minLength: 8)
            Text(big).font(.title2.bold()).foregroundStyle(Theme.text1).lineLimit(1).minimumScaleFactor(0.6)
            Text(small).font(.caption2).foregroundStyle(Theme.text3)
            Text(title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text2)
        }
        .frame(maxWidth: .infinity, minHeight: 120, alignment: .leading)
        .padding(16)
        .liquidGlass()
    }
}
