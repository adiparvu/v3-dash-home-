import SwiftUI

/// A person you can reach from a contractor row, contact, or chat — matching the
/// web client's calling integrations (Phone, FaceTime audio/video, WhatsApp,
/// Telegram). Each option deep-links to the corresponding installed service.
struct CallContact: Identifiable, Hashable {
    var id: String { name + (phone ?? "") }
    let name: String
    var phone: String?
    var telegram: String?

    /// Keep a leading `+` and digits only, for URL schemes.
    private static func digits(_ phone: String) -> String {
        let trimmed = phone.trimmingCharacters(in: .whitespaces)
        let plus = trimmed.hasPrefix("+") ? "+" : ""
        return plus + trimmed.filter(\.isNumber)
    }

    var options: [CallOption] {
        guard let phone, !phone.isEmpty, phone != "—" else { return [] }
        let d = Self.digits(phone)
        let wa = d.hasPrefix("+") ? String(d.dropFirst()) : d
        let tg = telegram?.replacingOccurrences(of: "@", with: "") ?? wa
        return [
            CallOption(id: "phone", label: "Phone Call", icon: "phone.fill", color: Theme.accent, url: URL(string: "tel:\(d)")),
            CallOption(id: "ft-audio", label: "FaceTime Audio", icon: "phone.bubble.fill", color: Theme.cyan, url: URL(string: "facetime-audio:\(d)")),
            CallOption(id: "ft-video", label: "FaceTime Video", icon: "video.fill", color: Theme.cyan, url: URL(string: "facetime:\(d)")),
            CallOption(id: "wa", label: "WhatsApp", icon: "message.fill", color: Color(hex: 0x25D366), url: URL(string: "https://wa.me/\(wa)")),
            CallOption(id: "tg", label: "Telegram", icon: "paperplane.fill", color: Color(hex: 0x229ED9), url: URL(string: "https://t.me/\(tg)")),
        ]
    }
}

struct CallOption: Identifiable {
    let id: String
    let label: String
    let icon: String
    let color: Color
    let url: URL?
}

/// Bottom sheet that launches the chosen calling service.
struct CallSheet: View {
    let contact: CallContact
    @Environment(\.openURL) private var openURL
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 12) {
                    if contact.options.isEmpty {
                        Text("No phone number on file for this contact.")
                            .font(.callout).foregroundStyle(Theme.text3)
                            .padding(.top, 24)
                    } else {
                        ForEach(contact.options) { o in
                            Button {
                                if let url = o.url { openURL(url) }
                                dismiss()
                            } label: {
                                GlassRow(icon: o.icon, iconColor: o.color, title: o.label, showsChevron: true)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(16)
            }
            .background(ScreenBackground())
            .navigationTitle("Call \(contact.name)")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar { ToolbarItem(placement: .cancellationAction) { Button("Cancel") { dismiss() } } }
        }
        .presentationDetents([.medium, .large])
        .preferredColorScheme(.dark)
    }
}

extension View {
    /// Present the calling sheet when `contact` is non-nil.
    func callSheet(_ contact: Binding<CallContact?>) -> some View {
        sheet(item: contact) { CallSheet(contact: $0) }
    }
}
