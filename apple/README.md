# PRVIO Earth — Apple client (SwiftUI)

Native Apple front-end for PRVIO Earth. It reuses the **same versioned backend
contracts** as the web client (`/api/v1`, `{ "apiVersion": "1.0.0", "data": … }`)
and the same Supabase identity, so the estate, profile and security data are
shared across platforms.

**Phase 8** covers the native Apple clients. Targets:

- **PRVIOEarth** — one multiplatform app: **iPhone + iPad + Mac (Catalyst) +
  Vision Pro**, sharing one tab-based interface.
- **PRVIOEarthWidgets** — WidgetKit widgets + Live Activities.
- **PRVIOEarthWatch** — Apple Watch app.

All share the code under `Shared/` and the design system.

> **Status / honesty note:** this code is authored to open and build in Xcode on
> macOS. It has **not** been compiled in this environment (the repo CI runs on
> Linux). Generate the project and build it in Xcode before relying on it.

## Requirements

- macOS with **Xcode 26** (iOS 26 SDK) — the app targets iOS/iPadOS/visionOS 26
  and watchOS 26, builds with **Swift 6**, and uses the native SwiftUI **Liquid
  Glass** APIs (`.glassEffect`). (iOS 27 SDK isn't on CI/TestFlight infra yet.)
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
PRVIOEarth/        (app target)
  App/             App entry, root tab/auth gate, environment composition
  Auth/            Supabase GoTrue sign-in, Keychain token store, Face ID gate
  Networking/      Versioned APIClient (Bearer), typed endpoints, error model
  Models/          Codable models matching the /api/v1 contracts
  Features/        Overview, Properties, Profile (SwiftUI screens + view models)
  DesignSystem/    Liquid Glass theme tokens & reusable surfaces
  DemoData/        Offline seed data used when the backend is unreachable
  Resources/       Info.plist, Config.xcconfig(.example), assets, entitlements
PRVIOEarthWidgets/ (WidgetKit extension)
  PropertyStatusWidget, TasksWidget, EstateProvider, widget bundle
Shared/            (compiled into both targets)
  EstateSnapshot + SharedStore (App Group bridge to the widgets)
```

### Widgets

The `PRVIOEarthWidgets` extension provides **Home Screen** (`systemSmall`,
`systemMedium`) and **Lock Screen** (`accessoryCircular`, `accessoryRectangular`,
`accessoryInline`) widgets:

- **Property Status** — estate health ring, zones and objects.
- **Tasks & Maintenance** — open tasks and the next maintenance due.

Widgets read an `EstateSnapshot` the app publishes to the **App Group**
(`group.earth.prvio.app`) via `SharedStore`; saving a snapshot triggers a
WidgetKit reload. No network runs in the widget process. Both targets must share
the App Group capability (configured in `project.yml` entitlements).

### Live Activities

In-progress estate jobs (maintenance / delivery / inspection / incident) surface
as **Live Activities** on the Lock Screen and **Dynamic Island**:

- `MaintenanceActivityAttributes` (in `Shared/`, compiled into both targets) defines
  the static attributes and the live `ContentState` (status, progress, ETA).
- `LiveActivityManager` (app) starts / updates / ends activities.
- `MaintenanceLiveActivity` (widget extension) renders the Lock Screen banner and
  the Dynamic Island (compact / minimal / expanded).

Requires `NSSupportsLiveActivities = YES` (set in `project.yml`). A demo trigger
lives on the **Property detail** screen ("Start maintenance job").

- **Auth:** signs in against Supabase GoTrue (`/auth/v1/token`), stores the
  access/refresh tokens in the **Keychain**, and gates the app with **Face ID /
  Touch ID** (`LocalAuthentication`). The session token is sent to the backend as
  `Authorization: Bearer …`.
- **Secure Enclave:** sensitive records are sealed with a hardware-backed P-256
  key that never leaves the **Secure Enclave** (`SecureEnclaveCryptor` +
  `SensitiveVault`). Sealing is silent (public-key ECIES); revealing uses the
  private key and requires user presence (Face ID / Touch ID / passcode). Demoed
  by the "Secure note" card on the Profile screen.
- **Data:** `APIClient` calls the versioned REST API and decodes the
  `{ apiVersion, data }` envelope. On any network/auth failure it falls back to
  `DemoData` so screens stay usable.

## Multiplatform & Apple Watch

The `PRVIOEarth` target is a single multiplatform app sharing one `TabView`-based
interface (`MainTabView`) across all devices, so every screen is reused unchanged.
Mac and Vision support is enabled through `SUPPORTS_MACCATALYST` /
`SUPPORTS_*_DESIGNED_FOR_IPHONE_IPAD` in `project.yml`.

`PRVIOEarthWatch` is a standalone watchOS app (`WatchRootView`) that reuses the
shared `EstateSnapshot` to show estate health, counts and tasks across vertical
pages. It stays in sync with the paired iPhone via **WatchConnectivity**
(`WatchBridge` in `Connectivity/`, compiled into the app + watch targets only):
the iPhone pushes each new snapshot as the application context and the Watch
ingests it live (falling back to the seeded snapshot before the first sync).

## Weather (WeatherKit)

The Overview screen shows estate weather from Apple **WeatherKit** (`WeatherStore`
+ `WeatherCard`): current conditions and today's high/low for the estate
coordinates, with a demo fallback when WeatherKit is unavailable (simulator /
missing entitlement). Apple's required **attribution** (the Weather mark + the
"Other data sources" legal link) is rendered on the card.

Requires the **WeatherKit capability** on the App ID (`com.apple.developer.weatherkit`,
already in `project.yml`) and an Apple Developer Program membership. ~500k calls/
month are included; cache if you exceed it. A weather widget and device/property-
location selection are natural follow-ups.

## Backend auth

`/api/v1` accepts **both** auth schemes: the SSR cookie session (web) and an
`Authorization: Bearer <jwt>` header (this app). The token is validated against
Supabase (`auth.getUser(token)`) and every query is RLS-scoped to that user, so
the native app reads the **same live data** as the web client once you sign in
with a real account. With no configuration the app stays in demo mode.

## Continuous integration & TestFlight

`.github/workflows/apple.yml` builds the app on a **macOS runner** (XcodeGen +
`xcodebuild`, no signing) whenever `apple/**` changes, so Swift compilation is
validated in CI. It uses `latest-stable` Xcode (Xcode 26, iOS/watchOS 26 SDK).

**TestFlight** upload lives in its own workflow, `.github/workflows/testflight.yml`.
It archives the app and uploads it via the App Store Connect API key using
automatic ("cloud") signing (`-allowProvisioningUpdates`) — no certificates or
profiles are stored in the repo. Everything sensitive comes from repository
**secrets**; add all four first (repo **Settings → Secrets and variables →
Actions**):

| Secret | Purpose |
| --- | --- |
| `ASC_API_KEY_P8` | contents of the `.p8` App Store Connect API key (Admin/App Manager role) |
| `ASC_KEY_ID` | the API key's Key ID |
| `ASC_ISSUER_ID` | the App Store Connect API Issuer ID |
| `APPLE_TEAM_ID` | the 10-character Apple Developer Team ID |

> **Never paste an API key into chat, code, or a committed file** — this repo is
> public, so a key in git history is permanently exposed. Add keys only as the
> secrets above. The Team ID is read from `APPLE_TEAM_ID`, so `DEVELOPMENT_TEAM`
> in `project.yml` can stay empty.

The workflow verifies all four secrets are present (failing with a clear message
if any is missing), then derives the marketing version from the latest git tag
(`v1.4.0` → `1.4.0`) and the build number from the Actions run number. The app
record must already exist in App Store Connect for bundle id `earth.prvio.app`,
with the App Group / Push / WeatherKit capabilities enabled on the App ID.

Trigger it two ways:

- **From the Actions tab** — open the *TestFlight* workflow → **Run workflow**
  (`workflow_dispatch`).
- **By pushing the marker file** — edit/touch `.github/trigger-testflight` and
  push to `claude/prvio-earth-master-build-t2cw9c`; the `paths` filter runs the
  upload on that change alone.

### APNs secrets (Live Activity push)

The backend pushes Live Activity updates over APNs and reads these from the
**server** environment (set them where the Next.js app is deployed — never in the
client): `APNS_KEY_ID`, `APNS_TEAM_ID`, `APNS_BUNDLE_ID`, `APNS_AUTH_KEY` (the
`.p8` contents), optional `APNS_HOST`. Without them, `POST /api/v1/twin/live-activities/push`
returns `503` and local Live Activities still work. See `.env.local.example`.

## Known follow-ups (deferred)

- A native visionOS scene (spatial); Vision Pro runs the iPad layout today.

> Live Activities are push-driven end to end: the app streams `pushTokenUpdates`
> and registers each token via `POST /api/v1/twin/live-activities`; the backend
> pushes `ContentState` updates over APNs via `POST /api/v1/twin/live-activities/push`
> (migration `011`, `lib/apns.ts`). Configure the `APNS_*` env vars (see
> `.env.local.example`) to enable sending; without them the push endpoint returns
> `503` and local start/update/end still works.

> OAuth (Apple/Google via `ASWebAuthenticationSession`) and email magic-link
> sign-in are implemented with deep-link handling on the `prvio://auth-callback`
> URL scheme. Configure that redirect URL in the Supabase dashboard
> (Authentication → URL Configuration) for the flow to complete.
