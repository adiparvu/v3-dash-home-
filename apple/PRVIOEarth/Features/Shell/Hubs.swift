import SwiftUI

/// A tappable hub item that pushes a destination within the hub's stack.
private struct HubItem: Identifiable {
    let id = UUID()
    let icon: String
    let color: Color
    let title: String
    let subtitle: String
    let destination: AnyView
}

private struct HubTile: View {
    let icon: String
    let color: Color
    let title: String
    let subtitle: String

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            RoundedRectangle(cornerRadius: 14, style: .continuous)
                .fill(color.opacity(0.16))
                .frame(width: 44, height: 44)
                .overlay(Image(systemName: icon).font(.headline).foregroundStyle(color))
            Spacer(minLength: 0)
            Text(title).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text(subtitle).font(.caption2).foregroundStyle(Theme.text2).lineLimit(2)
        }
        .frame(maxWidth: .infinity, minHeight: 120, alignment: .leading)
        .padding(14)
        .liquidGlass(cornerRadius: 20)
    }
}

/// Shared two-column hub grid with its own navigation stack.
private struct HubScreen: View {
    let title: String
    let items: [HubItem]

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    var body: some View {
        NavigationStack {
            ScrollView {
                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(items) { item in
                        NavigationLink {
                            item.destination
                        } label: {
                            HubTile(icon: item.icon, color: item.color, title: item.title, subtitle: item.subtitle)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(16)
            }
            .background(Theme.bg1.ignoresSafeArea())
            .navigationTitle(title)
        }
    }
}

struct EstateHubView: View {
    var body: some View {
        HubScreen(title: "Estate", items: [
            HubItem(icon: "building.2.fill", color: Theme.accent, title: "Properties", subtitle: "Your properties & value", destination: AnyView(PropertiesView())),
            HubItem(icon: "map.fill", color: Theme.cyan, title: "Zones", subtitle: "Spatial areas", destination: AnyView(ZonesView())),
            HubItem(icon: "shippingbox.fill", color: Theme.accent, title: "Inventory", subtitle: "Assets & objects", destination: AnyView(InventoryView())),
            HubItem(icon: "doc.fill", color: Theme.violet, title: "Documents", subtitle: "Deeds & warranties", destination: AnyView(DocumentsView())),
            HubItem(icon: "person.2.fill", color: Theme.amber, title: "Contractors", subtitle: "People & companies", destination: AnyView(ContractorsView())),
            HubItem(icon: "magnifyingglass", color: Theme.cyan, title: "Search", subtitle: "Find across the estate", destination: AnyView(SearchView())),
        ])
    }
}

struct MonitorHubView: View {
    var body: some View {
        HubScreen(title: "Monitor", items: [
            HubItem(icon: "sensor.fill", color: Theme.cyan, title: "Sensors", subtitle: "Live telemetry", destination: AnyView(SensorsView())),
            HubItem(icon: "homekit", color: Theme.accent, title: "Devices", subtitle: "IoT & gateways", destination: AnyView(DevicesView())),
            HubItem(icon: "house.fill", color: Theme.violet, title: "Apple Home", subtitle: "HomeKit accessories", destination: AnyView(HomeKitView())),
            HubItem(icon: "bolt.horizontal.fill", color: Theme.amber, title: "Automations", subtitle: "Schedules & routines", destination: AnyView(AutomationsView())),
            HubItem(icon: "wrench.and.screwdriver.fill", color: Theme.orange, title: "Maintenance", subtitle: "Scheduled & overdue", destination: AnyView(MaintenanceView())),
            HubItem(icon: "bell.fill", color: Theme.orange, title: "Notifications", subtitle: "Alerts & activity", destination: AnyView(NotificationsView())),
        ])
    }
}
