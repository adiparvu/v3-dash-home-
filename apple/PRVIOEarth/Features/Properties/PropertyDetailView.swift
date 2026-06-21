import SwiftUI

struct PropertyDetailView: View {
    let property: Property

    @Environment(AuthStore.self) private var auth
    @State private var jobStarted = false
    @State private var valuations: [PropertyValuation] = []
    @State private var source: EstateStore.Source = .demo
    @State private var showAddValuation = false
    @State private var showTransfer = false

    private var currency: String { property.currency ?? "EUR" }

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 16) {
                header
                infoCard
                valueCard
                valuationHistory
                maintenanceCard
                transferCard
            }
            .padding(16)
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle(property.name)
        .navigationBarTitleDisplayMode(.inline)
        .sheet(isPresented: $showAddValuation) {
            AddValuationSheet(currency: currency) { value, note in
                Task { await addValuation(value: value, note: note) }
            }
        }
        .sheet(isPresented: $showTransfer) { TransferOwnershipView(property: property) }
        .task { await loadValuations() }
    }

    // MARK: - Value tracking

    private var valueCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Text("Value").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                Spacer()
                Badge(text: source == .synced ? "Synced" : "Demo",
                      color: source == .synced ? Theme.accent : Theme.amber)
            }
            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(money(property.currentValue ?? valuations.first?.value))
                    .font(.title.bold()).foregroundStyle(Theme.text1)
                if let pct = property.appreciationPercent {
                    Text(String(format: "%@%.0f%%", pct >= 0 ? "▲ " : "▼ ", abs(pct)))
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(pct >= 0 ? Theme.accent : Theme.orange)
                }
            }
            if let purchase = property.purchasePrice {
                row("Purchase price", money(purchase))
            }
            if let notes = property.marketNotes, !notes.isEmpty {
                Text(notes).font(.caption).foregroundStyle(Theme.text2)
            }
            Button { showAddValuation = true } label: {
                Label("Add valuation", systemImage: "plus.circle.fill")
                    .font(.subheadline).foregroundStyle(Theme.accent)
            }
            .padding(.top, 2)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .liquidGlass()
    }

    @ViewBuilder private var valuationHistory: some View {
        if !valuations.isEmpty {
            VStack(alignment: .leading, spacing: 10) {
                Text("Valuation History").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                ForEach(valuations) { v in
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text(money(v.value)).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
                            if let note = v.note, !note.isEmpty {
                                Text(note).font(.caption).foregroundStyle(Theme.text2)
                            }
                        }
                        Spacer()
                        if let when = RelativeDate.short(v.recordedAt) {
                            Text(when).font(.caption).foregroundStyle(Theme.text3)
                        }
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(16)
            .liquidGlass()
        }
    }

    private func loadValuations() async {
        guard let api = auth.api else { valuations = DemoData.valuations; source = .demo; return }
        if let items = try? await api.get("/properties/\(property.id)/valuations", as: ValuationsPayload.self).valuations,
           !items.isEmpty {
            valuations = items
            source = .synced
        } else {
            valuations = DemoData.valuations
            source = .demo
        }
    }

    private func addValuation(value: Double, note: String?) async {
        guard let api = auth.api else { return }
        var body: [String: Any] = ["value": value]
        if let note, !note.isEmpty { body["note"] = note }
        if let v = try? await api.post("/properties/\(property.id)/valuations", body: body, as: ValuationPayload.self).valuation {
            valuations.insert(v, at: 0)
            source = .synced
        }
    }

    private func money(_ amount: Double?) -> String {
        guard let amount else { return "—" }
        let f = NumberFormatter()
        f.numberStyle = .decimal
        f.maximumFractionDigits = 0
        let n = f.string(from: NSNumber(value: amount)) ?? "\(Int(amount))"
        return "\(currency) \(n)"
    }

    // MARK: - Existing cards

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

    private var transferCard: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Ownership").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text("Initiate a verified, audited ownership transfer of this property.")
                .font(.caption).foregroundStyle(Theme.text2)
            Button { showTransfer = true } label: {
                Label("Transfer ownership", systemImage: "arrow.left.arrow.right.circle.fill")
                    .font(.subheadline.weight(.medium)).foregroundStyle(Theme.orange)
            }
            .padding(.top, 2)
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

private struct ValuationPayload: Decodable { let valuation: PropertyValuation }

// MARK: - Add valuation sheet

struct AddValuationSheet: View {
    @Environment(\.dismiss) private var dismiss
    let currency: String
    let onAdd: (Double, String?) -> Void

    @State private var amount = ""
    @State private var note = ""

    var body: some View {
        NavigationStack {
            Form {
                Section("New valuation (\(currency))") {
                    TextField("Amount", text: $amount).keyboardType(.numberPad)
                    TextField("Note (optional)", text: $note)
                }
            }
            .navigationTitle("Add Valuation")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") {
                        if let value = Double(amount.filter { $0.isNumber || $0 == "." }) {
                            onAdd(value, note)
                        }
                        dismiss()
                    }
                    .disabled(Double(amount.filter { $0.isNumber || $0 == "." }) == nil)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
