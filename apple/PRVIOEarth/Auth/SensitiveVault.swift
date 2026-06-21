import Foundation

/// A file-backed store for sensitive records, sealed with the Secure Enclave so
/// the contents are encrypted at rest and only readable after biometric / passcode
/// authentication. Sealing is silent; revealing prompts for user presence.
struct SensitiveVault {
    private let cryptor = SecureEnclaveCryptor()
    private let url: URL

    init(filename: String = "sensitive.seal") {
        let dir = FileManager.default
            .urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
        try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
        url = dir.appendingPathComponent(filename)
    }

    var hasSealedData: Bool {
        FileManager.default.fileExists(atPath: url.path)
    }

    /// Encrypts and writes the text (no biometric prompt).
    func seal(_ text: String) throws {
        let cipher = try cryptor.encrypt(Data(text.utf8))
        try cipher.write(to: url, options: [.atomic, .completeFileProtection])
    }

    /// Reads and decrypts the text. Prompts for Face ID / Touch ID / passcode.
    func reveal() throws -> String {
        let cipher = try Data(contentsOf: url)
        let plain = try cryptor.decrypt(cipher)
        return String(decoding: plain, as: UTF8.self)
    }

    func clear() {
        try? FileManager.default.removeItem(at: url)
    }
}
