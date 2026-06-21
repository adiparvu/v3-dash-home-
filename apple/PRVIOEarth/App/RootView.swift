import SwiftUI

/// Routes between the auth gate and the main tab interface based on `AuthStore.phase`.
struct RootView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
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
        .preferredColorScheme(settings.colorScheme)
        .tint(settings.accentColor)
        .environment(\.locale, settings.locale)
        .onOpenURL { auth.handleCallbackURL($0) } // OAuth / magic-link callback
        .onChange(of: scenePhase) { _, newPhase in auth.handleScenePhase(newPhase) } // auto-lock
    }
}

private enum AppSection: String, CaseIterable, Identifiable {
    case home = "Home"
    case estate = "Estate"
    case tasks = "Tasks"
    case monitor = "Monitor"
    case chat = "Chat"

    var id: String { rawValue }
    var symbol: String {
        switch self {
        case .home: return "house.fill"
        case .estate: return "building.2.fill"
        case .tasks: return "checklist"
        case .monitor: return "dot.radiowaves.left.and.right"
        case .chat: return "bubble.left.and.bubble.right.fill"
        }
    }

    @ViewBuilder var destination: some View {
        switch self {
        case .home: OverviewView()
        case .estate: EstateHubView()
        case .tasks: NavigationStack { TasksView() }
        case .monitor: MonitorHubView()
        case .chat: ChatListView()
        }
    }
}

/// Tab-based shell shared across iPhone / iPad / Mac (Catalyst) / Vision Pro.
private struct MainTabView: View {
    @State private var selection: AppSection = .home

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
