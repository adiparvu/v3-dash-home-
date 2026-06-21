import Foundation
import Security

enum SecureEnclaveError: LocalizedError {
    case unsupported
    case keyGenFailed(String)
    case encryptFailed(String)
    case decryptFailed(String)

    var errorDescription: String? {
        switch self {
        case .unsupported: return "Secure Enclave encryption isn't available on this device."
        case .keyGenFailed(let m): return "Could not create the secure key: \(m)"
        case .encryptFailed(let m): return "Could not encrypt: \(m)"
        case .decryptFailed(let m): return "Could not decrypt: \(m)"
        }
    }
}

/// Hardware-backed encryption for sensitive records using a **Secure Enclave**
/// P-256 key. The private key is generated inside the Enclave and never leaves it.
/// Encryption uses the public key (silent); decryption uses the private key and
/// therefore requires **user presence** (Face ID / Touch ID / passcode).
struct SecureEnclaveCryptor {
    private let tag: Data
    private let algorithm: SecKeyAlgorithm = .eciesEncryptionCofactorVariableIVX963SHA256AESGCM

    init(tag: String = "earth.prvio.app.sensitive-key") {
        self.tag = Data(tag.utf8)
    }

    // MARK: - Key lifecycle

    private func loadPrivateKey() -> SecKey? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassKey,
            kSecAttrApplicationTag as String: tag,
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecReturnRef as String: true,
        ]
        var item: CFTypeRef?
        guard SecItemCopyMatching(query as CFDictionary, &item) == errSecSuccess,
              let key = item else { return nil }
        return (key as! SecKey)
    }

    private func createPrivateKey() throws -> SecKey {
        var error: Unmanaged<CFError>?
        guard let access = SecAccessControlCreateWithFlags(
            kCFAllocatorDefault,
            kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
            [.privateKeyUsage, .userPresence],
            &error
        ) else {
            throw SecureEnclaveError.keyGenFailed(describe(error))
        }

        let attributes: [String: Any] = [
            kSecAttrKeyType as String: kSecAttrKeyTypeECSECPrimeRandom,
            kSecAttrKeySizeInBits as String: 256,
            kSecAttrTokenID as String: kSecAttrTokenIDSecureEnclave,
            kSecPrivateKeyAttrs as String: [
                kSecAttrIsPermanent as String: true,
                kSecAttrApplicationTag as String: tag,
                kSecAttrAccessControl as String: access,
            ],
        ]
        guard let key = SecKeyCreateRandomKey(attributes as CFDictionary, &error) else {
            throw SecureEnclaveError.keyGenFailed(describe(error))
        }
        return key
    }

    private func privateKey() throws -> SecKey {
        if let existing = loadPrivateKey() { return existing }
        return try createPrivateKey()
    }

    // MARK: - Crypto

    func encrypt(_ data: Data) throws -> Data {
        let priv = try privateKey()
        guard let pub = SecKeyCopyPublicKey(priv) else {
            throw SecureEnclaveError.encryptFailed("missing public key")
        }
        guard SecKeyIsAlgorithmSupported(pub, .encrypt, algorithm) else {
            throw SecureEnclaveError.unsupported
        }
        var error: Unmanaged<CFError>?
        guard let cipher = SecKeyCreateEncryptedData(pub, algorithm, data as CFData, &error) else {
            throw SecureEnclaveError.encryptFailed(describe(error))
        }
        return cipher as Data
    }

    /// Decrypts sensitive data. Prompts for biometric / passcode (user presence).
    func decrypt(_ data: Data) throws -> Data {
        let priv = try privateKey()
        guard SecKeyIsAlgorithmSupported(priv, .decrypt, algorithm) else {
            throw SecureEnclaveError.unsupported
        }
        var error: Unmanaged<CFError>?
        guard let plain = SecKeyCreateDecryptedData(priv, algorithm, data as CFData, &error) else {
            throw SecureEnclaveError.decryptFailed(describe(error))
        }
        return plain as Data
    }

    private func describe(_ error: Unmanaged<CFError>?) -> String {
        guard let error else { return "unknown error" }
        return (error.takeRetainedValue() as Error).localizedDescription
    }
}
