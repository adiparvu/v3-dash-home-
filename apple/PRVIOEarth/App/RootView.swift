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
    }
}

private struct MainTabView: View {
    var body: some View {
        TabView {
            OverviewView()
                .tabItem { Label("Overview", systemImage: "house.fill") }
            PropertiesView()
                .tabItem { Label("Properties", systemImage: "building.2.fill") }
            ProfileView()
                .tabItem { Label("Profile", systemImage: "person.crop.circle.fill") }
        }
    }
}
