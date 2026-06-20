# PRVIO Earth — Apple client (SwiftUI)

Native Apple front-end for PRVIO Earth. It reuses the **same versioned backend
contracts** as the web client (`/api/v1`, `{ "apiVersion": "1.0.0", "data": … }`)
and the same Supabase identity, so the estate, profile and security data are
shared across platforms.

This is **Phase 8, increment 1**: the iPhone app foundation. Later increments add
Widgets (WidgetKit), Live Activities (ActivityKit), and iPad / Mac / Apple Watch /
Vision Pro targets on the same shared layer.

> **Status / honesty note:** this code is authored to open and build in Xcode on
> macOS. It has **not** been compiled in this environment (the repo CI runs on
> Linux). Generate the project and build it in Xcode before relying on it.

## Requirements

- macOS with **Xcode 15+** (iOS 17 SDK)
- [XcodeGen](https://github.com/yonyz/XcodeGen) — `brew install xcodegen`

## Getting started

```bash
cd apple
cp PRVIOEarth/Resources/Config.xcconfig.example PRVIOEarth/Resources/Config.xcconfig
# edit Config.xcconfig with your Supabase URL + anon key (see below)
xcodegen generate
open PRVIOEarth.xcodeproj
```

Then select the **PRVIOEarth** scheme and run on an iPhone simulator or device.

### Configuration

`Config.xcconfig` injects these into `Info.plist` (kept out of source control):

| Key | Value |
| --- | --- |
| `SUPABASE_URL` | `https://<project-ref>.supabase.co` |
| `SUPABASE_ANON_KEY` | the project's anon / publishable key |
| `API_BASE_URL` | base URL of the Next.js backend, e.g. `https:/$()/your-deploy.vercel.app` |

> Note: `//` is escaped as `/$()/` in xcconfig because `//` starts a comment.

With no configuration the app runs in **demo mode** with seeded data (mirroring
the web client's localStorage prototype), so the UI is fully browsable offline.

## Architecture

```
PRVIOEarth/
  App/            App entry, root tab/auth gate, environment composition
  Auth/           Supabase GoTrue sign-in, Keychain token store, Face ID gate
  Networking/     Versioned APIClient (Bearer), typed endpoints, error model
  Models/         Codable models matching the /api/v1 contracts
  Features/       Overview, Properties, Profile (SwiftUI screens + view models)
  DesignSystem/   Liquid Glass theme tokens & reusable surfaces
  DemoData/       Offline seed data used when the backend is unreachable
  Resources/      Info.plist, Config.xcconfig(.example), assets
```

- **Auth:** signs in against Supabase GoTrue (`/auth/v1/token`), stores the
  access/refresh tokens in the **Keychain**, and gates the app with **Face ID /
  Touch ID** (`LocalAuthentication`). The session token is sent to the backend as
  `Authorization: Bearer …`.
- **Data:** `APIClient` calls the versioned REST API and decodes the
  `{ apiVersion, data }` envelope. On any network/auth failure it falls back to
  `DemoData` so screens stay usable.

## Known follow-ups (deferred)

- **Backend Bearer auth:** the current `/api/v1` resolves the user from the SSR
  **cookie** session only. For the native app to read live data it must also
  accept `Authorization: Bearer <token>` (a small `currentUserId()` change).
  Until then the app authenticates with Supabase and renders demo data for the
  estate screens.
- Widgets, Live Activities, and the iPad/Mac/Watch/Vision targets.
