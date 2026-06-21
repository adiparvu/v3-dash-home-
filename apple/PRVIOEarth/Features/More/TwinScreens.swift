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

// MARK: - AI Assistant (on-device helper over loaded estate data)

struct AIAssistantView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?
    @State private var input = ""
    @State private var messages: [Message] = [
        Message(role: .assistant, text: "Hi! Ask me about your estate — zones, objects, value, or maintenance.")
    ]

    private struct Message: Identifiable {
        enum Role { case user, assistant }
        let id = UUID()
        let role: Role
        let text: String
    }

    var body: some View {
        VStack(spacing: 0) {
            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(messages) { m in
                        bubble(m)
                    }
                }
                .padding(16)
            }
            HStack(spacing: 10) {
                TextField("Ask about your estate…", text: $input)
                    .textFieldStyle(.plain)
                    .padding(12)
                    .liquidGlass(cornerRadius: 18)
                Button {
                    send()
                } label: {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.title2)
                        .foregroundStyle(Theme.accent)
                }
                .disabled(input.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(12)
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle("AI Assistant")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) { Badge(text: "On-device", color: Theme.violet) }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }

    @ViewBuilder private func bubble(_ m: Message) -> some View {
        HStack {
            if m.role == .user { Spacer(minLength: 40) }
            Text(m.text)
                .font(.subheadline)
                .foregroundStyle(m.role == .user ? Theme.bg1 : Theme.text1)
                .padding(12)
                .background(
                    Group {
                        if m.role == .user {
                            RoundedRectangle(cornerRadius: 16, style: .continuous).fill(Theme.accent)
                        } else {
                            RoundedRectangle(cornerRadius: 16, style: .continuous).fill(Theme.glassFill)
                        }
                    }
                )
            if m.role == .assistant { Spacer(minLength: 40) }
        }
    }

    private func send() {
        let q = input.trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { return }
        messages.append(Message(role: .user, text: q))
        input = ""
        messages.append(Message(role: .assistant, text: answer(for: q)))
    }

    /// Lightweight on-device answer derived from loaded estate data. (The backend
    /// RAG endpoints `/api/v1/ai/retrieve` + `/summarize` are a future upgrade.)
    private func answer(for q: String) -> String {
        let lower = q.lowercased()
        let e = estate
        if lower.contains("zone") {
            return "You have \(e?.zones.count ?? 0) zones: " + (e?.zones.map(\.name).joined(separator: ", ") ?? "—") + "."
        }
        if lower.contains("value") || lower.contains("worth") {
            return "Tracked object value is about €\(Int(e?.portfolioValue ?? 0))."
        }
        if lower.contains("object") || lower.contains("asset") || lower.contains("inventory") {
            return "There are \(e?.assets.count ?? 0) tracked objects in your inventory."
        }
        if lower.contains("propert") {
            return "Your estate spans \(e?.properties.count ?? 0) properties."
        }
        if lower.contains("maintenance") || lower.contains("task") {
            return "Next up: \(DemoData.maintenance.first?.title ?? "nothing scheduled"). You have \(DemoData.tasks.filter { $0.status != "done" }.count) open tasks."
        }
        return "I can help with zones, objects, estate value, properties and maintenance. Try “How many zones do I have?”"
    }
}
