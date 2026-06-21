import SwiftUI

@main
struct PRVIOEarthApp: App {
    @State private var auth = AuthStore()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(auth)
                .task { WatchBridge.shared.activate() } // pair with the Apple Watch
        }
    }
}
