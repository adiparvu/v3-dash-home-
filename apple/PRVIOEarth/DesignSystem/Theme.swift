import SwiftUI

/// PRVIO Earth "Liquid Glass" design tokens. Semantic colors are light/dark
/// adaptive on iOS/iPadOS/Mac Catalyst (driven by the active color scheme), so
/// the whole UI responds to the Appearance setting. Brand accents are constant.
enum Theme {
    // Backgrounds (native grouped surfaces)
    static let bg1 = dynamic(light: 0xF2F2F7, dark: 0x000000)   // systemGroupedBackground
    static let bg2 = dynamic(light: 0xFFFFFF, dark: 0x1C1C1E)   // secondarySystemGroupedBackground

    // Text (native label colors)
    static let text1 = dynamic(light: 0x000000, dark: 0xFFFFFF)
    static let text2 = dynamic(light: 0x6C6C70, dark: 0xAEAEB2)
    static let text3 = dynamic(light: 0xAEAEB2, dark: 0x8E8E93)

    // Brand accents (constant across light/dark)
    static let accent = Color(hex: 0x4ADE80)   // estate green
    static let cyan = Color(hex: 0x22D3EE)
    static let amber = Color(hex: 0xF59E0B)
    static let orange = Color(hex: 0xF97316)
    static let violet = Color(hex: 0x7C3AED)

    // Separators / fills (native).
    static let glassBorder = dynamicColor(light: Color.black.opacity(0.10), dark: Color.white.opacity(0.12))
    static let glassFill = dynamic(light: 0xFFFFFF, dark: 0x1C1C1E)

    static let estateGradient = LinearGradient(
        colors: [accent, cyan], startPoint: .topLeading, endPoint: .bottomTrailing
    )

    /// A color that resolves to `light`/`dark` hex by the active interface style.
    /// Falls back to the dark value on platforms without dynamic UIColor (watchOS).
    static func dynamic(light: UInt, dark: UInt) -> Color {
        #if os(iOS)
        return Color(uiColor: UIColor { trait in
            UIColor(trait.userInterfaceStyle == .light ? Color(hex: light) : Color(hex: dark))
        })
        #else
        return Color(hex: dark)
        #endif
    }

    /// As above, for pre-built `Color` values (e.g. opacities).
    static func dynamicColor(light: Color, dark: Color) -> Color {
        #if os(iOS)
        return Color(uiColor: UIColor { trait in
            UIColor(trait.userInterfaceStyle == .light ? light : dark)
        })
        #else
        return dark
        #endif
    }
}

extension Color {
    init(hex: UInt, alpha: Double = 1) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xFF) / 255,
            green: Double((hex >> 8) & 0xFF) / 255,
            blue: Double(hex & 0xFF) / 255,
            opacity: alpha
        )
    }
}
