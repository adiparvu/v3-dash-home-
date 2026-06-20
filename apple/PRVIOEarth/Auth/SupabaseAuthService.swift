import Foundation

/// A persisted Supabase session (subset of the GoTrue token response).
struct AuthSession: Codable {
    var accessToken: String
    var refreshToken: String
    var expiresAt: Date
    var userId: String
    var email: String

    var isExpired: Bool { Date() >= expiresAt.addingTimeInterval(-60) }

    private enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresAt, userId, email
    }
}

/// Talks to Supabase GoTrue (`/auth/v1`) for password sign-in, magic-link request,
/// token refresh and sign-out. Identity is shared with the web client.
struct SupabaseAuthService {
    let baseURL: URL
    let anonKey: String

    private struct TokenResponse: Decodable {
        let accessToken: String
        let refreshToken: String
        let expiresIn: Int
        let user: User
        struct User: Decodable { let id: String; let email: String? }

        private enum CodingKeys: String, CodingKey {
            case accessToken = "access_token"
            case refreshToken = "refresh_token"
            case expiresIn = "expires_in"
            case user
        }
    }

    func signIn(email: String, password: String) async throws -> AuthSession {
        let body = ["email": email, "password": password]
        let token: TokenResponse = try await post("/auth/v1/token?grant_type=password", body: body)
        return session(from: token, fallbackEmail: email)
    }

    /// Sends a magic-link / OTP email. Completing it requires deep-link handling
    /// (a later increment); password sign-in is the supported end-to-end path now.
    func requestMagicLink(email: String) async throws {
        let _: EmptyResponse = try await post("/auth/v1/otp", body: ["email": email])
    }

    func refresh(_ session: AuthSession) async throws -> AuthSession {
        let body = ["refresh_token": session.refreshToken]
        let token: TokenResponse = try await post("/auth/v1/token?grant_type=refresh_token", body: body)
        return self.session(from: token, fallbackEmail: session.email)
    }

    func signOut(_ session: AuthSession) async {
        var req = makeRequest("/auth/v1/logout", method: "POST")
        req.setValue("Bearer \(session.accessToken)", forHTTPHeaderField: "Authorization")
        _ = try? await URLSession.shared.data(for: req)
    }

    // MARK: - Helpers

    private struct EmptyResponse: Decodable {}

    private func session(from token: TokenResponse, fallbackEmail: String) -> AuthSession {
        AuthSession(
            accessToken: token.accessToken,
            refreshToken: token.refreshToken,
            expiresAt: Date().addingTimeInterval(TimeInterval(token.expiresIn)),
            userId: token.user.id,
            email: token.user.email ?? fallbackEmail
        )
    }

    private func makeRequest(_ path: String, method: String) -> URLRequest {
        var req = URLRequest(url: URL(string: path, relativeTo: baseURL)!)
        req.httpMethod = method
        req.setValue(anonKey, forHTTPHeaderField: "apikey")
        req.setValue("application/json", forHTTPHeaderField: "Content-Type")
        return req
    }

    private func post<T: Decodable>(_ path: String, body: [String: String]) async throws -> T {
        var req = makeRequest(path, method: "POST")
        req.httpBody = try JSONSerialization.data(withJSONObject: body)
        let (data, response) = try await URLSession.shared.data(for: req)
        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        guard (200..<300).contains(status) else {
            let message = (try? JSONDecoder().decode([String: String].self, from: data))?["msg"]
                ?? (try? JSONDecoder().decode([String: String].self, from: data))?["error_description"]
                ?? "Sign-in failed (\(status))."
            throw APIError.server(message)
        }
        if T.self == EmptyResponse.self {
            return EmptyResponse() as! T
        }
        let decoder = JSONDecoder()
        return try decoder.decode(T.self, from: data)
    }
}
