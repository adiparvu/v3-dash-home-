import SwiftUI

// MARK: - Settings hub

struct SettingsHubView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings

    private var profile: Profile { auth.profile ?? DemoData.profile }

    var body: some View {
        ListPage(title: "Settings") {
            // Account header
            HStack(spacing: 14) {
                ZStack {
                    Circle().fill(settings.accentColor.opacity(0.18)).frame(width: 52, height: 52)
                    Text(profile.initials).font(.headline).foregroundStyle(settings.accentColor)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(profile.name).font(.headline).foregroundStyle(Theme.text1)
                    Text(auth.isDemo ? "Demo mode" : profile.email).font(.caption).foregroundStyle(Theme.text2)
                }
                Spacer()
            }
            .padding(16).liquidGlass()

            group {
                navRow("lock.fill", Theme.cyan, "Security", SecurityView())
                navRow("shield.fill", Theme.violet, "Privacy & Data", PrivacyView())
            }
            group {
                navRow("paintbrush.fill", Theme.amber, "Appearance", AppearanceView())
                navRow("globe", Theme.cyan, "Language", LanguageView())
                navRow("ruler.fill", Theme.accent, "Units & Currency", UnitsView())
                navRow("bell.fill", Theme.orange, "Notifications", NotificationPrefsView())
            }
            group {
                navRow("info.circle.fill", Theme.text2, "About", AboutView())
            }

            if !auth.isDemo {
                Button(role: .destructive) { Task { await auth.signOut() } } label: {
                    Text("Sign Out").frame(maxWidth: .infinity).padding(.vertical, 14)
                }
                .liquidGlass()
            }
        }
    }

    @ViewBuilder private func group<Content: View>(@ViewBuilder _ content: () -> Content) -> some View {
        VStack(spacing: 0) { content() }.liquidGlass()
    }

    private func navRow<D: View>(_ icon: String, _ color: Color, _ title: String, _ dest: D) -> some View {
        NavigationLink {
            dest
        } label: {
            HStack(spacing: 14) {
                Image(systemName: icon).frame(width: 28).foregroundStyle(color)
                Text(title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
                Spacer()
                Image(systemName: "chevron.right").font(.footnote).foregroundStyle(Theme.text3)
            }
            .padding(.horizontal, 16).padding(.vertical, 13)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Appearance

struct AppearanceView: View {
    @Environment(AppSettings.self) private var settings

    var body: some View {
        @Bindable var s = settings
        ListPage(title: "Appearance") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Theme").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                HStack(spacing: 10) {
                    ForEach(AppSettings.Appearance.allCases) { mode in
                        Button { s.appearance = mode } label: {
                            VStack(spacing: 8) {
                                Image(systemName: mode.symbol).font(.title2)
                                Text(mode.label).font(.caption)
                            }
                            .frame(maxWidth: .infinity).padding(.vertical, 14)
                            .background(RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .fill(settings.appearance == mode ? settings.accentColor.opacity(0.18) : Theme.glassFill))
                            .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous)
                                .strokeBorder(settings.appearance == mode ? settings.accentColor : Theme.glassBorder, lineWidth: 1))
                            .foregroundStyle(settings.appearance == mode ? settings.accentColor : Theme.text2)
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading).padding(16).liquidGlass()

            VStack(alignment: .leading, spacing: 12) {
                Text("Accent color").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                HStack(spacing: 16) {
                    ForEach(AppSettings.AccentChoice.allCases) { choice in
                        Circle().fill(choice.color).frame(width: 34, height: 34)
                            .overlay(Circle().strokeBorder(Theme.text1, lineWidth: settings.accent == choice ? 3 : 0))
                            .onTapGesture { s.accent = choice }
                    }
                    Spacer()
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading).padding(16).liquidGlass()
        }
    }
}

// MARK: - Language

struct LanguageView: View {
    @Environment(AppSettings.self) private var settings

    var body: some View {
        @Bindable var s = settings
        ListPage(title: "Language") {
            VStack(spacing: 0) {
                ForEach(AppSettings.languages, id: \.code) { lang in
                    Button { s.languageCode = lang.code } label: {
                        HStack {
                            Text(lang.label).font(.subheadline).foregroundStyle(Theme.text1)
                            Spacer()
                            if settings.languageCode == lang.code {
                                Image(systemName: "checkmark").foregroundStyle(settings.accentColor)
                            }
                        }
                        .padding(.horizontal, 16).padding(.vertical, 13)
                    }
                    .buttonStyle(.plain)
                }
            }
            .liquidGlass()
            Text("Changes the app's regional formatting now; full text translation is rolled out incrementally.")
                .font(.caption).foregroundStyle(Theme.text3).frame(maxWidth: .infinity, alignment: .leading)
        }
    }
}

// MARK: - Units & Currency

struct UnitsView: View {
    @Environment(AppSettings.self) private var settings

    var body: some View {
        @Bindable var s = settings
        ListPage(title: "Units & Currency") {
            VStack(alignment: .leading, spacing: 12) {
                Text("Measurement").font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
                Picker("Units", selection: $s.unitSystem) {
                    ForEach(AppSettings.UnitSystem.allCases) { Text($0.label).tag($0) }
                }
                .pickerStyle(.segmented)
                Text("Example: \(settings.area(42000))").font(.caption).foregroundStyle(Theme.text2)
            }
            .frame(maxWidth: .infinity, alignment: .leading).padding(16).liquidGlass()

            VStack(spacing: 0) {
                ForEach(AppSettings.currencies, id: \.self) { code in
                    Button { s.currencyCode = code } label: {
                        HStack {
                            Text(code).font(.subheadline).foregroundStyle(Theme.text1)
                            Spacer()
                            if settings.currencyCode == code { Image(systemName: "checkmark").foregroundStyle(settings.accentColor) }
                        }
                        .padding(.horizontal, 16).padding(.vertical, 13)
                    }
                    .buttonStyle(.plain)
                }
            }
            .liquidGlass()
        }
    }
}

// MARK: - Notification preferences

struct NotificationPrefsView: View {
    @Environment(AppSettings.self) private var settings

    var body: some View {
        @Bindable var s = settings
        ListPage(title: "Notifications") {
            VStack(spacing: 0) {
                toggle("Maintenance reminders", "wrench.and.screwdriver.fill", Theme.amber, $s.notifyMaintenance)
                toggle("Security alerts", "lock.shield.fill", Theme.orange, $s.notifySecurity)
                toggle("Task updates", "checklist", Theme.accent, $s.notifyTasks)
                toggle("Weather alerts", "cloud.sun.fill", Theme.cyan, $s.notifyWeather)
            }
            .liquidGlass()
        }
    }

    private func toggle(_ title: String, _ icon: String, _ color: Color, _ binding: Binding<Bool>) -> some View {
        Toggle(isOn: binding) {
            HStack(spacing: 14) {
                Image(systemName: icon).frame(width: 28).foregroundStyle(color)
                Text(title).font(.subheadline).foregroundStyle(Theme.text1)
            }
        }
        .tint(Theme.accent)
        .padding(.horizontal, 16).padding(.vertical, 10)
    }
}

// MARK: - About

struct AboutView: View {
    var body: some View {
        ListPage(title: "About") {
            VStack(spacing: 10) {
                Image(systemName: "globe.europe.africa.fill").font(.system(size: 48)).foregroundStyle(Theme.accent)
                Text("PRVIO Earth").font(.title3.bold()).foregroundStyle(Theme.text1)
                Text("Version \(appVersion)").font(.caption).foregroundStyle(Theme.text2)
                Text("A private estate operating system.").font(.caption).foregroundStyle(Theme.text3)
            }
            .frame(maxWidth: .infinity).padding(24).liquidGlass()
        }
    }

    private var appVersion: String {
        let v = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let b = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
        return "\(v) (\(b))"
    }
}
