import Foundation

enum APIError: LocalizedError {
    case notConfigured
    case unauthorized
    case server(String)
    case decoding(Error)
    case transport(Error)

    var errorDescription: String? {
        switch self {
        case .notConfigured: return "Backend is not configured."
        case .unauthorized: return "Your session has expired. Please sign in again."
        case .server(let m): return m
        case .decoding(let e): return "Unexpected response: \(e.localizedDescription)"
        case .transport(let e): return e.localizedDescription
        }
    }
}

/// Talks to the versioned PRVIO Earth REST API (`/api/v1`). Sends the Supabase
/// access token as `Authorization: Bearer …` and decodes the `{ apiVersion, data }`
/// envelope. Stateless; the caller supplies the current access token.
struct APIClient {
    let baseURL: URL
    let anonKey: String?
    /// Async provider for the current access token (from `AuthStore`).
    let accessToken: () async -> String?

    private static let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }()

    func get<T: Decodable>(_ path: String, as type: T.Type) async throws -> T {
        try await request(path: path, method: "GET", body: nil, as: type)
    }

    func patch<T: Decodable>(_ path: String, body: [String: Any], as type: T.Type) async throws -> T {
        let data = try JSONSerialization.data(withJSONObject: body)
        return try await request(path: path, method: "PATCH", body: data, as: type)
    }

    private func request<T: Decodable>(path: String, method: String, body: Data?, as type: T.Type) async throws -> T {
        guard let url = URL(string: "/api/v1" + path, relativeTo: baseURL) else {
            throw APIError.notConfigured
        }
        var req = URLRequest(url: url)
        req.httpMethod = method
        req.httpBody = body
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        if body != nil { req.setValue("application/json", forHTTPHeaderField: "Content-Type") }
        if let key = anonKey { req.setValue(key, forHTTPHeaderField: "apikey") }
        if let token = await accessToken() {
            req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }

        let (data, response): (Data, URLResponse)
        do {
            (data, response) = try await URLSession.shared.data(for: req)
        } catch {
            throw APIError.transport(error)
        }

        let status = (response as? HTTPURLResponse)?.statusCode ?? 0
        if status == 401 { throw APIError.unauthorized }

        let envelope: APIEnvelope<T>
        do {
            envelope = try Self.decoder.decode(APIEnvelope<T>.self, from: data)
        } catch {
            throw APIError.decoding(error)
        }
        if let error = envelope.error { throw APIError.server(error) }
        guard let payload = envelope.data else { throw APIError.server("empty_response") }
        return payload
    }
}
