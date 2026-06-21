import SwiftUI

struct ProfileView: View {
    @Environment(AuthStore.self) private var auth

    private var profile: Profile { auth.profile ?? DemoData.profile }

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    profileCard
                    accountSection
                    if !auth.isDemo {
                        signOutButton
                    } else {
                        Text("Demo mode — configure Supabase to sign in.")
                            .font(.caption).foregroundStyle(Theme.text3)
                    }
                }
                .padding(16)
            }
            .background(Theme.bg1.ignoresSafeArea())
            .navigationTitle("Profile")
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

    private var accountSection: some View {
        VStack(alignment: .leading, spacing: 0) {
            settingsRow(icon: "lock.fill", title: "Security", subtitle: "Face ID, sessions & audit")
            Divider().overlay(Theme.glassBorder)
            settingsRow(icon: "shield.fill", title: "Privacy & Data", subtitle: "GDPR, exports & deletion")
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
}
