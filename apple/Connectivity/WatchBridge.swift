import Foundation
import Observation
#if canImport(WatchConnectivity)
import WatchConnectivity
#endif

/// Bridges the estate snapshot between the paired iPhone and Apple Watch using
/// WatchConnectivity. The iPhone pushes the latest `EstateSnapshot` as the
/// application context; the Watch receives it, persists it and updates the UI.
///
/// Compiled into the app and Watch targets only (not the widget extension, where
/// `WCSession` is unavailable).
@MainActor
@Observable
final class WatchBridge: NSObject {
    static let shared = WatchBridge()

    /// The most recent snapshot known to this device (seeded from local storage).
    private(set) var latest: EstateSnapshot = SharedStore.load()

    private override init() { super.init() }

    func activate() {
        #if canImport(WatchConnectivity)
        guard WCSession.isSupported() else { return }
        let session = WCSession.default
        session.delegate = self
        session.activate()
        #endif
    }

    /// iPhone → Watch: publish the latest snapshot as application context.
    func send(_ snapshot: EstateSnapshot) {
        latest = snapshot
        #if canImport(WatchConnectivity)
        guard WCSession.isSupported() else { return }
        let session = WCSession.default
        guard session.activationState == .activated,
              let data = try? JSONEncoder().encode(snapshot) else { return }
        try? session.updateApplicationContext(["snapshot": data])
        #endif
    }

    fileprivate func apply(_ snapshot: EstateSnapshot) {
        SharedStore.save(snapshot) // persist on the receiving device
        latest = snapshot
    }
}

#if canImport(WatchConnectivity)
extension WatchBridge: WCSessionDelegate {
    nonisolated func session(
        _ session: WCSession,
        activationDidCompleteWith activationState: WCSessionActivationState,
        error: Error?
    ) {}

    nonisolated func session(_ session: WCSession, didReceiveApplicationContext applicationContext: [String: Any]) {
        // Decode in the nonisolated context so only the Sendable snapshot crosses
        // to the main actor (avoids sending the non-Sendable [String: Any]).
        guard let data = applicationContext["snapshot"] as? Data,
              let snapshot = try? JSONDecoder().decode(EstateSnapshot.self, from: data) else { return }
        Task { @MainActor in self.apply(snapshot) }
    }

    #if os(iOS)
    nonisolated func sessionDidBecomeInactive(_ session: WCSession) {}
    nonisolated func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }
    #endif
}
#endif
