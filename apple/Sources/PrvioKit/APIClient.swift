import Foundation

/// Versioned REST client for the PRVIO Earth backend.
///
/// Mirrors the platform rule that clients communicate **only** through the
/// versioned backend API (never directly with databases, AI infra or IoT). All
/// requests are scoped to `/api/v1`; the bearer token (Supabase session JWT) is
/// attached when present so backend RLS can authorize the caller.
public struct APIClient: Sendable {
    public enum APIError: Error, Equatable {
        case unauthorized
        case http(Int)
        case decoding
        case transport
    }

    public let baseURL: URL
    /// Resolves the current session token (or nil when signed out).
    private let tokenProvider: @Sendable () -> String?
    private let session: URLSession

    public init(
        baseURL: URL,
        session: URLSession = .shared,
        tokenProvider: @escaping @Sendable () -> String? = { nil }
    ) {
        self.baseURL = baseURL
        self.session = session
        self.tokenProvider = tokenProvider
    }

    /// Envelope every endpoint returns: `{ "apiVersion": "1.0.0", "data": {…} }`.
    public struct Envelope<T: Decodable>: Decodable {
        public let apiVersion: String
        public let data: T
    }

    public func get<T: Decodable>(_ path: String, as: T.Type = T.self) async throws -> T {
        let url = baseURL.appendingPathComponent("api/v1").appendingPathComponent(path)
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        if let token = tokenProvider() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await session.data(for: request)
        } catch {
            throw APIError.transport
        }

        guard let http = response as? HTTPURLResponse else { throw APIError.transport }
        switch http.statusCode {
        case 200..<300: break
        case 401: throw APIError.unauthorized
        default: throw APIError.http(http.statusCode)
        }

        let decoder = JSONDecoder()
        guard let envelope = try? decoder.decode(Envelope<T>.self, from: data) else {
            throw APIError.decoding
        }
        return envelope.data
    }
}
