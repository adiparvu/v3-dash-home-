import Foundation

/// A user-owned assistant identity (spec: Virtual AI Assistant → custom name,
/// avatar, personality). Persisted locally; the platform stays model-agnostic.
struct AssistantIdentity: Codable, Equatable {
    var name: String
    var personality: String
    var avatarColor: Int

    static let `default` = AssistantIdentity(name: "Aria", personality: "Friendly & concise", avatarColor: 0x7C3AED)

    static func load() -> AssistantIdentity {
        guard let data = UserDefaults.standard.data(forKey: key),
              let value = try? JSONDecoder().decode(AssistantIdentity.self, from: data) else { return .default }
        return value
    }
    func save() {
        if let data = try? JSONEncoder().encode(self) { UserDefaults.standard.set(data, forKey: Self.key) }
    }
    private static let key = "assistant.identity.v1"
}

/// Backs the AI Assistant screen: holds the editable identity and brokers
/// backend-authorized retrieval over the estate knowledge store (`/ai/retrieve`).
@MainActor
@Observable
final class AssistantStore {
    var identity: AssistantIdentity {
        didSet { identity.save() }
    }
    /// True when the last answer was grounded in live retrieved knowledge.
    private(set) var lastWasLive = false

    private let api: APIClient?
    init(api: APIClient?) {
        self.api = api
        identity = AssistantIdentity.load()
    }

    var isConfigured: Bool { api != nil }

    /// Backend-authorized retrieval. Returns [] in demo mode or on any failure
    /// (deny-by-default; the screen then answers from on-device estate data).
    func retrieve(_ query: String) async -> [KnowledgeChunk] {
        guard let api else { lastWasLive = false; return [] }
        let body: [String: Any] = [
            "query": query,
            "scopes": ["zones", "assets", "tasks", "maintenance", "sensors", "overview"],
        ]
        let chunks = (try? await api.post("/ai/retrieve", body: body, as: RetrievePayload.self).chunks) ?? []
        lastWasLive = !chunks.isEmpty
        return chunks
    }
}
