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

- **Auth:** signs in against Supabase GoTrue (`/auth/v1/token`), stores the
  access/refresh tokens in the **Keychain**, and gates the app with **Face ID /
  Touch ID** (`LocalAuthentication`). The session token is sent to the backend as
  `Authorization: Bearer …`.
- **Data:** `APIClient` calls the versioned REST API and decodes the
  `{ apiVersion, data }` envelope. On any network/auth failure it falls back to
  `DemoData` so screens stay usable.

## Backend auth

`/api/v1` accepts **both** auth schemes: the SSR cookie session (web) and an
`Authorization: Bearer <jwt>` header (this app). The token is validated against
Supabase (`auth.getUser(token)`) and every query is RLS-scoped to that user, so
the native app reads the **same live data** as the web client once you sign in
with a real account. With no configuration the app stays in demo mode.

## Known follow-ups (deferred)

- Live Activities (ActivityKit), and the iPad/Mac/Watch/Vision targets.
- Magic-link / OAuth sign-in (deep-link handling); password sign-in works today.
