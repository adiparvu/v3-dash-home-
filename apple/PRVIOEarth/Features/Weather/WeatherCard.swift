import SwiftUI

/// Estate weather card (WeatherKit). Includes the required Apple Weather
/// attribution (logo + legal link) when live data is shown.
struct WeatherCard: View {
    @State private var store = WeatherStore()

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Label("Weather", systemImage: "cloud.sun.fill")
                    .font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                Spacer()
                Badge(text: store.source, color: store.source == "WeatherKit" ? Theme.accent : Theme.amber)
            }

            HStack(spacing: 16) {
                Image(systemName: store.conditions.symbolName)
                    .font(.system(size: 40))
                    .symbolRenderingMode(.multicolor)
                    .frame(width: 56)
                VStack(alignment: .leading, spacing: 2) {
                    Text(store.conditions.temperature)
                        .font(.system(size: 34, weight: .bold)).foregroundStyle(Theme.text1)
                    Text(store.conditions.condition)
                        .font(.subheadline).foregroundStyle(Theme.text2)
                    if let high = store.conditions.high, let low = store.conditions.low {
                        Text("H:\(high)  L:\(low)").font(.caption).foregroundStyle(Theme.text3)
                    }
                }
                Spacer()
            }

            attribution
        }
        .padding(16)
        .liquidGlass()
        .task { await store.load() }
    }

    // Apple requires the Weather trademark + a link to the legal attribution page.
    @ViewBuilder private var attribution: some View {
        if let legal = store.attributionLegalURL {
            HStack(spacing: 6) {
                if let logo = store.attributionLogoURL {
                    AsyncImage(url: logo) { image in
                        image.resizable().scaledToFit()
                    } placeholder: {
                        Text(" Weather").font(.caption2)
                    }
                    .frame(height: 12)
                }
                Spacer()
                Link("Other data sources", destination: legal)
                    .font(.caption2).foregroundStyle(Theme.text3)
            }
        }
    }
}
