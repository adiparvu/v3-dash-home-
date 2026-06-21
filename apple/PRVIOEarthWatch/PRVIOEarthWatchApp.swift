import SwiftUI

@main
struct PRVIOEarthWatchApp: App {
    var body: some Scene {
        WindowGroup {
            WatchRootView()
                .tint(Theme.accent)
                .task { WatchBridge.shared.activate() } // receive snapshots from iPhone
        }
    }
}
