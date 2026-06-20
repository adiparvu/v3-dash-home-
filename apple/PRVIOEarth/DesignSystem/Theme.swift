import SwiftUI

/// PRVIO Earth "Liquid Glass" design tokens, mirroring the web client palette.
enum Theme {
    // Backgrounds
    static let bg1 = Color(hex: 0x050A14)
    static let bg2 = Color(hex: 0x0A1120)

    // Text
    static let text1 = Color.white
    static let text2 = Color(hex: 0x9CA3AF)
    static let text3 = Color(hex: 0x6B7280)

    // Accents
    static let accent = Color(hex: 0x4ADE80)   // estate green
    static let cyan = Color(hex: 0x22D3EE)
    static let amber = Color(hex: 0xF59E0B)
    static let orange = Color(hex: 0xF97316)
    static let violet = Color(hex: 0x7C3AED)

    static let glassBorder = Color.white.opacity(0.10)
    static let glassFill = Color.white.opacity(0.05)

    static let estateGradient = LinearGradient(
        colors: [accent, cyan], startPoint: .topLeading, endPoint: .bottomTrailing
    )
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
