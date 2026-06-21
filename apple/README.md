# PRVIO Earth — Apple client (SwiftUI)

Native Apple front-end for PRVIO Earth. It reuses the **same versioned backend
contracts** as the web client (`/api/v1`, `{ "apiVersion": "1.0.0", "data": … }`)
and the same Supabase identity, so the estate, profile and security data are
shared across platforms.

**Phase 8** covers the native Apple clients. Targets:

- **PRVIOEarth** — one multiplatform app: **iPhone + iPad + Mac (Catalyst) +
  Vision Pro**, with an adaptive layout (tab bar on iPhone, sidebar split view on
  regular widths).
- **PRVIOEarthWidgets** — WidgetKit widgets + Live Activities.
- **PRVIOEarthWatch** — Apple Watch app.

All share the code under `Shared/` and the design system.

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
- **Data:** `APIClient` calls the versioned REST API and decodes the
  `{ apiVersion, data }` envelope. On any network/auth failure it falls back to
  `DemoData` so screens stay usable.

## Multiplatform & Apple Watch

The `PRVIOEarth` target is a single multiplatform app. `MainTabView` adapts via the
horizontal size class — a `TabView` on iPhone, a `NavigationSplitView` sidebar on
iPad / Mac Catalyst / Vision Pro — so all screens are reused unchanged. Mac and
Vision support is enabled through `SUPPORTS_MACCATALYST` /
`SUPPORTS_*_DESIGNED_FOR_IPHONE_IPAD` in `project.yml`.

`PRVIOEarthWatch` is a standalone watchOS app (`WatchRootView`) that reuses the
shared `EstateSnapshot` to show estate health, counts and tasks across vertical
pages. It currently renders the demo snapshot on-watch; WatchConnectivity sync from
the paired iPhone is a follow-up.

## Backend auth

`/api/v1` accepts **both** auth schemes: the SSR cookie session (web) and an
`Authorization: Bearer <jwt>` header (this app). The token is validated against
Supabase (`auth.getUser(token)`) and every query is RLS-scoped to that user, so
the native app reads the **same live data** as the web client once you sign in
with a real account. With no configuration the app stays in demo mode.

## Known follow-ups (deferred)

- WatchConnectivity sync (paired-iPhone → Watch); the Watch shows demo data today.
- Push-updated Live Activities (APNs); local start/update/end works today.
- Magic-link / OAuth sign-in (deep-link handling); password sign-in works today.
- A native visionOS scene (spatial); Vision Pro runs the iPad layout today.
