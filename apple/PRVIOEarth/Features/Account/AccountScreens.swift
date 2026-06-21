import SwiftUI

// MARK: - Identity store (profile bundle + sessions + audit, with demo fallback)

@MainActor
@Observable
final class ProfileStore {
    private(set) var profile: Profile?
    private(set) var socialLinks: [SocialLink] = DemoData.socialLinks
    private(set) var trustedPersons: [TrustedPerson] = DemoData.trustedPersons
    private(set) var sessions: [UserSession] = DemoData.sessions
    private(set) var audit: [AuditEntry] = DemoData.audit
    private(set) var source: EstateStore.Source = .demo

    private let api: APIClient?
    init(api: APIClient?) { self.api = api }

    func load() async {
        guard let api else { source = .demo; return }
        do {
            let bundle = try await api.get("/profile", as: ProfileBundle.self)
            profile = bundle.profile
            socialLinks = bundle.socialLinks
            trustedPersons = bundle.trustedPersons
            sessions = bundle.sessions
            source = .synced
        } catch {
            source = .demo
        }
        if let entries = try? await api.get("/audit?limit=50", as: AuditPayload.self).entries {
            audit = entries
        }
    }

    func addSocialLink(platform: String, url: String, label: String?) async {
        guard let api else { return }
        var body: [String: Any] = ["platform": platform, "url": url]
        if let label, !label.isEmpty { body["label"] = label }
        if let link = try? await api.post("/profile/social-links", body: body, as: SocialLinkPayload.self).link {
            socialLinks.append(link)
        }
    }

    func removeSocialLink(_ id: String) async {
        guard let api else { socialLinks.removeAll { $0.id == id }; return }
        _ = try? await api.delete("/profile/social-links/\(id)", as: EmptyOK.self)
        socialLinks.removeAll { $0.id == id }
    }

    func addTrustedPerson(name: String, relationship: String?, email: String?, permissions: [String]) async {
        guard let api else { return }
        var body: [String: Any] = ["name": name, "permissions": permissions]
        if let relationship, !relationship.isEmpty { body["relationship"] = relationship }
        if let email, !email.isEmpty { body["email"] = email }
        if let person = try? await api.post("/profile/trusted-persons", body: body, as: TrustedPersonPayload.self).person {
            trustedPersons.append(person)
        }
    }

    func removeTrustedPerson(_ id: String) async {
        guard let api else { trustedPersons.removeAll { $0.id == id }; return }
        _ = try? await api.delete("/profile/trusted-persons/\(id)", as: EmptyOK.self)
        trustedPersons.removeAll { $0.id == id }
    }

    func revokeSession(_ id: String) async {
        guard let api else { sessions.removeAll { $0.id == id }; return }
        _ = try? await api.delete("/profile/sessions/\(id)", as: EmptyOK.self)
        sessions.removeAll { $0.id == id }
    }

    func revokeOtherSessions() async {
        guard let api else { sessions.removeAll { !$0.isCurrent }; return }
        _ = try? await api.delete("/profile/sessions", as: EmptyOK.self)
        sessions.removeAll { !$0.isCurrent }
    }

    func setTrust(_ id: String, trusted: Bool) async {
        guard let i = sessions.firstIndex(where: { $0.id == id }) else { return }
        let s = sessions[i]
        sessions[i] = UserSession(id: s.id, deviceName: s.deviceName, platform: s.platform,
                                  location: s.location, isTrusted: trusted, isCurrent: s.isCurrent,
                                  lastActiveAt: s.lastActiveAt)
        guard let api else { return }
        _ = try? await api.patch("/profile/sessions/\(id)", body: ["trusted": trusted], as: EmptyOK.self)
    }

    func setAutoLock(_ seconds: Int) async {
        guard let api else { return }
        _ = try? await api.patch("/profile", body: ["auto_lock_seconds": seconds], as: ProfilePayload.self)
    }

    func setLoginAlerts(_ on: Bool) async {
        guard let api else { return }
        _ = try? await api.patch("/profile", body: ["login_alerts": on], as: ProfilePayload.self)
    }
}

// MARK: - Social-platform presentation

enum SocialCatalog {
    /// Platforms supported by the backend enum, in the add-link picker order.
    static let platforms = ["facebook", "instagram", "x", "threads", "linkedin",
                            "tiktok", "youtube", "telegram", "whatsapp", "custom"]

    static func label(_ platform: String) -> String {
        switch platform {
        case "x": return "X"
        case "tiktok": return "TikTok"
        case "youtube": return "YouTube"
        case "linkedin": return "LinkedIn"
        case "whatsapp": return "WhatsApp"
        default: return platform.prefix(1).uppercased() + platform.dropFirst()
        }
    }

    static func symbol(_ platform: String) -> String {
        switch platform {
        case "whatsapp", "telegram": return "message.fill"
        case "youtube", "tiktok": return "play.rectangle.fill"
        case "custom": return "link"
        default: return "at"
        }
    }
}

enum TrustedPermissionCatalog {
    static let all = ["emergency_access", "ownership_transfer", "recovery_approvals", "estate_continuity"]
    static func label(_ p: String) -> String {
        p.replacingOccurrences(of: "_", with: " ").capitalized
    }
}

// MARK: - Security screen (sessions, auto-lock, login alerts, audit)

struct SecurityView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: ProfileStore?
    @State private var autoLock: Int = 300
    @State private var loginAlerts = true

    private let autoLockOptions: [(String, Int)] = [
        ("Immediately", 0), ("30 seconds", 30), ("1 minute", 60), ("5 minutes", 300),
        ("15 minutes", 900), ("30 minutes", 1800), ("1 hour", 3600),
    ]

    var body: some View {
        ListPage(title: "Security", source: store?.source) {
            biometricCard
            sessionsSection
            auditSection
        }
        .task {
            if store == nil { store = ProfileStore(api: auth.api) }
            await store?.load()
            let p = store?.profile ?? auth.profile
            autoLock = p?.autoLockSeconds ?? 300
            loginAlerts = p?.loginAlerts ?? true
        }
    }

    private var biometricCard: some View {
        VStack(spacing: 0) {
            GlassRow(icon: "faceid", iconColor: Theme.cyan, title: "Face ID / Touch ID",
                     subtitle: "Unlock the app biometrically", trailing: "On", trailingColor: Theme.accent)
            HStack(spacing: 14) {
                Image(systemName: "lock.rotation").frame(width: 28).foregroundStyle(Theme.violet)
                Text("Auto-Lock").font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
                Spacer()
                Menu {
                    ForEach(autoLockOptions, id: \.1) { opt in
                        Button(opt.0) {
                            autoLock = opt.1
                            auth.autoLockOverride = opt.1
                            Task { await store?.setAutoLock(opt.1) }
                        }
                    }
                } label: {
                    Text(autoLockLabel).font(.subheadline).foregroundStyle(Theme.accent)
                }
            }
            .padding(14)
            .liquidGlass()
            Toggle(isOn: Binding(get: { loginAlerts }, set: { v in
                loginAlerts = v; Task { await store?.setLoginAlerts(v) }
            })) {
                HStack(spacing: 14) {
                    Image(systemName: "bell.badge.fill").frame(width: 28).foregroundStyle(Theme.orange)
                    Text("Login Alerts").font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
                }
            }
            .tint(Theme.accent)
            .padding(14)
            .liquidGlass()
        }
    }

    private var autoLockLabel: String {
        autoLockOptions.first { $0.1 == autoLock }?.0 ?? "\(autoLock)s"
    }

    @ViewBuilder private var sessionsSection: some View {
        SectionHeader(title: "Active Sessions", action: "Sign out others") {
            Task { await store?.revokeOtherSessions() }
        }
        ForEach(store?.sessions ?? []) { s in
            GlassRow(icon: deviceIcon(s.platform),
                     iconColor: s.isCurrent ? Theme.accent : Theme.text2,
                     title: [s.deviceName ?? "Device", s.isCurrent ? "(this device)" : nil].compactMap { $0 }.joined(separator: " "),
                     subtitle: [s.platform, s.location, RelativeDate.short(s.lastActiveAt)].compactMap { $0 }.joined(separator: " · "),
                     trailing: s.isTrusted ? "Trusted" : nil,
                     trailingColor: Theme.accent)
                .contextMenu {
                    Button(s.isTrusted ? "Untrust device" : "Trust device") {
                        Task { await store?.setTrust(s.id, trusted: !s.isTrusted) }
                    }
                    if !s.isCurrent {
                        Button("Revoke session", role: .destructive) {
                            Task { await store?.revokeSession(s.id) }
                        }
                    }
                }
        }
    }

    @ViewBuilder private var auditSection: some View {
        SectionHeader(title: "Audit Log", action: nil, perform: nil)
        ForEach(store?.audit ?? []) { e in
            GlassRow(icon: "doc.text.magnifyingglass", iconColor: Theme.text2,
                     title: e.action,
                     subtitle: [e.resource, e.detail].compactMap { $0 }.joined(separator: " · "),
                     trailing: RelativeDate.short(e.createdAt))
        }
    }

    private func deviceIcon(_ platform: String?) -> String {
        switch platform?.lowercased() {
        case "ios", "ipados": return "iphone"
        case "macos": return "laptopcomputer"
        case "web": return "globe"
        default: return "desktopcomputer"
        }
    }
}

/// A small section header with an optional trailing action button.
struct SectionHeader: View {
    let title: String
    var action: String? = nil
    var perform: (() -> Void)? = nil

    var body: some View {
        HStack {
            Text(title).font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text2)
            Spacer()
            if let action, let perform {
                Button(action, action: perform).font(.caption.weight(.medium)).foregroundStyle(Theme.accent)
            }
        }
        .padding(.top, 8)
    }
}

// MARK: - Relative date helper

enum RelativeDate {
    // Read-only, constructed once; Foundation formatters aren't Sendable, so opt
    // out of Swift 6 static-isolation checking explicitly.
    private nonisolated(unsafe) static let iso: ISO8601DateFormatter = {
        let f = ISO8601DateFormatter()
        f.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        return f
    }()
    private nonisolated(unsafe) static let isoPlain = ISO8601DateFormatter()
    private nonisolated(unsafe) static let rel: RelativeDateTimeFormatter = {
        let f = RelativeDateTimeFormatter()
        f.unitsStyle = .abbreviated
        return f
    }()

    static func date(from iso8601: String?) -> Date? {
        guard let iso8601 else { return nil }
        return iso.date(from: iso8601) ?? isoPlain.date(from: iso8601)
    }

    static func short(_ iso8601: String?) -> String? {
        guard let date = date(from: iso8601) else { return nil }
        return rel.localizedString(for: date, relativeTo: Date())
    }
}

// MARK: - Add sheets

struct AddSocialLinkSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var platform = "instagram"
    @State private var url = ""
    @State private var label = ""
    let onAdd: (String, String, String?) -> Void

    var body: some View {
        NavigationStack {
            Form {
                Picker("Platform", selection: $platform) {
                    ForEach(SocialCatalog.platforms, id: \.self) { Text(SocialCatalog.label($0)).tag($0) }
                }
                TextField("URL", text: $url).textInputAutocapitalization(.never).keyboardType(.URL)
                TextField("Label (optional)", text: $label)
            }
            .navigationTitle("Add Link")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") { onAdd(platform, url, label); dismiss() }
                        .disabled(url.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}

struct AddTrustedPersonSheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name = ""
    @State private var relationship = ""
    @State private var email = ""
    @State private var permissions: Set<String> = ["emergency_access"]
    let onAdd: (String, String, String, [String]) -> Void

    var body: some View {
        NavigationStack {
            Form {
                Section {
                    TextField("Name", text: $name)
                    TextField("Relationship (optional)", text: $relationship)
                    TextField("Email (optional)", text: $email).textInputAutocapitalization(.never).keyboardType(.emailAddress)
                }
                Section("Permissions") {
                    ForEach(TrustedPermissionCatalog.all, id: \.self) { p in
                        Button {
                            if permissions.contains(p) { permissions.remove(p) } else { permissions.insert(p) }
                        } label: {
                            HStack {
                                Text(TrustedPermissionCatalog.label(p)).foregroundStyle(Theme.text1)
                                Spacer()
                                if permissions.contains(p) { Image(systemName: "checkmark").foregroundStyle(Theme.accent) }
                            }
                        }
                    }
                }
            }
            .navigationTitle("Trusted Person")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Add") { onAdd(name, relationship, email, Array(permissions)); dismiss() }
                        .disabled(name.trimmingCharacters(in: .whitespaces).isEmpty)
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
