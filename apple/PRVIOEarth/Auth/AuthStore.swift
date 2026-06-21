import Foundation
import Observation
import SwiftUI

/// Central session + lock state for the app.
///
/// - `.demo`     — no backend configured; browse seeded data.
/// - `.signedOut`— configured but no stored session.
/// - `.locked`   — have a session but the app needs Face ID / Touch ID.
/// - `.unlocked` — authenticated and unlocked.
@MainActor
@Observable
final class AuthStore {
    enum Phase: Equatable { case demo, signedOut, locked, unlocked }

    private(set) var phase: Phase
    private(set) var profile: Profile?
    var errorMessage: String?
    var infoMessage: String?
    var isWorking = false

    private var session: AuthSession?
    private let auth: SupabaseAuthService?
    private static let sessionAccount = "current-session"

    /// Auto-lock interval in seconds. A user change in Settings sets the override
    /// so enforcement takes effect immediately without re-fetching the profile.
    var autoLockOverride: Int?
    private var backgroundedAt: Date?
    var autoLockSeconds: Int { autoLockOverride ?? profile?.autoLockSeconds ?? 300 }

    var isDemo: Bool { phase == .demo }

    init() {
        let config = AppConfig.current
        if config.isConfigured, let url = config.supabaseURL, let key = config.supabaseAnonKey {
            auth = SupabaseAuthService(baseURL: url, anonKey: key)
            if let stored = KeychainStore.load(AuthSession.self, account: Self.sessionAccount) {
                session = stored
                phase = .locked
            } else {
                phase = .signedOut
            }
        } else {
            auth = nil
            phase = .demo
        }
    }

    /// An API client bound to this session, or `nil` in demo mode.
    var api: APIClient? {
        let config = AppConfig.current
        guard config.isConfigured, let base = config.apiBaseURL else { return nil }
        return APIClient(baseURL: base, anonKey: config.supabaseAnonKey) { [weak self] in
            await self?.validAccessToken()
        }
    }

    // MARK: - Actions

    func signIn(email: String, password: String) async {
        guard let auth else { return }
        isWorking = true; errorMessage = nil
        defer { isWorking = false }
        do {
            let newSession = try await auth.signIn(email: email, password: password)
            persist(newSession)
            phase = .unlocked
            await loadProfile()
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? error.localizedDescription
        }
    }

    /// URL scheme registered in Info.plist for OAuth / magic-link callbacks.
    static let callbackScheme = "prvio"

    /// OAuth sign-in (e.g. "apple", "google") via a web authentication session.
    func signInWithOAuth(_ provider: String) async {
        guard let auth, let url = auth.authorizeURL(provider: provider, redirectScheme: Self.callbackScheme) else { return }
        isWorking = true; errorMessage = nil; infoMessage = nil
        defer { isWorking = false }
        do {
            let callback = try await WebAuthSession().start(url: url, callbackScheme: Self.callbackScheme)
            guard let newSession = auth.session(fromCallback: callback) else {
                throw APIError.server("Sign-in failed.")
            }
            persist(newSession)
            phase = .unlocked
            await loadProfile()
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? error.localizedDescription
        }
    }

    /// Request an email magic link (completed via the deep-link callback).
    func sendMagicLink(email: String) async {
        guard let auth else { return }
        isWorking = true; errorMessage = nil; infoMessage = nil
        defer { isWorking = false }
        do {
            try await auth.requestMagicLink(email: email)
            infoMessage = "Check your email for the sign-in link."
        } catch {
            errorMessage = (error as? APIError)?.errorDescription ?? error.localizedDescription
        }
    }

    /// Handle an incoming `prvio://auth-callback#…` deep link (magic link / OAuth).
    func handleCallbackURL(_ url: URL) {
        guard let auth, let newSession = auth.session(fromCallback: url) else { return }
        persist(newSession)
        phase = .unlocked
        Task { await loadProfile() }
    }

    func unlock() async {
        guard phase == .locked else { return }
        if await BiometricGate.authenticate() {
            phase = .unlocked
            await loadProfile()
        }
    }

    func continueInDemo() {
        phase = .demo
    }

    /// Re-arm the biometric gate (used by auto-lock).
    func lock() {
        if phase == .unlocked { phase = .locked }
    }

    /// Drive auto-lock from the app's scene phase: remember when we go to the
    /// background, and lock on return if more than `autoLockSeconds` elapsed.
    func handleScenePhase(_ newPhase: ScenePhase) {
        guard phase == .unlocked || phase == .locked else { return }
        switch newPhase {
        case .background:
            if backgroundedAt == nil { backgroundedAt = Date() }
        case .active:
            if phase == .unlocked, let since = backgroundedAt,
               Date().timeIntervalSince(since) >= Double(autoLockSeconds) {
                phase = .locked
            }
            backgroundedAt = nil
        default:
            break
        }
    }

    func signOut() async {
        if let auth, let session { await auth.signOut(session) }
        KeychainStore.delete(account: Self.sessionAccount)
        session = nil
        profile = nil
        phase = auth == nil ? .demo : .signedOut
    }

    // MARK: - Token

    /// Returns a non-expired access token, refreshing if needed.
    func validAccessToken() async -> String? {
        guard var current = session else { return nil }
        if current.isExpired, let auth {
            do {
                current = try await auth.refresh(current)
                persist(current)
            } catch {
                // Refresh failed — force re-auth on next protected call.
                await signOut()
                return nil
            }
        }
        return current.accessToken
    }

    // MARK: - Helpers

    private func persist(_ newSession: AuthSession) {
        session = newSession
        KeychainStore.save(newSession, account: Self.sessionAccount)
    }

    private func loadProfile() async {
        guard let api else { return }
        LiveActivityManager.shared.configure(api: api) // enable push-token registration
        profile = try? await api.get("/profile", as: ProfilePayload.self).profile
    }
}
