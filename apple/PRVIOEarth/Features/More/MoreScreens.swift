import SwiftUI

// MARK: - Reusable building blocks

/// A reusable "liquid glass" list row: leading icon tile, title, optional
/// subtitle, optional trailing text. Mirrors the web client's list rows.
struct GlassRow: View {
    let icon: String
    var iconColor: Color = Theme.accent
    let title: String
    var subtitle: String? = nil
    var trailing: String? = nil
    var trailingColor: Color = Theme.text3
    var showsChevron = false

    var body: some View {
        HStack(spacing: 14) {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(iconColor.opacity(0.15))
                .frame(width: 44, height: 44)
                .overlay(Image(systemName: icon).foregroundStyle(iconColor))
            VStack(alignment: .leading, spacing: 3) {
                Text(title).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                if let subtitle, !subtitle.isEmpty {
                    Text(subtitle).font(.caption).foregroundStyle(Theme.text2).lineLimit(2)
                }
            }
            Spacer()
            if let trailing {
                Text(trailing).font(.caption.weight(.medium)).foregroundStyle(trailingColor)
            }
            if showsChevron {
                Image(systemName: "chevron.right").font(.footnote).foregroundStyle(Theme.text3)
            }
        }
        .padding(14)
        .liquidGlass()
    }
}

/// Standard scrolling list page on the estate background with an optional
/// Synced/Demo badge in the toolbar.
struct ListPage<Content: View>: View {
    let title: String
    var source: EstateStore.Source? = nil
    @ViewBuilder var content: Content

    var body: some View {
        ScrollView {
            VStack(spacing: 12) { content }
                .padding(16)
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle(title)
        .toolbar {
            if let source {
                ToolbarItem(placement: .topBarTrailing) {
                    Badge(text: source == .synced ? "Synced" : "Demo",
                          color: source == .synced ? Theme.accent : Theme.amber)
                }
            }
        }
    }
}

// MARK: - Collections store (live notifications + demo fallback)

@MainActor
@Observable
final class CollectionsStore {
    private(set) var notifications: [NotificationItem] = DemoData.notifications
    private(set) var notificationsSource: EstateStore.Source = .demo
    private(set) var devices: [Device] = DemoData.devices
    private(set) var devicesSource: EstateStore.Source = .demo
    private(set) var schedules: [Schedule] = DemoData.schedules
    private(set) var schedulesSource: EstateStore.Source = .demo
    private(set) var sensors: [SensorReading] = DemoData.sensors
    private(set) var sensorsSource: EstateStore.Source = .demo
    private(set) var tasks: [TaskItem] = DemoData.tasks
    private(set) var tasksSource: EstateStore.Source = .demo
    private(set) var maintenance: [MaintenanceItem] = DemoData.maintenance
    private(set) var maintenanceSource: EstateStore.Source = .demo
    private(set) var documents: [DocumentItem] = DemoData.documents
    private(set) var documentsSource: EstateStore.Source = .demo
    private(set) var contractors: [Contractor] = DemoData.contractors
    private(set) var contractorsSource: EstateStore.Source = .demo

    private let api: APIClient?
    init(api: APIClient?) { self.api = api }

    func loadNotifications() async {
        guard let api else { notificationsSource = .demo; return }
        do {
            let items = try await api.get("/notifications", as: NotificationsPayload.self).notifications
            notifications = items.isEmpty ? DemoData.notifications : items
            notificationsSource = items.isEmpty ? .demo : .synced
        } catch {
            notificationsSource = .demo
        }
    }

    func loadDevices() async {
        guard let api else { devicesSource = .demo; return }
        do {
            let items = try await api.get("/twin/devices", as: DevicesPayload.self).devices
            devices = items.isEmpty ? DemoData.devices : items
            devicesSource = items.isEmpty ? .demo : .synced
        } catch {
            devicesSource = .demo
        }
    }

    func loadSchedules() async {
        guard let api else { schedulesSource = .demo; return }
        do {
            let items = try await api.get("/automations/schedules", as: SchedulesPayload.self).schedules
            schedules = items.isEmpty ? DemoData.schedules : items
            schedulesSource = items.isEmpty ? .demo : .synced
        } catch {
            schedulesSource = .demo
        }
    }

    func loadSensors(zoneId: String?) async {
        guard let api, let zoneId else { sensorsSource = .demo; return }
        do {
            let items = try await api.get("/twin/sensors?zoneId=\(zoneId)", as: SensorsPayload.self).sensors
            sensors = items.isEmpty ? DemoData.sensors : items
            sensorsSource = items.isEmpty ? .demo : .synced
        } catch {
            sensorsSource = .demo
        }
    }

    func loadTasks() async {
        guard let api else { tasksSource = .demo; return }
        do {
            let items = try await api.get("/tasks", as: TasksPayload.self).tasks
            tasks = items.isEmpty ? DemoData.tasks : items
            tasksSource = items.isEmpty ? .demo : .synced
        } catch {
            tasksSource = .demo
        }
    }

    func loadMaintenance() async {
        guard let api else { maintenanceSource = .demo; return }
        do {
            let items = try await api.get("/maintenance", as: MaintenancePayload.self).maintenance
            maintenance = items.isEmpty ? DemoData.maintenance : items
            maintenanceSource = items.isEmpty ? .demo : .synced
        } catch {
            maintenanceSource = .demo
        }
    }

    func loadDocuments() async {
        guard let api else { documentsSource = .demo; return }
        do {
            let items = try await api.get("/documents", as: DocumentsPayload.self).documents
            documents = items.isEmpty ? DemoData.documents : items
            documentsSource = items.isEmpty ? .demo : .synced
        } catch {
            documentsSource = .demo
        }
    }

    func loadContractors() async {
        guard let api else { contractorsSource = .demo; return }
        do {
            let items = try await api.get("/contractors", as: ContractorsPayload.self).contractors
            contractors = items.isEmpty ? DemoData.contractors : items
            contractorsSource = items.isEmpty ? .demo : .synced
        } catch {
            contractorsSource = .demo
        }
    }
}

// MARK: - More hub

struct MoreView: View {
    private struct Entry: Identifiable {
        let id = UUID()
        let icon: String
        let color: Color
        let title: String
        let subtitle: String
        let destination: AnyView
    }

    private var entries: [Entry] {
        [
            Entry(icon: "map.fill", color: Theme.cyan, title: "Zones", subtitle: "Spatial areas of the estate", destination: AnyView(ZonesView())),
            Entry(icon: "shippingbox.fill", color: Theme.accent, title: "Inventory", subtitle: "Assets & objects", destination: AnyView(InventoryView())),
            Entry(icon: "wrench.and.screwdriver.fill", color: Theme.amber, title: "Maintenance", subtitle: "Scheduled & overdue work", destination: AnyView(MaintenanceView())),
            Entry(icon: "bell.fill", color: Theme.orange, title: "Notifications", subtitle: "Alerts & activity", destination: AnyView(NotificationsView())),
            Entry(icon: "bolt.horizontal.fill", color: Theme.violet, title: "Automations", subtitle: "Schedules & routines", destination: AnyView(AutomationsView())),
            Entry(icon: "sensor.fill", color: Theme.cyan, title: "Sensors", subtitle: "Live telemetry", destination: AnyView(SensorsView())),
            Entry(icon: "homekit", color: Theme.accent, title: "Devices", subtitle: "IoT & gateways", destination: AnyView(DevicesView())),
            Entry(icon: "house.fill", color: Theme.violet, title: "Apple Home", subtitle: "HomeKit accessories", destination: AnyView(HomeKitView())),
            Entry(icon: "doc.fill", color: Theme.text2, title: "Documents", subtitle: "Deeds, warranties, policies", destination: AnyView(DocumentsView())),
            Entry(icon: "person.2.fill", color: Theme.amber, title: "Contractors", subtitle: "People & companies", destination: AnyView(ContractorsView())),
            Entry(icon: "bubble.left.and.bubble.right.fill", color: Theme.accent, title: "Chat", subtitle: "Household & collaborators", destination: AnyView(ChatListView())),
            Entry(icon: "magnifyingglass", color: Theme.cyan, title: "Search", subtitle: "Find across the estate", destination: AnyView(SearchView())),
            Entry(icon: "sparkles", color: Theme.violet, title: "AI Assistant", subtitle: "Ask about your estate", destination: AnyView(AIAssistantView())),
            Entry(icon: "gearshape.fill", color: Theme.text2, title: "Settings", subtitle: "Account, security, appearance, language", destination: AnyView(SettingsHubView())),
        ]
    }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(entries) { entry in
                        NavigationLink {
                            entry.destination
                        } label: {
                            GlassRow(icon: entry.icon, iconColor: entry.color,
                                     title: entry.title, subtitle: entry.subtitle,
                                     showsChevron: true)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(16)
            }
            .background(Theme.bg1.ignoresSafeArea())
            .navigationTitle("More")
        }
    }
}

// MARK: - Estate-data screens (live via EstateStore)

struct ZonesView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
    @State private var estate: EstateStore?

    var body: some View {
        ListPage(title: "Zones", source: estate?.source) {
            ForEach(estate?.zones ?? []) { zone in
                GlassRow(icon: "leaf.fill", iconColor: Theme.cyan,
                         title: "\(zone.icon ?? "📍") \(zone.name)",
                         subtitle: zone.description,
                         trailing: zone.areaSqm.map { settings.area($0) })
            }
        }
        .task { await ensureLoaded() }
    }

    private func ensureLoaded() async {
        if estate == nil { estate = EstateStore(api: auth.api) }
        await estate?.load()
    }
}

struct InventoryView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
    @State private var estate: EstateStore?

    var body: some View {
        ListPage(title: "Inventory", source: estate?.source) {
            ForEach(estate?.assets ?? []) { asset in
                GlassRow(icon: "shippingbox.fill", iconColor: Theme.accent,
                         title: asset.name,
                         subtitle: [asset.manufacturer, asset.model].compactMap { $0 }.joined(separator: " · "),
                         trailing: asset.currentValue.map { settings.money($0) })
            }
        }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }
}

// MARK: - Notifications (live)

struct NotificationsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Notifications", source: store?.notificationsSource) {
            ForEach(store?.notifications ?? []) { n in
                GlassRow(icon: icon(for: n.type), iconColor: color(for: n.type),
                         title: n.title, subtitle: n.body,
                         trailing: (n.isRead ?? false) ? nil : "•",
                         trailingColor: Theme.accent)
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadNotifications()
        }
    }

    private func icon(for type: String?) -> String {
        switch type {
        case "warning": return "exclamationmark.triangle.fill"
        case "error": return "xmark.octagon.fill"
        default: return "bell.fill"
        }
    }
    private func color(for type: String?) -> Color {
        switch type {
        case "warning": return Theme.amber
        case "error": return Theme.orange
        default: return Theme.accent
        }
    }
}

// MARK: - Operations screens (live via CollectionsStore, demo fallback)

struct TasksView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Tasks", source: store?.tasksSource) {
            ForEach(store?.tasks ?? []) { task in
                GlassRow(icon: symbol(for: task.status),
                         iconColor: color(for: task.priority),
                         title: task.title,
                         subtitle: task.due.map { "Due \($0)" },
                         trailing: task.status.replacingOccurrences(of: "_", with: " "))
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadTasks()
        }
    }
    private func symbol(for status: String) -> String {
        (status == "done" || status == "completed") ? "checkmark.circle.fill" : "circle"
    }
    private func color(for priority: String?) -> Color {
        switch priority {
        case "urgent", "high": return Theme.orange
        case "medium", "normal": return Theme.amber
        default: return Theme.accent
        }
    }
}

struct MaintenanceView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Maintenance", source: store?.maintenanceSource) {
            ForEach(store?.maintenance ?? []) { m in
                GlassRow(icon: "wrench.and.screwdriver.fill",
                         iconColor: m.status == "overdue" ? Theme.orange : Theme.amber,
                         title: m.title, subtitle: m.asset,
                         trailing: m.due, trailingColor: m.status == "overdue" ? Theme.orange : Theme.text3)
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadMaintenance()
        }
    }
}

struct DocumentsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?

    var body: some View {
        ListPage(title: "Documents", source: store?.documentsSource) {
            ForEach(store?.documents ?? []) { doc in
                GlassRow(icon: "doc.fill", iconColor: Theme.cyan,
                         title: doc.name,
                         subtitle: [doc.kind, doc.updatedAt].compactMap { $0 }.joined(separator: " · "),
                         trailing: doc.size)
            }
        }
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadDocuments()
        }
    }
}

struct ContractorsView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: CollectionsStore?
    @State private var callTarget: CallContact?

    var body: some View {
        ListPage(title: "Contractors", source: store?.contractorsSource) {
            ForEach(store?.contractors ?? []) { c in
                let row = GlassRow(icon: "person.crop.circle.fill",
                                   iconColor: (c.isPreferred ?? false) ? Theme.accent : Theme.text2,
                                   title: c.name,
                                   subtitle: [c.company, c.phone].compactMap { $0 }.joined(separator: " · "),
                                   trailing: c.phone != nil ? "Call" : c.rating.map { String(format: "★ %.1f", $0) },
                                   trailingColor: c.phone != nil ? Theme.accent : Theme.amber)
                if let phone = c.phone {
                    Button { callTarget = CallContact(name: c.name, phone: phone) } label: { row }
                        .buttonStyle(.plain)
                } else {
                    row
                }
            }
        }
        .callSheet($callTarget)
        .task {
            if store == nil { store = CollectionsStore(api: auth.api) }
            await store?.loadContractors()
        }
    }
}

// MARK: - Apple Home (HomeKit, live with demo fallback)

struct HomeKitView: View {
    @State private var store = HomeKitStore()

    var body: some View {
        ListPage(title: "Apple Home", source: store.source) {
            ForEach(store.accessories) { acc in
                GlassRow(icon: symbol(for: acc.category),
                         iconColor: acc.isReachable ? color(for: acc) : Theme.text3,
                         title: acc.name,
                         subtitle: [acc.room, acc.category].compactMap { $0 }.joined(separator: " · "),
                         trailing: trailing(for: acc),
                         trailingColor: (acc.isOn ?? false) ? Theme.accent : Theme.text3)
                    .opacity(acc.isReachable ? 1 : 0.5)
                    .contentShape(Rectangle())
                    .onTapGesture { if acc.isOn != nil { store.toggle(acc) } }
            }
        }
        .task { store.start() }
    }

    private func trailing(for acc: HomeAccessory) -> String? {
        if let on = acc.isOn { return on ? "On" : "Off" }
        return acc.isReachable ? nil : "Offline"
    }
    private func color(for acc: HomeAccessory) -> Color {
        if let on = acc.isOn { return on ? Theme.amber : Theme.text2 }
        return Theme.cyan
    }
    private func symbol(for category: String) -> String {
        switch category {
        case "Lightbulb": return "lightbulb.fill"
        case "Outlet": return "powerplug.fill"
        case "Switch": return "switch.2"
        case "Thermostat": return "thermometer.medium"
        case "Sensor": return "sensor.fill"
        case "Door": return "door.left.hand.closed"
        case "Garage": return "door.garage.closed"
        case "Window": return "window.vertical.closed"
        case "Fan": return "fan.fill"
        case "Camera": return "video.fill"
        default: return "homekit"
        }
    }
}
