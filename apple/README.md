# PRVIO Earth — Apple Native Client (Phase 8 scaffold)

This directory is the starting point for the **native SwiftUI clients** described
in the master spec (iPhone, iPad, Mac, Apple Watch, Apple Vision Pro). It is a
scaffold: it establishes the shared client layer and the WidgetKit story against
the **same versioned backend contracts** the web prototype uses, so the two
clients stay in lock-step.

> Status: scaffold / reference. There is no Swift toolchain in the web prototype's
> CI, so these sources are not built there. Open the package in Xcode 15+ (or run
> `swift build` / `swift test` locally) to compile and test `PrvioKit`.

## Layout

```
apple/
├── Package.swift                 # PrvioKit — Foundation-only shared library
├── Sources/PrvioKit/
│   ├── APIClient.swift           # Versioned REST client (/api/v1, bearer auth)
│   ├── Models.swift              # Codable models (Weather, EstateSnapshot, Profile)
│   ├── WidgetContent.swift       # Widget content model — parity with web widgets.ts
│   └── WeatherService.swift      # Example domain service on APIClient
├── Tests/PrvioKitTests/          # XCTest parity tests (formatValue, seasonal, widgets)
├── App/PrvioApp.swift            # Reference SwiftUI app entry (add to an Xcode App target)
└── Widget/EstateWidget.swift     # Reference WidgetKit extension (add to a Widget target)
```

## Architecture alignment

- **Client → Backend only.** `APIClient` talks exclusively to `/api/v1`; it never
  reaches databases, AI infrastructure or IoT devices directly — matching the
  web client and the Cross-Layer Communication Rules.
- **Versioned contracts.** Every response is the `{ apiVersion, data }` envelope;
  `APIClient.Envelope<T>` decodes it. REST paths carry the explicit `v1` major.
- **Security.** `tokenProvider` injects the Supabase session JWT (store it in the
  Keychain, Secure Enclave–backed) so backend RLS authorizes each call. Biometric
  gating (Face ID / Touch ID) and device trust are layered in the app target.
- **Shared logic, no drift.** `WidgetContent` mirrors the web
  `app/lib/widgets.ts` (`formatValue`, `seasonalChecklist`, `build`) so WidgetKit
  timelines render the same content the web Widget Gallery previews.

## Building locally

```bash
cd apple
swift build           # compile PrvioKit
swift test            # run the parity tests
```

To ship the app and widgets, create an Xcode project, add this package as a local
Swift Package dependency, then add `App/PrvioApp.swift` to the App target and
`Widget/EstateWidget.swift` to a Widget Extension target.

## Next steps (Phase 8 backlog)

- Keychain-backed session store + Supabase auth (magic-link / Sign in with Apple).
- App Intents + Live Activities (maintenance jobs, deliveries, inspections).
- Watch and Vision Pro targets reusing `PrvioKit`.
- Backend snapshot endpoint (`/api/v1/estate/snapshot`) to populate `EstateSnapshot`
  in one round-trip for widget timelines.
