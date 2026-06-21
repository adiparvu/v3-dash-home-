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

/// A native inset-grouped list row (Settings-app style: white glyph on a tinted
/// rounded square, title + subtitle, system chevron via NavigationLink).
private struct HubRow: View {
    let item: HubItem

    var body: some View {
        NavigationLink {
            item.destination
        } label: {
            Label {
                VStack(alignment: .leading, spacing: 2) {
                    Text(item.title).foregroundStyle(Theme.text1)
                    Text(item.subtitle).font(.caption).foregroundStyle(Theme.text2)
                }
            } icon: {
                Image(systemName: item.icon)
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundStyle(.white)
                    .frame(width: 29, height: 29)
                    .background(item.color, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
            }
        }
    }
}

/// Shared native inset-grouped hub with its own navigation stack.
private struct HubScreen: View {
    let title: String
    let items: [HubItem]

    var body: some View {
        NavigationStack {
            List {
                Section {
                    ForEach(items) { HubRow(item: $0) }
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle(title)
        }
    }
}

struct EstateHubView: View {
    var body: some View {
        HubScreen(title: "Estate", items: [
            HubItem(icon: "building.2.fill", color: Theme.accent, title: "Properties", subtitle: "Your properties & value", destination: AnyView(PropertiesView())),
            HubItem(icon: "map.fill", color: Theme.cyan, title: "Zones", subtitle: "Spatial areas", destination: AnyView(ZonesView())),
            HubItem(icon: "shippingbox.fill", color: Theme.amber, title: "Inventory", subtitle: "Assets & objects", destination: AnyView(InventoryView())),
            HubItem(icon: "doc.fill", color: Theme.violet, title: "Documents", subtitle: "Deeds & warranties", destination: AnyView(DocumentsView())),
            HubItem(icon: "person.2.fill", color: Theme.orange, title: "Contractors", subtitle: "People & companies", destination: AnyView(ContractorsView())),
            HubItem(icon: "magnifyingglass", color: Theme.text3, title: "Search", subtitle: "Find across the estate", destination: AnyView(SearchView())),
        ])
    }
}

struct MonitorHubView: View {
    var body: some View {
        HubScreen(title: "Twin", items: [
            HubItem(icon: "sensor.fill", color: Theme.cyan, title: "Sensors", subtitle: "Live telemetry", destination: AnyView(SensorsView())),
            HubItem(icon: "homekit", color: Theme.accent, title: "Devices", subtitle: "IoT & gateways", destination: AnyView(DevicesView())),
            HubItem(icon: "house.fill", color: Theme.violet, title: "Apple Home", subtitle: "HomeKit accessories", destination: AnyView(HomeKitView())),
            HubItem(icon: "bolt.horizontal.fill", color: Theme.amber, title: "Automations", subtitle: "Schedules & routines", destination: AnyView(AutomationsView())),
            HubItem(icon: "wrench.and.screwdriver.fill", color: Theme.orange, title: "Maintenance", subtitle: "Scheduled & overdue", destination: AnyView(MaintenanceView())),
            HubItem(icon: "bell.fill", color: Theme.orange, title: "Notifications", subtitle: "Alerts & activity", destination: AnyView(NotificationsView())),
        ])
    }
}
