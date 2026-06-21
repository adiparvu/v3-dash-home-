import Foundation
import LocalAuthentication

/// Wraps `LocalAuthentication` to unlock the app with Face ID / Touch ID, falling
/// back to the device passcode.
enum BiometricGate {
    enum Kind { case faceID, touchID, none }

    static var availableKind: Kind {
        let ctx = LAContext()
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthentication, error: nil) else { return .none }
        switch ctx.biometryType {
        case .faceID: return .faceID
        case .touchID: return .touchID
        default: return .none
        }
    }

    /// Prompts the user to authenticate. Returns `true` on success.
    static func authenticate(reason: String = "Unlock PRVIO Earth") async -> Bool {
        let ctx = LAContext()
        ctx.localizedFallbackTitle = "Use Passcode"
        var error: NSError?
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthentication, error: &error) else {
            // No biometrics/passcode enrolled — don't hard-block the prototype.
            return true
        }
        return await withCheckedContinuation { continuation in
            ctx.evaluatePolicy(.deviceOwnerAuthentication, localizedReason: reason) { success, _ in
                continuation.resume(returning: success)
            }
        }
    }
}
