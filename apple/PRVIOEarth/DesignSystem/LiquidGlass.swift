import SwiftUI

/// A reusable rounded "liquid glass" surface using the native SwiftUI
/// **Liquid Glass** API (iOS/iPadOS/visionOS 26+, watchOS 26+).
struct LiquidGlass: ViewModifier {
    var cornerRadius: CGFloat = 22

    func body(content: Content) -> some View {
        content
            .glassEffect(.regular, in: .rect(cornerRadius: cornerRadius))
    }
}

extension View {
    func liquidGlass(cornerRadius: CGFloat = 22) -> some View {
        modifier(LiquidGlass(cornerRadius: cornerRadius))
    }
}

/// A small pill badge used for statuses ("Live", "Synced", "Demo"…).
struct Badge: View {
    let text: String
    var color: Color = Theme.accent

    var body: some View {
        Text(text)
            .font(.system(size: 10, weight: .medium))
            .padding(.horizontal, 8)
            .padding(.vertical, 3)
            .glassEffect(.regular.tint(color.opacity(0.15)), in: .capsule)
            .foregroundStyle(color)
    }
}
