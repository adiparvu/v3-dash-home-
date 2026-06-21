import SwiftUI

// MARK: - Room-type presentation

enum ChatRoomType {
    static func label(_ type: String) -> String {
        switch type {
        case "dm": return "DM"
        default: return type.capitalized
        }
    }
    static func color(_ type: String) -> Color {
        switch type {
        case "property": return Theme.violet
        case "zone": return Theme.cyan
        case "asset": return Theme.amber
        case "task": return Theme.accent
        case "dm": return Theme.violet
        default: return Theme.accent
        }
    }
}

// MARK: - Chat rooms list

struct ChatListView: View {
    private let rooms = DemoData.chatRooms

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    ForEach(rooms) { room in
                        NavigationLink {
                            ChatThreadView(room: room)
                        } label: {
                            GlassRow(icon: room.icon,
                                     iconColor: ChatRoomType.color(room.type),
                                     title: room.name,
                                     subtitle: ChatRoomType.label(room.type),
                                     trailing: room.unread > 0 ? "\(room.unread)" : nil,
                                     trailingColor: Theme.accent,
                                     showsChevron: true)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(16)
            }
            .background(Theme.bg1.ignoresSafeArea())
            .navigationTitle("Chat")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Badge(text: "Demo", color: Theme.amber)
                }
            }
        }
    }
}

// MARK: - Chat thread

struct ChatThreadView: View {
    let room: ChatRoom

    @State private var messages: [ChatMessage] = []
    @State private var draft = ""
    @State private var callTarget: CallContact?
    @FocusState private var composerFocused: Bool

    var body: some View {
        VStack(spacing: 0) {
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 10) {
                        ForEach(messages) { msg in
                            bubble(msg).id(msg.id)
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
        .navigationTitle(room.name)
        .navigationBarTitleDisplayMode(.inline)
        .toolbar {
            if room.phone != nil {
                ToolbarItem(placement: .topBarTrailing) {
                    Button {
                        callTarget = CallContact(name: room.name, phone: room.phone)
                    } label: { Image(systemName: "phone.fill") }
                }
            }
        }
        .callSheet($callTarget)
        .task {
            if messages.isEmpty {
                messages = DemoData.chatMessages[room.id] ?? DemoData.chatMessages["general"] ?? []
            }
        }
    }

    private func bubble(_ msg: ChatMessage) -> some View {
        HStack {
            if msg.mine { Spacer(minLength: 40) }
            VStack(alignment: msg.mine ? .trailing : .leading, spacing: 3) {
                if !msg.mine {
                    Text([msg.author, msg.role].compactMap { $0 }.joined(separator: " · "))
                        .font(.caption2).foregroundStyle(Color(hex: UInt(msg.avatarColor)))
                }
                Text(msg.text)
                    .font(.subheadline).foregroundStyle(Theme.text1)
                    .padding(.horizontal, 12).padding(.vertical, 8)
                    .background(msg.mine ? Theme.accent.opacity(0.22) : Theme.glassBorder.opacity(0.6),
                                in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                Text(msg.time).font(.caption2).foregroundStyle(Theme.text3)
            }
            if !msg.mine { Spacer(minLength: 40) }
        }
    }

    private var composer: some View {
        HStack(spacing: 10) {
            TextField("Message", text: $draft, axis: .vertical)
                .textFieldStyle(.plain)
                .padding(.horizontal, 14).padding(.vertical, 10)
                .background(Theme.glassBorder.opacity(0.6), in: Capsule())
                .focused($composerFocused)
                .lineLimit(1...4)
            Button(action: send) {
                Image(systemName: "arrow.up.circle.fill").font(.title2)
            }
            .disabled(draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
            .foregroundStyle(draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ? Theme.text3 : Theme.accent)
        }
        .padding(12)
        .background(Theme.bg1)
    }

    private func send() {
        let text = draft.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        let time = Date().formatted(.dateTime.hour().minute())
        messages.append(ChatMessage(id: UUID().uuidString, author: "You", role: "Owner",
                                    text: text, time: time, mine: true, avatarColor: 0x4ADE80))
        draft = ""
    }
}
