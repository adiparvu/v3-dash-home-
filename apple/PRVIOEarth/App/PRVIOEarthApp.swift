import SwiftUI

@main
struct PRVIOEarthApp: App {
    @State private var auth = AuthStore()
    @State private var settings = AppSettings()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(auth)
                .environment(settings)
                .task { WatchBridge.shared.activate() } // pair with the Apple Watch
        }
    }
}
