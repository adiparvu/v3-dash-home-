import Foundation
import Observation
import CoreLocation
#if canImport(WeatherKit)
import WeatherKit
#endif

/// Fetches estate weather from Apple **WeatherKit** (current conditions + today's
/// high/low). Falls back to demo data when WeatherKit is unavailable (simulator,
/// missing entitlement) so the UI stays browsable. Apple requires the attribution
/// returned here to be displayed wherever the data is shown.
@MainActor
@Observable
final class WeatherStore {
    struct Conditions: Sendable {
        var temperature: String
        var symbolName: String
        var condition: String
        var high: String?
        var low: String?

        static let demo = Conditions(
            temperature: "18°", symbolName: "cloud.sun.fill",
            condition: "Partly Cloudy", high: "22°", low: "11°"
        )
    }

    private(set) var conditions: Conditions = .demo
    private(set) var source: String = "Demo"
    /// Apple Weather attribution (required to display alongside the data).
    private(set) var attributionLogoURL: URL?
    private(set) var attributionLegalURL: URL?
    var errorMessage: String?

    private let coordinate: CLLocationCoordinate2D

    /// Defaults to the demo estate (Brașov). In production pass the property's
    /// coordinates.
    init(latitude: Double = 45.657, longitude: Double = 25.601) {
        coordinate = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
    }

    func load() async {
        #if canImport(WeatherKit)
        do {
            let service = WeatherService.shared
            let location = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
            let weather = try await service.weather(for: location)

            let formatter = MeasurementFormatter()
            formatter.numberFormatter.maximumFractionDigits = 0
            let current = weather.currentWeather
            let today = weather.dailyForecast.first

            conditions = Conditions(
                temperature: formatter.string(from: current.temperature),
                symbolName: current.symbolName,
                condition: current.condition.description,
                high: today.map { formatter.string(from: $0.highTemperature) },
                low: today.map { formatter.string(from: $0.lowTemperature) }
            )

            let attribution = try await service.attribution
            attributionLogoURL = attribution.combinedMarkLightURL
            attributionLegalURL = attribution.legalPageURL
            source = "WeatherKit"
        } catch {
            errorMessage = error.localizedDescription // keep demo conditions
        }
        #endif
    }
}
