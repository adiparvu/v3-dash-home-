import SwiftUI

// MARK: - Privacy store (consents, DSAR requests, retention, export)

@MainActor
@Observable
final class PrivacyStore {
    private(set) var consents: [String: Bool] = Dictionary(uniqueKeysWithValues: DemoData.consentDefaults)
    private(set) var requests: [PrivacyRequestItem] = []
    private(set) var retention: [RetentionItem] = DemoData.retention
    private(set) var source: EstateStore.Source = .demo

    private let api: APIClient?
    init(api: APIClient?) { self.api = api }

    func load() async {
        guard let api else { source = .demo; return }
        if let items = try? await api.get("/privacy/consents", as: ConsentsPayload.self).consents {
            for c in items { consents[c.consentKey] = c.granted }
            source = .synced
        }
        if let reqs = try? await api.get("/privacy/requests", as: PrivacyRequestsPayload.self).requests {
            requests = reqs
        }
        if let ret = try? await api.get("/privacy/retention", as: RetentionPayload.self).retention, !ret.isEmpty {
            retention = ret
        }
    }

    func setConsent(_ key: String, _ granted: Bool) async {
        consents[key] = granted
        guard let api else { return }
        _ = try? await api.put("/privacy/consents", body: ["key": key, "granted": granted], as: EmptyOK.self)
    }

    func fileRequest(type: String, regulation: String?) async {
        guard let api else { return }
        var body: [String: Any] = ["type": type]
        if let regulation { body["regulation"] = regulation }
        if let req = try? await api.post("/privacy/requests", body: body, as: PrivacyRequestPayload.self).request {
            requests.insert(req, at: 0)
        }
    }

    /// Fetch the structured export and write it to a temp file for sharing.
    func exportData() async -> URL? {
        guard let api else { return nil }
        guard let data = try? await api.getData("/privacy/export") else { return nil }
        let url = FileManager.default.temporaryDirectory.appendingPathComponent("prvio-export.json")
        try? data.write(to: url)
        return url
    }
}

// MARK: - Privacy & Data screen

struct PrivacyView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: PrivacyStore?
    @State private var exportURL: URL?
    @State private var exporting = false
    @State private var confirmation: String?

    private let consentLabels: [(String, String)] = [
        ("analytics", "Analytics"), ("crash_reports", "Crash reports"),
        ("personalization", "Personalization"), ("marketing", "Marketing"),
        ("ai_processing", "AI processing"),
    ]

    var body: some View {
        ListPage(title: "Privacy & Data", source: store?.source) {
            consentsCard
            rightsCard
            if let c = confirmation {
                Text(c).font(.caption).foregroundStyle(Theme.accent).frame(maxWidth: .infinity, alignment: .leading)
            }
            requestsSection
            retentionSection
        }
        .task {
            if store == nil { store = PrivacyStore(api: auth.api) }
            await store?.load()
        }
    }

    private var consentsCard: some View {
        VStack(spacing: 0) {
            ForEach(consentLabels, id: \.0) { key, label in
                Toggle(isOn: Binding(
                    get: { store?.consents[key] ?? false },
                    set: { v in Task { await store?.setConsent(key, v) } }
                )) {
                    Text(label).font(.subheadline).foregroundStyle(Theme.text1)
                }
                .tint(Theme.accent)
                .padding(.horizontal, 16).padding(.vertical, 10)
            }
        }
        .padding(.vertical, 4)
        .liquidGlass()
    }

    private var rightsCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Your data rights").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            if let exportURL {
                ShareLink(item: exportURL) {
                    Label("Share data export", systemImage: "square.and.arrow.up")
                        .font(.subheadline).foregroundStyle(Theme.accent)
                }
            } else {
                Button {
                    Task {
                        exporting = true
                        exportURL = await store?.exportData()
                        exporting = false
                        if exportURL == nil { confirmation = "Export requires a signed-in account." }
                    }
                } label: {
                    Label(exporting ? "Preparing export…" : "Export my data", systemImage: "arrow.down.doc.fill")
                        .font(.subheadline).foregroundStyle(Theme.accent)
                }
                .disabled(exporting)
            }
            Button { file("access", "gdpr") } label: {
                Label("Request data access (GDPR)", systemImage: "doc.text.magnifyingglass")
                    .font(.subheadline).foregroundStyle(Theme.text1)
            }
            Button(role: .destructive) { file("erasure", "gdpr") } label: {
                Label("Request account erasure", systemImage: "trash")
                    .font(.subheadline).foregroundStyle(Theme.orange)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(16)
        .liquidGlass()
    }

    @ViewBuilder private var requestsSection: some View {
        if let reqs = store?.requests, !reqs.isEmpty {
            SectionHeader(title: "Requests", action: nil)
            ForEach(reqs) { r in
                GlassRow(icon: "shield.lefthalf.filled", iconColor: Theme.violet,
                         title: r.type.capitalized + (r.regulation.map { " · \($0.uppercased())" } ?? ""),
                         subtitle: "Status: \(r.status)",
                         trailing: RelativeDate.short(r.createdAt))
            }
        }
    }

    @ViewBuilder private var retentionSection: some View {
        SectionHeader(title: "Retention Schedule", action: nil)
        ForEach(store?.retention ?? []) { item in
            GlassRow(icon: "clock.arrow.circlepath", iconColor: Theme.text2,
                     title: item.category, subtitle: item.period)
        }
    }

    private func file(_ type: String, _ regulation: String?) {
        Task {
            await store?.fileRequest(type: type, regulation: regulation)
            confirmation = "Request filed. We'll respond within statutory timelines."
        }
    }
}
