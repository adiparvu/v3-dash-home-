import SwiftUI

struct PropertyDetailView: View {
    let property: Property

    @State private var jobStarted = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                header
                infoCard
                maintenanceCard
            }
            .padding(16)
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle(property.name)
        .navigationBarTitleDisplayMode(.inline)
    }

    private var maintenanceCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Maintenance").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text("Start a job to track it live on the Lock Screen and Dynamic Island.")
                .font(.caption).foregroundStyle(Theme.text2)
            Button {
                jobStarted = LiveActivityManager.shared.startMaintenance(
                    job: "Irrigation service",
                    property: property.name,
                    technician: "GreenWorks Ltd"
                )
            } label: {
                Label(jobStarted ? "Job started" : "Start maintenance job",
                      systemImage: jobStarted ? "checkmark.circle.fill" : "wrench.and.screwdriver.fill")
                    .frame(maxWidth: .infinity).padding(.vertical, 12)
                    .background(Theme.accent, in: RoundedRectangle(cornerRadius: 14, style: .continuous))
                    .foregroundStyle(Theme.bg1)
            }
            .disabled(jobStarted)
            if jobStarted {
                Button("End job") { Task { await LiveActivityManager.shared.endAll(); jobStarted = false } }
                    .font(.caption).foregroundStyle(Theme.text2)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .liquidGlass()
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
