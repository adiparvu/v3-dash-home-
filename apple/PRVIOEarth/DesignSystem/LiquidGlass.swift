import SwiftUI

/// A reusable rounded card surface using native grouped-background colors, for a
/// clean, minimal first-party Apple look (replaces the earlier glass treatment).
struct LiquidGlass: ViewModifier {
    var cornerRadius: CGFloat = 18

    func body(content: Content) -> some View {
        content
            .background(Theme.bg2, in: RoundedRectangle(cornerRadius: cornerRadius, style: .continuous))
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
            .font(.system(size: 11, weight: .semibold))
            .padding(.horizontal, 9)
            .padding(.vertical, 3)
            .background(color.opacity(0.15), in: Capsule())
            .foregroundStyle(color)
    }
}
