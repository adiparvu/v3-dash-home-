import SwiftUI
import PrvioKit

// Reference SwiftUI entry point for the PRVIO Earth iOS/macOS app. Add this file
// (and ContentView) to an Xcode App target that depends on the PrvioKit package.
// It is intentionally minimal — the full app reuses PrvioKit's API client and
// models against the same versioned backend the web client uses.

@main
struct PrvioApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

/// Configured client — point baseURL at the deployment and inject the session
/// token from the Keychain (Secure Enclave–backed) per the security spec.
enum Backend {
    static let client = APIClient(
        baseURL: URL(string: "https://app.prvio.earth")!,
        tokenProvider: { /* read Supabase JWT from Keychain */ nil }
    )
}

struct ContentView: View {
    @State private var weather: Weather = WeatherService.fallback

    var body: some View {
        VStack(spacing: 12) {
            Text(weather.icon).font(.system(size: 48))
            Text("\(Int(weather.tempC))°")
                .font(.system(size: 40, weight: .bold, design: .rounded))
            Text("\(weather.condition) · H:\(Int(weather.high))° L:\(Int(weather.low))°")
                .foregroundStyle(.secondary)
            Text(weather.source == "live" ? "Live" : "Cached")
                .font(.caption2).padding(.horizontal, 8).padding(.vertical, 2)
                .background(.green.opacity(0.15), in: Capsule())
        }
        .task {
            weather = await WeatherService(client: Backend.client).current()
        }
    }
}
