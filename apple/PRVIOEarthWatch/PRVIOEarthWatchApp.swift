import SwiftUI

@main
struct PRVIOEarthWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchRootView()
                .tint(Theme.accent)
        }
    }
}
