import SwiftUI

/// Routes between the auth gate and the main tab interface based on `AuthStore.phase`.
struct RootView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(\.scenePhase) private var scenePhase

    var body: some View {
        Group {
            switch auth.phase {
            case .signedOut:
                SignInView()
            case .locked:
                LockView()
            case .unlocked, .demo:
                MainTabView()
            }
        }
        .animation(.easeInOut, value: auth.phase)
        .preferredColorScheme(.dark)
        .tint(Theme.accent)
        .onOpenURL { auth.handleCallbackURL($0) } // OAuth / magic-link callback
        .onChange(of: scenePhase) { _, newPhase in auth.handleScenePhase(newPhase) } // auto-lock
    }
}

private enum AppSection: String, CaseIterable, Identifiable {
    case overview = "Overview"
    case properties = "Properties"
    case tasks = "Tasks"
    case more = "More"
    case profile = "Profile"

    var id: String { rawValue }
    var symbol: String {
        switch self {
        case .overview: return "house.fill"
        case .properties: return "building.2.fill"
        case .tasks: return "checklist"
        case .more: return "square.grid.2x2.fill"
        case .profile: return "person.crop.circle.fill"
        }
    }

    @ViewBuilder var destination: some View {
        switch self {
        case .overview: OverviewView()
        case .properties: PropertiesView()
        case .tasks: NavigationStack { TasksView() }
        case .more: MoreView()
        case .profile: ProfileView()
        }
    }
}

/// Tab-based shell shared across iPhone / iPad / Mac (Catalyst) / Vision Pro.
private struct MainTabView: View {
    @State private var selection: AppSection = .overview

    var body: some View {
        TabView(selection: $selection) {
            ForEach(AppSection.allCases) { section in
                section.destination
                    .tabItem { Label(section.rawValue, systemImage: section.symbol) }
                    .tag(section)
            }
        }
    }
}
