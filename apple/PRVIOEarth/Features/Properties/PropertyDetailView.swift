import SwiftUI

struct PropertyDetailView: View {
    let property: Property

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                header
                infoCard
            }
            .padding(16)
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle(property.name)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var header: some View {
        RoundedRectangle(cornerRadius: 24, style: .continuous)
            .fill(Theme.estateGradient)
            .frame(height: 140)
            .overlay(
                VStack(alignment: .leading) {
                    Spacer()
                    Text(property.name).font(.title.bold()).foregroundStyle(Theme.bg1)
                    if !property.locationLine.isEmpty {
                        Text(property.locationLine).font(.subheadline).foregroundStyle(Theme.bg1.opacity(0.8))
                    }
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(16)
            )
    }

    private var infoCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            row("Status", property.isActive == false ? "Inactive" : "Active")
            if let area = property.totalAreaSqm { row("Area", "\(Int(area)) m²") }
            if let currency = property.currency { row("Currency", currency) }
            if let desc = property.description, !desc.isEmpty { row("Notes", desc) }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .liquidGlass()
    }

    private func row(_ label: String, _ value: String) -> some View {
        HStack {
            Text(label).font(.subheadline).foregroundStyle(Theme.text2)
            Spacer()
            Text(value).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
        }
    }
}
