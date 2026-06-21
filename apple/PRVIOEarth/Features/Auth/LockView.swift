import SwiftUI

/// Shown when a stored session exists but the app is locked behind Face ID / Touch ID.
struct LockView: View {
    @Environment(AuthStore.self) private var auth

    private var biometricLabel: String {
        switch BiometricGate.availableKind {
        case .faceID: return "Unlock with Face ID"
        case .touchID: return "Unlock with Touch ID"
        case .none: return "Unlock"
        }
    }

    private var biometricIcon: String {
        switch BiometricGate.availableKind {
        case .faceID: return "faceid"
        case .touchID: return "touchid"
        case .none: return "lock.fill"
        }
    }

    var body: some View {
        VStack(spacing: 24) {
            Spacer()
            Circle()
                .fill(Theme.estateGradient)
                .frame(width: 88, height: 88)
                .overlay(Image(systemName: biometricIcon).font(.largeTitle).foregroundStyle(Theme.bg1))
            VStack(spacing: 6) {
                Text("PRVIO Earth").font(.title.bold()).foregroundStyle(Theme.text1)
                Text("Your estate is locked").font(.subheadline).foregroundStyle(Theme.text2)
            }
            Spacer()
            Button {
                Task { await auth.unlock() }
            } label: {
                Label(biometricLabel, systemImage: biometricIcon)
                    .font(.headline).frame(maxWidth: .infinity).padding(.vertical, 16)
                    .background(Theme.accent, in: RoundedRectangle(cornerRadius: 18, style: .continuous))
                    .foregroundStyle(Theme.bg1)
            }
            Button("Sign out") { Task { await auth.signOut() } }
                .font(.subheadline).foregroundStyle(Theme.text2)
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AuroraBackground())
        .task { await auth.unlock() } // prompt immediately on appear
    }
}
