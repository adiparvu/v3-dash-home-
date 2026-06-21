import SwiftUI

/// AI Assistant — answers grounded in backend-authorized retrieval over the
/// estate knowledge store (`/ai/retrieve`), with an on-device fallback over
/// loaded estate data and a user-owned, customizable assistant identity.
struct AIAssistantView: View {
    @Environment(AuthStore.self) private var auth
    @State private var estate: EstateStore?
    @State private var store: AssistantStore?
    @State private var input = ""
    @State private var thinking = false
    @State private var showIdentity = false
    @State private var messages: [Message] = []

    private struct Message: Identifiable {
        enum Role { case user, assistant }
        let id = UUID()
        let role: Role
        let text: String
    }

    private var identity: AssistantIdentity { store?.identity ?? .default }

    var body: some View {
        VStack(spacing: 0) {
            ScrollViewReader { proxy in
                ScrollView {
                    VStack(alignment: .leading, spacing: 10) {
                        ForEach(messages) { m in bubble(m).id(m.id) }
                        if thinking {
                            Text("…").font(.title3).foregroundStyle(Theme.text3)
                        }
                    }
                    .padding(16)
                }
                .onChange(of: messages.count) {
                    if let last = messages.last { withAnimation { proxy.scrollTo(last.id, anchor: .bottom) } }
                }
            }
            composer
        }
        .background(Theme.bg1.ignoresSafeArea())
        .navigationTitle(identity.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                Badge(text: (store?.lastWasLive ?? false) ? "Live" : "On-device",
                      color: (store?.lastWasLive ?? false) ? Theme.accent : Theme.violet)
            }
            ToolbarItem(placement: .topBarLeading) {
                Button { showIdentity = true } label: { Image(systemName: "person.crop.circle.badge.gearshape") }
            }
        }
        .sheet(isPresented: $showIdentity) {
            if let store { AssistantIdentitySheet(identity: store.identity) { store.identity = $0 } }
        }
        .task {
            if store == nil { store = AssistantStore(api: auth.api) }
            if estate == nil { estate = EstateStore(api: auth.api) }
            await estate?.load()
            if messages.isEmpty {
                messages = [Message(role: .assistant,
                                    text: "Hi, I'm \(identity.name). Ask me about your estate — zones, objects, value, tasks or maintenance.")]
            }
        }
    }

    @ViewBuilder private func bubble(_ m: Message) -> some View {
        HStack {
            if m.role == .user { Spacer(minLength: 40) }
            Text(m.text)
                .font(.subheadline)
                .foregroundStyle(m.role == .user ? Theme.bg1 : Theme.text1)
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(m.role == .user ? Theme.accent : Theme.glassFill)
                )
            if m.role == .assistant { Spacer(minLength: 40) }
        }
    }

    private var composer: some View {
        HStack(spacing: 10) {
            TextField("Ask \(identity.name)…", text: $input, axis: .vertical)
                .textFieldStyle(.plain)
                .padding(12)
                .liquidGlass(cornerRadius: 18)
                .lineLimit(1...4)
            Button { Task { await send() } } label: {
                Image(systemName: "arrow.up.circle.fill").font(.title2)
            }
            .disabled(input.trimmingCharacters(in: .whitespaces).isEmpty || thinking)
            .foregroundStyle(Theme.accent)
        }
        .padding(12)
    }

    private func send() async {
        let q = input.trimmingCharacters(in: .whitespaces)
        guard !q.isEmpty else { return }
        messages.append(Message(role: .user, text: q))
        input = ""
        thinking = true
        let chunks = await store?.retrieve(q) ?? []
        thinking = false
        if !chunks.isEmpty {
            let body = chunks.prefix(3).map { "• \($0.title) — \($0.content)" }.joined(separator: "\n")
            messages.append(Message(role: .assistant, text: "Here's what I found:\n\(body)"))
        } else {
            messages.append(Message(role: .assistant, text: onDeviceAnswer(for: q)))
        }
    }

    /// Lightweight fallback over loaded estate data when retrieval is empty or
    /// the backend is unconfigured (demo mode).
    private func onDeviceAnswer(for q: String) -> String {
        let lower = q.lowercased()
        let e = estate
        if lower.contains("zone") {
            return "You have \(e?.zones.count ?? 0) zones: " + (e?.zones.map(\.name).joined(separator: ", ") ?? "—") + "."
        }
        if lower.contains("value") || lower.contains("worth") {
            return "Tracked object value is about €\(Int(e?.portfolioValue ?? 0))."
        }
        if lower.contains("object") || lower.contains("asset") || lower.contains("inventory") {
            return "There are \(e?.assets.count ?? 0) tracked objects in your inventory."
        }
        if lower.contains("propert") {
            return "Your estate spans \(e?.properties.count ?? 0) properties."
        }
        if lower.contains("maintenance") || lower.contains("task") {
            return "Next up: \(DemoData.maintenance.first?.title ?? "nothing scheduled"). You have \(DemoData.tasks.filter { $0.status != "done" }.count) open tasks."
        }
        return "I can help with zones, objects, estate value, properties and maintenance. Try \u{201C}How many zones do I have?\u{201D}"
    }
}

// MARK: - Identity editor

struct AssistantIdentitySheet: View {
    @Environment(\.dismiss) private var dismiss
    @State private var name: String
    @State private var personality: String
    @State private var color: Int
    let onSave: (AssistantIdentity) -> Void

    private let colors = [0x7C3AED, 0x4ADE80, 0x22D3EE, 0xF59E0B, 0xF97316]

    init(identity: AssistantIdentity, onSave: @escaping (AssistantIdentity) -> Void) {
        _name = State(initialValue: identity.name)
        _personality = State(initialValue: identity.personality)
        _color = State(initialValue: identity.avatarColor)
        self.onSave = onSave
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Identity") {
                    TextField("Assistant name", text: $name)
                    TextField("Personality", text: $personality)
                }
                Section("Avatar color") {
                    HStack(spacing: 14) {
                        ForEach(colors, id: \.self) { c in
                            Circle()
                                .fill(Color(hex: UInt(c)))
                                .frame(width: 32, height: 32)
                                .overlay(Circle().strokeBorder(.white, lineWidth: color == c ? 3 : 0))
                                .onTapGesture { color = c }
                        }
                    }
                }
            }
            .navigationTitle("Assistant")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        let trimmed = name.trimmingCharacters(in: .whitespaces)
                        onSave(AssistantIdentity(name: trimmed.isEmpty ? "Aria" : trimmed,
                                                 personality: personality, avatarColor: color))
                        dismiss()
                    }
                }
            }
        }
        .preferredColorScheme(.dark)
    }
}
