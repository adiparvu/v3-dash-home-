import SwiftUI

/// Multi-step ownership-transfer request (spec: Property Transfer; gated as a
/// high-risk action). Steps: Verify → Recipient → Assets → Confirm. On confirm
/// it records an auditable, immutable transfer request via the backend; the
/// actual reassignment is a separate, recipient-accepted workflow.
struct TransferOwnershipView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(\.dismiss) private var dismiss
    let property: Property

    @State private var step = 0
    @State private var identityConfirmed = false
    @State private var legalConfirmed = false
    @State private var recipientName = ""
    @State private var recipientEmail = ""
    @State private var jurisdiction = ""
    @State private var effectiveDate = Date()
    @State private var includeAssets = true
    @State private var includeDocuments = true
    @State private var submitting = false
    @State private var done = false
    @State private var failure: String?

    private let steps = ["Verify", "Recipient", "Assets", "Confirm"]

    var body: some View {
        NavigationStack {
            Group {
                if done { successView } else { wizard }
            }
            .navigationTitle("Transfer Ownership")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Close") { dismiss() } } }
        }
        .preferredColorScheme(.dark)
    }

    private var wizard: some View {
        VStack(spacing: 0) {
            ProgressView(value: Double(step + 1), total: Double(steps.count))
                .tint(Theme.accent).padding()
            Form {
                switch step {
                case 0: verifyStep
                case 1: recipientStep
                case 2: assetsStep
                default: confirmStep
                }
            }
            if let failure { Text(failure).font(.caption).foregroundStyle(Theme.orange).padding(.horizontal) }
            navBar
        }
    }

    @ViewBuilder private var verifyStep: some View {
        Section("Ownership verification") {
            Toggle("I confirm I am the legal owner of \(property.name)", isOn: $identityConfirmed)
            Toggle("I understand this initiates a legally significant transfer", isOn: $legalConfirmed)
        }
    }

    @ViewBuilder private var recipientStep: some View {
        Section("Recipient") {
            TextField("Full name", text: $recipientName)
            TextField("Email", text: $recipientEmail).textInputAutocapitalization(.never).keyboardType(.emailAddress)
        }
        Section("Legal confirmation record") {
            TextField("Jurisdiction", text: $jurisdiction)
            DatePicker("Effective date", selection: $effectiveDate, displayedComponents: .date)
        }
    }

    @ViewBuilder private var assetsStep: some View {
        Section("Included in transfer") {
            Toggle("Reassign linked assets", isOn: $includeAssets)
            Toggle("Transfer documents", isOn: $includeDocuments)
        }
        Section { Text("Audit history is always preserved with the property.").font(.caption).foregroundStyle(Theme.text2) }
    }

    @ViewBuilder private var confirmStep: some View {
        Section("Review") {
            labeled("Property", property.name)
            labeled("Recipient", recipientName.isEmpty ? "—" : recipientName)
            labeled("Email", recipientEmail.isEmpty ? "—" : recipientEmail)
            labeled("Jurisdiction", jurisdiction.isEmpty ? "—" : jurisdiction)
            labeled("Effective", effectiveDate.formatted(date: .abbreviated, time: .omitted))
            labeled("Assets", includeAssets ? "Reassigned" : "Excluded")
            labeled("Documents", includeDocuments ? "Transferred" : "Excluded")
        }
        Section {
            Text("This records a pending, audited transfer request. The recipient must accept and legal completion is required before ownership changes.")
                .font(.caption).foregroundStyle(Theme.text3)
        }
    }

    private var navBar: some View {
        HStack {
            if step > 0 { Button("Back") { step -= 1 } .buttonStyle(.bordered) }
            Spacer()
            if step < steps.count - 1 {
                Button("Next") { failure = nil; step += 1 }
                    .buttonStyle(.borderedProminent).tint(Theme.accent)
                    .disabled(!canAdvance)
            } else {
                Button(submitting ? "Submitting…" : "Confirm Transfer") { Task { await submit() } }
                    .buttonStyle(.borderedProminent).tint(Theme.orange)
                    .disabled(submitting)
            }
        }
        .padding()
    }

    private var canAdvance: Bool {
        switch step {
        case 0: return identityConfirmed && legalConfirmed
        case 1: return !recipientName.trimmingCharacters(in: .whitespaces).isEmpty
            && recipientEmail.contains("@")
        default: return true
        }
    }

    private var successView: some View {
        VStack(spacing: 16) {
            Image(systemName: "checkmark.seal.fill").font(.system(size: 56)).foregroundStyle(Theme.accent)
            Text("Transfer request recorded").font(.headline).foregroundStyle(Theme.text1)
            Text("A pending, audited transfer of \(property.name) to \(recipientName) has been logged.")
                .font(.subheadline).foregroundStyle(Theme.text2).multilineTextAlignment(.center)
            Button("Done") { dismiss() }.buttonStyle(.borderedProminent).tint(Theme.accent)
        }
        .padding(32)
    }

    private func labeled(_ k: String, _ v: String) -> some View {
        HStack { Text(k).foregroundStyle(Theme.text2); Spacer(); Text(v).foregroundStyle(Theme.text1) }
    }

    private func submit() async {
        guard let api = auth.api else {
            // Demo mode: no backend — acknowledge locally.
            done = true
            return
        }
        submitting = true; failure = nil
        let f = ISO8601DateFormatter(); f.formatOptions = [.withFullDate]
        let body: [String: Any] = [
            "recipientName": recipientName,
            "recipientEmail": recipientEmail,
            "jurisdiction": jurisdiction,
            "effectiveDate": f.string(from: effectiveDate),
        ]
        do {
            _ = try await api.post("/properties/\(property.id)/transfer", body: body, as: TransferResultPayload.self)
            done = true
        } catch {
            failure = (error as? APIError)?.errorDescription ?? "Could not submit transfer."
        }
        submitting = false
    }
}

private struct TransferResultPayload: Decodable { let status: String }
