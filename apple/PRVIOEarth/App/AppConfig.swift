import Foundation

/// Runtime configuration, read from the app's `Info.plist` (populated from
/// `Config.xcconfig`). When values are missing or left at their placeholders the
/// app runs in **demo mode** with seeded data.
struct AppConfig {
    let supabaseURL: URL?
    let supabaseAnonKey: String?
    let apiBaseURL: URL?

    /// True when we have enough configuration to talk to the live backend.
    var isConfigured: Bool { supabaseURL != nil && supabaseAnonKey != nil }

    static let current = AppConfig()

    private init() {
        let info = Bundle.main.infoDictionary ?? [:]
        func value(_ key: String) -> String? {
            guard let raw = info[key] as? String else { return nil }
            let trimmed = raw.trimmingCharacters(in: .whitespacesAndNewlines)
            guard !trimmed.isEmpty, !trimmed.contains("your-") else { return nil }
            return trimmed
        }
        supabaseURL = value("SUPABASE_URL").flatMap(URL.init(string:))
        supabaseAnonKey = value("SUPABASE_ANON_KEY")
        // Fall back to the Supabase URL's origin if no explicit backend is set.
        apiBaseURL = value("API_BASE_URL").flatMap(URL.init(string:)) ?? supabaseURL
    }
}
