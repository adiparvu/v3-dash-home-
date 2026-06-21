import SwiftUI

/// Demonstrates Secure Enclave–backed sensitive records: a private note that is
/// encrypted at rest with a hardware key. Sealing is silent; revealing requires
/// Face ID / Touch ID / passcode (the private key lives in the Secure Enclave).
struct SecureNoteCard: View {
    @State private var vault = SensitiveVault()
    @State private var draft = ""
    @State private var revealed: String?
    @State private var status: String?
    @State private var isRevealing = false

    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            Label("Secure note", systemImage: "lock.shield.fill")
                .font(.subheadline.weight(.semibold)).foregroundStyle(Theme.text1)
            Text("Encrypted at rest with the Secure Enclave. Revealing requires Face ID.")
                .font(.caption).foregroundStyle(Theme.text2)

            if let revealed {
                Text(revealed)
                    .font(.callout).foregroundStyle(Theme.text1)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(12)
                    .background(Theme.glassFill, in: RoundedRectangle(cornerRadius: 12))
            }

            TextField("Write something private…", text: $draft, axis: .vertical)
                .lineLimit(1...3)
                .padding(12).liquidGlass(cornerRadius: 12)
                .foregroundStyle(Theme.text1)

            HStack(spacing: 10) {
                Button {
                    seal()
                } label: {
                    Label("Seal", systemImage: "lock.fill")
                        .frame(maxWidth: .infinity).padding(.vertical, 10)
                        .background(Theme.accent, in: RoundedRectangle(cornerRadius: 12))
                        .foregroundStyle(Theme.bg1)
                }
                .disabled(draft.trimmingCharacters(in: .whitespaces).isEmpty)

                Button {
                    Task { await reveal() }
                } label: {
                    Label("Reveal", systemImage: "faceid")
                        .frame(maxWidth: .infinity).padding(.vertical, 10)
                        .overlay(RoundedRectangle(cornerRadius: 12).strokeBorder(Theme.glassBorder))
                        .foregroundStyle(Theme.text1)
                }
                .disabled(!vault.hasSealedData || isRevealing)
            }

            if let status {
                Text(status).font(.caption2).foregroundStyle(Theme.text3)
            }
        }
        .padding(16)
        .liquidGlass()
    }

    private func seal() {
        do {
            try vault.seal(draft)
            draft = ""
            revealed = nil
            status = "Sealed in the Secure Enclave."
        } catch {
            status = error.localizedDescription
        }
    }

    private func reveal() async {
        isRevealing = true
        defer { isRevealing = false }
        // Decryption uses the Secure Enclave private key and triggers the
        // biometric / passcode prompt on a background queue.
        let v = vault // value-type copy, avoids capturing self in the detached task
        do {
            let text = try await Task.detached(priority: .userInitiated) {
                try v.reveal()
            }.value
            revealed = text
            status = "Unlocked."
        } catch {
            status = error.localizedDescription
        }
    }
}
