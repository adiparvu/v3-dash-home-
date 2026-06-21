import SwiftUI

/// Routes between the auth gate and the main tab interface based on `AuthStore.phase`.
struct RootView: View {
    @Environment(AuthStore.self) private var auth

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
    }
}

private enum AppSection: String, CaseIterable, Identifiable {
    case overview = "Overview"
    case properties = "Properties"
    case profile = "Profile"

    var id: String { rawValue }
    var symbol: String {
        switch self {
        case .overview: return "house.fill"
        case .properties: return "building.2.fill"
        case .profile: return "person.crop.circle.fill"
        }
    }

    @ViewBuilder var destination: some View {
        switch self {
        case .overview: OverviewView()
        case .properties: PropertiesView()
        case .profile: ProfileView()
        }
    }
}

/// Adapts to the platform: a tab bar on compact widths (iPhone) and a
/// sidebar split view on regular widths (iPad / Mac Catalyst / Vision Pro).
private struct MainTabView: View {
    @Environment(\.horizontalSizeClass) private var sizeClass
    @State private var selection: AppSection = .overview

    var body: some View {
        if sizeClass == .compact {
            TabView(selection: $selection) {
                ForEach(AppSection.allCases) { section in
                    section.destination
                        .tabItem { Label(section.rawValue, systemImage: section.symbol) }
                        .tag(section)
                }
            }
        } else {
            NavigationSplitView {
                List(AppSection.allCases, selection: $selection) { section in
                    NavigationLink(value: section) {
                        Label(section.rawValue, systemImage: section.symbol)
                    }
                }
                .navigationTitle("PRVIO Earth")
            } detail: {
                selection.destination
            }
        }
    }
}
