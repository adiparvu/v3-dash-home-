import SwiftUI

/// A reusable rounded "liquid glass" surface — translucent material with a hairline
/// border, matching the web client's `.liquid-glass` cards.
struct LiquidGlass: ViewModifier {
    var cornerRadius: CGFloat = 22

    func body(content: Content) -> some View {
        content
            .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .strokeBorder(Theme.glassBorder, lineWidth: 0.5)
            )
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius, style: .continuous)
                    .fill(Theme.glassFill)
            )
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
            .background(color.opacity(0.15), in: Capsule())
            .foregroundStyle(color)
    }
}
