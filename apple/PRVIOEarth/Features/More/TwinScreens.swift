import SwiftUI

// MARK: - Automations (live schedules)

struct AutomationsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Automations", source: store?.schedulesSource) {
            ForEach(store?.schedules ?? []) { s in
                GlassRow(icon: "bolt.horizontal.fill",
                         iconColor: (s.enabled ?? false) ? Theme.violet : Theme.text3,
                         title: (s.automationId ?? "Automation").capitalized,
                         subtitle: s.area,
                         trailing: s.atTime,
                         trailingColor: (s.enabled ?? false) ? Theme.accent : Theme.text3)
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadSchedules()
        }
    }
}

// MARK: - Devices (live)

struct DevicesView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Devices", source: store?.devicesSource) {
            ForEach(store?.devices ?? []) { d in
                GlassRow(icon: "homekit",
                         iconColor: d.status == "online" ? Theme.accent : Theme.text3,
                         title: d.displayName,
                         subtitle: [d.manufacturer, d.type].compactMap { $0 }.joined(separator: " · "),
                         trailing: d.status,
                         trailingColor: d.status == "online" ? Theme.accent : Theme.orange)
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadDevices()
        }
    }
}

// MARK: - Sensors (live; scoped to the first zone)

struct SensorsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Sensors", source: store?.sensorsSource) {
            ForEach(store?.sensors ?? []) { s in
                GlassRow(icon: symbol(for: s.type), iconColor: Theme.cyan,
                         title: s.name, subtitle: s.type,
                         trailing: valueText(s), trailingColor: Theme.text1)
            }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadSensors(zoneId: estate?.zones.first?.id)
        }
    }

    private func valueText(_ s: SensorReading) -> String? {
        guard let v = s.value else { return nil }
        let num = v == v.rounded() ? String(Int(v)) : String(format: "%.1f", v)
        return num + (s.unit ?? "")
    }
    private func symbol(for type: String?) -> String {
        switch type {
        case "temperature": return "thermometer.medium"
        case "moisture", "level": return "drop.fill"
        case "humidity": return "humidity.fill"
        default: return "sensor.fill"
        }
    }
}

// MARK: - Search (client-side over loaded estate data)

struct SearchView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?
    @State private var query = ""

    private struct Hit: Identifiable {
        let id = UUID()
        let icon: String
        let color: Color
        let title: String
        let subtitle: String
    }

    private var hits: [Hit] {
        guard let estate else { return [] }
        var all: [Hit] = []
        all += estate.properties.map { Hit(icon: "building.2.fill", color: Theme.accent, title: $0.name, subtitle: $0.locationLine) }
        all += estate.zones.map { Hit(icon: "map.fill", color: Theme.cyan, title: $0.name, subtitle: $0.description ?? "Zone") }
        all += estate.assets.map { Hit(icon: "shippingbox.fill", color: Theme.amber, title: $0.name, subtitle: [$0.manufacturer, $0.model].compactMap { $0 }.joined(separator: " · ")) }
        all += DemoData.contractors.map { Hit(icon: "person.crop.circle.fill", color: Theme.violet, title: $0.name, subtitle: $0.company ?? "Contractor") }
        let q = query.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return all }
        return all.filter { $0.title.lowercased().contains(q) || $0.subtitle.lowercased().contains(q) }
    }

    var body: some View {
        ListPage(title: "Search", source: estate?.source) {
            ForEach(hits) { hit in
                GlassRow(icon: hit.icon, iconColor: hit.color, title: hit.title, subtitle: hit.subtitle)
            }
            if hits.isEmpty {
                Text("No matches").font(.subheadline).foregroundStyle(Theme.text3).padding(.top, 24)
            }
        }
        .searchable(text: $query, prompt: "Search properties, zones, objects…")
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }
}
