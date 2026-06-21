import SwiftUI

// MARK: - Settings hub

struct SettingsHubView: View {
    @Environment(AuthStore.self) private var auth
    @Environment(AppSettings.self) private var settings
    @State private var estate: EstateStore?
    @State private var showProfile = false

    private var profile: Profile { auth.profile ?? DemoData.profile }
    private var propertyName: String { estate?.properties.first?.name ?? "My Property" }

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button { showProfile = true } label: { accountHeader }.buttonStyle(.plain)
                }

                Section {
                    NavigationLink { PropertiesView() } label: { switchRow("house.fill", propertyName, "Property") }
                    Button { showProfile = true } label: { switchRow("person.crop.circle.fill", auth.isDemo ? "Demo account" : profile.email, "Account") }
                        .buttonStyle(.plain)
                }

                Section("Property") {
                    nav("My Property", "building.2.fill", PropertiesView())
                    nav("Zones", "map.fill", ZonesView())
                    nav("Inventory", "shippingbox.fill", InventoryView())
                    nav("Documents", "doc.fill", DocumentsView())
                    nav("Contractors", "person.2.fill", ContractorsView())
                    nav("Search", "magnifyingglass", SearchView())
                }

                Section("App") {
                    nav("Appearance", "paintbrush.fill", AppearanceView())
                    nav("Language", "globe", LanguageView())
                    nav("Units & Currency", "ruler.fill", UnitsView())
                    nav("Notifications", "bell.fill", NotificationPrefsView())
                    nav("AI Assistant", "sparkles", AIAssistantView())
                }

                Section("Account & Security") {
                    nav("Security", "lock.fill", SecurityView())
                    nav("Privacy & Data", "shield.fill", PrivacyView())
                }

                Section("Support") {
                    nav("About", "info.circle.fill", AboutView())
                }

                if !auth.isDemo {
                    Section {
                        Button(role: .destructive) { Task { await auth.signOut() } } label: {
                            Text("Sign Out").frame(maxWidth: .infinity)
                        }
                    }
                }

                Section {
                    EmptyView()
                } footer: {
                    Text("PRVIO Earth · Version \(appVersion)")
                        .frame(maxWidth: .infinity, alignment: .center)
                }
            }
            .listStyle(.insetGrouped)
            .navigationTitle("Settings")
        }
        .sheet(isPresented: $showProfile) { ProfileView() }
        .task {
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
        }
    }

    private var accountHeader: some View {
        HStack(spacing: 14) {
            Circle().fill(settings.accentColor.opacity(0.2)).frame(width: 50, height: 50)
                .overlay(Text(profile.initials).font(.title3.bold()).foregroundStyle(settings.accentColor))
            VStack(alignment: .leading, spacing: 2) {
                Text(profile.name).font(.headline).foregroundStyle(Theme.text1)
                Text(auth.isDemo ? "Demo mode" : profile.email).font(.subheadline).foregroundStyle(Theme.text2)
            }
            Spacer()
            Image(systemName: "chevron.right").font(.footnote).foregroundStyle(Theme.text3)
        }
        .padding(.vertical, 6)
    }

    private func switchRow(_ icon: String, _ title: String, _ sub: String) -> some View {
        HStack(spacing: 12) {
            settingsIcon(icon)
            VStack(alignment: .leading, spacing: 1) {
                Text(sub).font(.caption2).foregroundStyle(Theme.text3)
                Text(title).font(.subheadline.weight(.medium)).foregroundStyle(Theme.text1)
            }
            Spacer()
        }
    }

    private func nav<D: View>(_ title: String, _ icon: String, _ dest: D) -> some View {
        NavigationLink {
            dest
        } label: {
            Label { Text(title).foregroundStyle(Theme.text1) } icon: { settingsIcon(icon) }
        }
    }

    private func settingsIcon(_ name: String) -> some View {
        Image(systemName: name)
            .font(.system(size: 14, weight: .semibold))
            .foregroundStyle(Theme.text1)
            .frame(width: 29, height: 29)
            .background(Theme.iconTile, in: RoundedRectangle(cornerRadius: 7, style: .continuous))
    }

    private var appVersion: String {
        let v = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0"
        let b = Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
        return "\(v) (\(b))"
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
