import SwiftUI

struct ProfileView: View {
    @Environment(AuthStore.self) private var auth
    @State private var store: ProfileStore?
    @State private var showAddLink = false
    @State private var showAddPerson = false

    private var profile: Profile { store?.profile ?? auth.profile ?? DemoData.profile }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    profileCard
                    if let line = memberSince { membershipBadge(line) }
                    contactSection
                    socialLinksSection
                    trustedPersonsSection
                    accountSection
                    SecureNoteCard()
                    if !auth.isDemo {
                        signOutButton
                    } else {
                        Text("Demo mode — configure Supabase to sign in.")
                            .font(.caption).foregroundStyle(Theme.text3)
                    }
                }
                .padding(16)
            }
            .background(ScreenBackground())
            .navigationTitle("Profile")
            .task {
                if store == nil { store = ProfileStore(api: auth.api) }
                await store?.load()
            }
            .sheet(isPresented: $showAddLink) {
                AddSocialLinkSheet { platform, url, label in
                    Task { await store?.addSocialLink(platform: platform, url: url, label: label) }
                }
            }
            .sheet(isPresented: $showAddPerson) {
                AddTrustedPersonSheet { name, rel, email, perms in
                    Task { await store?.addTrustedPerson(name: name, relationship: rel, email: email, permissions: perms) }
                }
            }
        }
    }

    private var profileCard: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle()
                    .strokeBorder(Color(hex: UInt(profile.avatarRingColor ?? 0x4ADE80)), lineWidth: 3)
                    .frame(width: 64, height: 64)
                Text(profile.initials).font(.title2.bold()).foregroundStyle(Theme.text1)
            }
            VStack(alignment: .leading, spacing: 4) {
                Text(profile.name).font(.headline).foregroundStyle(Theme.text1)
                Text(profile.email).font(.caption).foregroundStyle(Theme.text2)
                Badge(text: auth.isDemo ? "Demo" : "Synced",
                      color: auth.isDemo ? Theme.amber : Theme.accent)
            }
            Spacer()
        }
        .padding(16)
        .liquidGlass()
    }

    private func membershipBadge(_ line: String) -> some View {
        HStack(spacing: 8) {
            Image(systemName: "star.circle.fill").foregroundStyle(Theme.amber)
            Text(line).font(.caption).foregroundStyle(Theme.text2)
            Spacer()
        }
        .padding(.horizontal, 16).padding(.vertical, 10)
        .liquidGlass()
    }

    @ViewBuilder private var contactSection: some View {
        if profile.phone != nil || profile.notes != nil {
            VStack(spacing: 0) {
                if let phone = profile.phone, !phone.isEmpty {
                    GlassRow(icon: "phone.fill", iconColor: Theme.accent, title: "Phone", subtitle: phone)
                }
                if let notes = profile.notes, !notes.isEmpty {
                    GlassRow(icon: "note.text", iconColor: Theme.cyan, title: "Notes", subtitle: notes)
                }
            }
        }
    }

    @ViewBuilder private var socialLinksSection: some View {
        SectionHeader(title: "Social Links", action: "Add") { showAddLink = true }
        ForEach(store?.socialLinks ?? []) { link in
            GlassRow(icon: SocialCatalog.symbol(link.platform), iconColor: Theme.violet,
                     title: link.label ?? SocialCatalog.label(link.platform),
                     subtitle: link.url)
                .contextMenu {
                    Button("Remove", role: .destructive) {
                        Task { await store?.removeSocialLink(link.id) }
                    }
                }
        }
        if (store?.socialLinks ?? []).isEmpty {
            Text("No social links yet.").font(.caption).foregroundStyle(Theme.text3)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    @ViewBuilder private var trustedPersonsSection: some View {
        SectionHeader(title: "Trusted Persons", action: "Add") { showAddPerson = true }
        ForEach(store?.trustedPersons ?? []) { person in
            GlassRow(icon: "person.crop.circle.badge.checkmark", iconColor: Theme.accent,
                     title: person.name,
                     subtitle: [person.relationship, person.permissions.map { TrustedPermissionCatalog.label($0) }.joined(separator: ", ")]
                        .compactMap { $0 }.filter { !$0.isEmpty }.joined(separator: " · "))
                .contextMenu {
                    Button("Remove", role: .destructive) {
                        Task { await store?.removeTrustedPerson(person.id) }
                    }
                }
        }
        if (store?.trustedPersons ?? []).isEmpty {
            Text("Assign a trusted person for recovery and continuity.")
                .font(.caption).foregroundStyle(Theme.text3)
                .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private var accountSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            NavigationLink { SecurityView() } label: {
                settingsRow(icon: "lock.fill", title: "Security", subtitle: "Face ID, sessions & audit")
            }
            .buttonStyle(.plain)
            Divider().overlay(Theme.glassBorder)
            NavigationLink { PrivacyView() } label: {
                settingsRow(icon: "shield.fill", title: "Privacy & Data", subtitle: "GDPR, exports & deletion")
            }
            .buttonStyle(.plain)
            Divider().overlay(Theme.glassBorder)
            settingsRow(icon: "bell.fill", title: "Notifications", subtitle: "Alerts & reminders")
        }
        .padding(.vertical, 4)
        .liquidGlass()
    }

    private func settingsRow(icon: String, title: String, subtitle: String) -> some View {
        HStack(spacing: 14) {
            Image(systemName: icon).frame(width: 28).foregroundStyle(Theme.accent)
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
                Text(subtitle).font(.caption).foregroundStyle(Theme.text2)
            }
            Spacer()
            Image(systemName: "chevron.right").font(.footnote).foregroundStyle(Theme.text3)
        }
        .padding(.horizontal, 16).padding(.vertical, 12)
    }

    private var signOutButton: some View {
        Button(role: .destructive) {
            Task { await auth.signOut() }
        } label: {
            Text("Sign Out").frame(maxWidth: .infinity).padding(.vertical, 14)
        }
        .liquidGlass()
    }

    /// "Member since June 2024 · 2 yr" from the profile creation date.
    private var memberSince: String? {
        guard let created = profile.createdAt,
              let date = RelativeDate.date(from: created) else { return nil }
        let month = date.formatted(.dateTime.month(.wide).year())
        let years = Calendar.current.dateComponents([.year, .month], from: date, to: Date())
        let span: String
        if let y = years.year, y >= 1 { span = "\(y) yr" }
        else if let m = years.month, m >= 1 { span = "\(m) mo" }
        else { span = "new" }
        return "Member since \(month) · \(span)"
    }
}
