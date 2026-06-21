import SwiftUI

/// The "Aurora" canvas — a deep, layered backdrop with soft teal/violet/green
/// glows that drift slowly, giving the Liquid Glass surfaces real depth. Adapts
/// to light/dark. Used as the app-wide screen background.
struct AuroraBackground: View {
    @Environment(\.colorScheme) private var scheme
    @State private var drift = false

    var body: some View {
        ZStack {
            base
            blob(Theme.accent, 380).offset(x: drift ? -130 : -90, y: -300)
            blob(Theme.cyan, 340).offset(x: drift ? 150 : 110, y: drift ? -150 : -200)
            blob(Theme.violet, 420).offset(x: drift ? -70 : -30, y: 320)
            blob(Theme.cyan, 300).offset(x: 150, y: drift ? 380 : 330)
        }
        .ignoresSafeArea()
        .onAppear {
            withAnimation(.easeInOut(duration: 16).repeatForever(autoreverses: true)) { drift = true }
        }
    }

    private var base: some View {
        LinearGradient(
            colors: scheme == .light
                ? [Color(hex: 0xEFF3FA), Color(hex: 0xE5EBF5)]
                : [Color(hex: 0x040810), Color(hex: 0x081428)],
            startPoint: .top, endPoint: .bottom
        )
    }

    private func blob(_ color: Color, _ size: CGFloat) -> some View {
        Circle()
            .fill(color.opacity(scheme == .light ? 0.16 : 0.28))
            .frame(width: size, height: size)
            .blur(radius: 100)
    }
}
