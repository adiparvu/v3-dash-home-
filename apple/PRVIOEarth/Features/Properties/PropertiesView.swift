import SwiftUI

struct PropertiesView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?

    var body: some View {
        ScrollView {
            VStack(spacing: 12) {
                if let estate {
                    ForEach(estate.properties) { property in
                        NavigationLink(value: property) {
                            PropertyRow(property: property)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding(16)
        }
        .background(ScreenBackground())
        .navigationTitle("Properties")
        .navigationDestination(for: Property.self) { PropertyDetailView(property: $0) }
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                if let estate {
                    Badge(text: estate.source == .synced ? "Synced" : "Demo",
                          color: estate.source == .synced ? Theme.accent : Theme.amber)
                }
            }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }
}

private struct PropertyRow: View {
    @Environment(AppSettings.self) private var settings
    let property: Property

    var body: some View {
        HStack(spacing: 14) {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .fill(Theme.estateGradient)
                .frame(width: 52, height: 52)
                .overlay(Image(systemName: "house.fill").foregroundStyle(Theme.bg1))
            VStack(alignment: .leading, spacing: 3) {
                Text(property.name).font(.headline).foregroundStyle(Theme.text1)
                if !property.locationLine.isEmpty {
                    Text(property.locationLine).font(.caption).foregroundStyle(Theme.text2)
                }
                if let area = property.totalAreaSqm {
                    Text(settings.area(area)).font(.caption2).foregroundStyle(Theme.text3)
                }
            }
            Spacer()
            Image(systemName: "chevron.right").font(.footnote).foregroundStyle(Theme.text3)
        }
        .padding(14)
        .liquidGlass()
    }
}
