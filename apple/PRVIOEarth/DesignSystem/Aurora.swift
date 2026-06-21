import SwiftUI

/// The app's screen canvas — the native system grouped background, so every
/// screen reads as a first-party Apple surface. Adapts to light/dark.
struct ScreenBackground: View {
    var body: some View {
        Theme.bg1.ignoresSafeArea()
    }
}
