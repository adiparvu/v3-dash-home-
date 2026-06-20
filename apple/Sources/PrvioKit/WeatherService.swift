import Foundation

/// Example domain service built on `APIClient` — fetches estate weather for the
/// dashboard and the Weather widget. Returns a deterministic fallback on failure
/// so widget timelines always have content (matching the web `useWeather`).
public struct WeatherService: Sendable {
    private let client: APIClient

    public init(client: APIClient) {
        self.client = client
    }

    public static let fallback = Weather(
        tempC: 22, condition: "Clear", icon: "☀️", high: 26, low: 14, source: "fallback"
    )

    public func current() async -> Weather {
        do {
            return try await client.get("weather", as: Weather.self)
        } catch {
            return Self.fallback
        }
    }
}
