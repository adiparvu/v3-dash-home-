import SwiftUI

struct SignInView: View {
    @Environment(AuthStore.self) private var auth
    @State private var email = ""
    @State private var password = ""

    var body: some View {
        VStack(spacing: 20) {
            Spacer()
            VStack(spacing: 8) {
                Circle().fill(Theme.estateGradient).frame(width: 72, height: 72)
                    .overlay(Image(systemName: "globe.europe.africa.fill").font(.title).foregroundStyle(Theme.bg1))
                Text("PRVIO EARTH").font(.title.bold()).foregroundStyle(Theme.text1)
                Text("Private estate operating system")
                    .font(.subheadline).foregroundStyle(Theme.text2)
            }

            VStack(spacing: 12) {
                TextField("you@example.com", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .textInputAutocapitalization(.never)
                    .autocorrectionDisabled()
                    .padding(14).liquidGlass(cornerRadius: 14)

                SecureField("Password", text: $password)
                    .textContentType(.password)
                    .padding(14).liquidGlass(cornerRadius: 14)

                if let message = auth.errorMessage {
                    Text(message).font(.caption).foregroundStyle(Theme.orange)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                if let info = auth.infoMessage {
                    Text(info).font(.caption).foregroundStyle(Theme.accent)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }

                Button {
                    Task { await auth.signIn(email: email, password: password) }
                } label: {
                    HStack {
                        if auth.isWorking { ProgressView().tint(Theme.bg1) }
                        Text("Sign In")
                    }
                    .font(.headline).frame(maxWidth: .infinity).padding(.vertical, 15)
                    .background(Theme.accent, in: RoundedRectangle(cornerRadius: 16, style: .continuous))
                    .foregroundStyle(Theme.bg1)
                }
                .disabled(email.isEmpty || password.isEmpty || auth.isWorking)

                Button("Email me a magic link") {
                    Task { await auth.sendMagicLink(email: email) }
                }
                .font(.footnote).foregroundStyle(Theme.text2)
                .disabled(email.isEmpty || auth.isWorking)

                HStack {
                    Rectangle().fill(Theme.glassBorder).frame(height: 0.5)
                    Text("or").font(.caption2).foregroundStyle(Theme.text3)
                    Rectangle().fill(Theme.glassBorder).frame(height: 0.5)
                }
                .padding(.vertical, 2)

                oauthButton("Continue with Apple", systemImage: "apple.logo", provider: "apple")
                oauthButton("Continue with Google", systemImage: "g.circle.fill", provider: "google")
            }
            .foregroundStyle(Theme.text1)

            Spacer()
            Button("Continue without signing in") { auth.continueInDemo() }
                .font(.subheadline).foregroundStyle(Theme.text2)
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(AuroraBackground())
    }

    private func oauthButton(_ title: String, systemImage: String, provider: String) -> some View {
        Button {
            Task { await auth.signInWithOAuth(provider) }
        } label: {
            Label(title, systemImage: systemImage)
                .font(.subheadline.weight(.medium))
                .frame(maxWidth: .infinity).padding(.vertical, 13)
                .overlay(RoundedRectangle(cornerRadius: 14).strokeBorder(Theme.glassBorder))
                .foregroundStyle(Theme.text1)
        }
        .disabled(auth.isWorking)
    }
}
