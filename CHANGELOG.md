# Changelog

All notable changes to PRVIO Earth are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(`MAJOR.MINOR.PATCH`) as mandated by the platform versioning strategy.

## [Unreleased]

## [Unreleased]

### Changed
- **Apple IA & Home redesign to match the PRVIO reference** — tab bar is now
  **Home · Twin · Tasks · Chat · You**. The **You** tab is a native inset-grouped
  settings hub (account header, Property/Account switcher, Property / App /
  Account & Security / Support sections, monochrome glyph tiles, Sign Out,
  version). **Home** is rebuilt with a property header (avatar, name, Live, health
  badge, search, notifications), a **live MapKit hero** (hybrid satellite) with the
  estate health ring, quick stat chips, and an Overview grid of summary cards.
  Estate management moved into the You → Property section; the digital-twin/monitor
  screens are the Twin tab.

## [1.10.0] — 2026-06-21

### Changed
- **Apple visual redesign — native, minimal "first-party" look** — dropped the
  Aurora/glass treatment for a clean native system aesthetic: native grouped
  background + label colors, cards on `secondarySystemGroupedBackground`, native
  capsule badges. The Estate and Monitor hubs are now **native inset-grouped
  Lists** (Settings-app style rows: white glyph on a tinted square + chevron).
  Tab bar swaps the **Assistant** tab for **Chat**; the AI assistant moves to the
  Home toolbar (alongside Settings and the profile avatar). Home hero and the
  health ring are simplified (no glow).

## [1.9.0] — 2026-06-21

### Changed
- **Apple visual redesign — "Refined Glass (Aurora)"** — a new app-wide `AuroraBackground`
  canvas (drifting teal/violet/green glows over a deep base, light/dark adaptive)
  replaces the flat background behind every screen, giving the Liquid Glass cards real
  depth. The Home hero is now a glowing glass value card and the health ring gains a
  luminous accent glow.

## [1.8.0] — 2026-06-21

### Added
- **Apple redesign — phase 3 (units & polish)** — the Units & Currency setting now
  takes effect everywhere values appear: property detail (value, purchase price,
  area, valuations), properties list, inventory and zones all format through
  `AppSettings.money`/`area`, and the assistant's value answers follow it too.
- **Apple redesign — phase 2 (navigation & IA)** — a rethought 5-tab structure:
  **Home · Estate · Tasks · Monitor · Assistant**. Estate and Monitor are new
  card-grid hubs (`EstateHubView`/`MonitorHubView`) consolidating Properties,
  Zones, Inventory, Documents, Contractors, Search and Sensors, Devices, Apple
  Home, Automations, Maintenance, Notifications. Home gains a toolbar for Profile,
  Chat and Settings (presented as sheets). `PropertiesView` no longer embeds its
  own stack so it composes inside the Estate hub.
- **Apple redesign — phase 1 (foundations & settings)** — an adaptive light/dark
  design system (semantic `Theme` colors now resolve per color scheme), a new
  `AppSettings` store, and a comprehensive **Settings hub** with four new screens:
  **Appearance** (System/Light/Dark + selectable accent color, applied app-wide),
  **Language** (System/English/Română, drives regional formatting), **Units &
  Currency** (metric/imperial + currency), and **Notifications** preferences. The
  root now applies the chosen color scheme, accent tint and locale.

## [1.7.0] — 2026-06-21

### Added
- **API rate limiting** — `middleware.ts` now enforces a per-IP fixed-window limit
  over `/api/v1` (120/min default, 20/min for `/api/v1/ai/*`) via `lib/rateLimit.ts`,
  returning `429 { error: "rate_limited" }` with `Retry-After`. Baseline abuse
  prevention (per-instance; shared-store gateway limiting tracked for Phase 2).
- **Privacy & compliance backend (real, end-to-end)** — migration `013` adds
  RLS-scoped `consents` and `privacy_requests` tables. New endpoints persist what
  was previously localStorage-only: `GET/PUT /api/v1/privacy/consents`,
  `GET/POST /api/v1/privacy/requests` (GDPR/CCPA DSARs; erasure recorded as a
  pending, audited request — never an immediate destructive action),
  `GET /api/v1/privacy/export` (structured machine-readable export of the user's
  data) and `GET /api/v1/privacy/retention`. Every consent change / request /
  export is written to the immutable audit log. A new Apple **Privacy & Data**
  screen (consent toggles, data-rights actions, server export via share sheet,
  request history, retention schedule) and the web privacy page now call these
  endpoints (server-first export, synced consents/requests).
- **App Intents & widgets (Apple)** — adds Siri / Spotlight / Shortcuts **App
  Intents** (`EstateStatusIntent` answers estate health + open tasks from the App
  Group snapshot without launching; `OpenAssistantIntent`) via `PrvioShortcuts`.
  The Property Status widget gains a **`.systemLarge`** layout showing estate
  value, stats and next maintenance; the shared snapshot now carries `estateValue`.
- **Ownership transfer (Apple)** — a multi-step Transfer Ownership workflow
  (Verify → Recipient → Assets → Confirm) on the Property detail, recording an
  auditable, immutable pending transfer request via `POST /api/v1/properties/[id]/transfer`
  (high-risk action; does not flip ownership — recipient acceptance + legal
  completion remain a separate step).
- **Property value tracking (real, end-to-end)** — migration `012` adds
  `purchase_price` / `current_value` / `market_notes` to `properties` and an
  append-only `property_valuations` history table (RLS owner-scoped). New
  `GET/POST /api/v1/properties/[id]/valuations` and the property PATCH allowlist
  cover the new fields; the Apple Property detail now shows current value,
  purchase price, appreciation %, market notes and a valuation history, with an
  "Add valuation" sheet. (Ownership transfer is the next sub-step.)
- **Apple AI Assistant — live retrieval + custom identity** — the assistant now
  answers from backend-authorized retrieval over the estate knowledge store
  (`POST /api/v1/ai/retrieve`, deny-by-default, RLS-scoped), showing a **Live** vs
  **On-device** badge and falling back to on-device estate answers when retrieval is
  empty or unconfigured. Adds a **user-owned assistant identity** (custom name,
  personality and avatar color) persisted locally via `AssistantStore`. (Voice input
  is the next sub-step.)
- **Apple communication & calling** — a new native **Chat** screen (household /
  group / property / zone / asset / task / DM rooms with a live composer) and
  **calling integrations**: from a contractor row or a DM thread, launch a Phone
  call, FaceTime Audio/Video, WhatsApp or Telegram via their URL schemes
  (`CallContact`/`CallSheet`). Chat is demo-backed (matching the web client) pending
  a multi-user chat backend.
- **Apple account & security parity** — the native app now matches the web client's
  identity surface, all backed by the existing `/api/v1/profile*` and `/api/v1/audit`
  APIs: a new **Security** screen (active sessions with revoke / "sign out others" /
  device-trust, configurable **auto-lock** Immediately→1h enforced on scene phase,
  login-alerts toggle, and the audit log), plus **Social Links** (iOS-style add sheet
  across the 10 supported platforms) and **Trusted Persons** (with permission
  selection) on the Profile screen, a Member-Since badge, and phone/notes display.
- **Apple Home (HomeKit) integration** — a new native "Apple Home" screen lists the
  accessories from the user's HomeKit homes (name, room, category, reachability) and
  toggles power for accessories that support it, via `HMHomeManager` in `HomeKitStore`.
  Falls back to demo accessories when HomeKit is unavailable, unauthorized or empty,
  and is a demo-only stub on Mac Catalyst (where HomeKit is unavailable). Adds the
  `com.apple.developer.homekit` entitlement and `NSHomeKitUsageDescription`.

## [1.6.0] — 2026-06-21

### Added
- **Full native screen parity with the web client** — the Apple app's More hub now
  exposes every estate area as a native screen: Zones, Inventory, Maintenance,
  Notifications, Automations, Sensors, Devices, Documents, Contractors, Search and
  the AI Assistant, alongside the existing Overview/Properties/Tasks/Profile tabs.
- **Apple Watch app shipped in the build** — the watchOS companion app is embedded
  in the iOS archive, so it is delivered to TestFlight together with the iPhone app.
- **Live operations endpoints** — four new read APIs back the formerly demo-only
  screens, each scoped to the owner's property by Row Level Security and returning
  the platform's `{ apiVersion, data }` envelope:
  - `GET /api/v1/tasks`
  - `GET /api/v1/maintenance` (status derived from `next_due_at`; asset names resolved)
  - `GET /api/v1/documents` (human-readable file sizes)
  - `GET /api/v1/contractors`
  A shared `lib/data/operations.ts` repository mirrors `lib/data/estate.ts`.

### Changed
- **Tasks, Maintenance, Documents and Contractors screens are now live** — they
  fetch from the new endpoints through `CollectionsStore` and show the
  **Synced** badge, falling back to demo data (with the **Demo** badge) whenever
  the backend is unreachable or returns no rows.

## [1.5.0] — 2026-06-21

### Added
- **First TestFlight delivery of the Apple client** — the native iPhone/iPad app
  (bundle id `Prv.prvio.app`) now archives, signs for App Store distribution, and
  uploads to **TestFlight** end to end on a macOS runner. Adds a dedicated,
  fully secret-driven workflow `.github/workflows/testflight.yml` (App Store
  Connect API key auth via `ASC_API_KEY_P8` / `ASC_KEY_ID` / `ASC_ISSUER_ID` and
  `APPLE_TEAM_ID`), triggerable from the Actions tab or by the
  `.github/trigger-testflight` marker file. Nothing credential-related lives in
  the repo; a gate fails clearly if any secret is missing.
- **App icon** — a 1024×1024 opaque (no-alpha) `AppIcon` asset (estate "glass
  globe"), from which Xcode derives every required size.

### Changed
- **App Store–ready packaging** — `aps-environment` set to `production` (so
  automatic signing selects an App Store Distribution profile that needs no
  registered devices), the archive is built unsigned with distribution signing
  applied at export, and the bundle identifiers move to `Prv.prvio.app`
  (`.widgets` / `.watchkitapp`). `apple.yml` now only validates Swift
  compilation; the TestFlight upload lives in its own workflow.

### Fixed
- **Apple binary validation** — added the missing `CFBundleIconName` Info.plist
  key and the full set of iPad `UISupportedInterfaceOrientations~ipad`
  (portrait, upside-down, both landscapes) required for iPad multitasking, so the
  uploaded build passes App Store Connect validation.

## [1.4.0] — 2026-06-21

### Added
- **Apple WeatherKit on the Apple client** — the Overview screen shows estate
  weather (current conditions + today's high/low) from **WeatherKit**
  (`WeatherStore` + `WeatherCard`), with the required Apple Weather attribution
  (mark + "Other data sources" legal link) and a demo fallback when WeatherKit is
  unavailable. Adds the `com.apple.developer.weatherkit` capability. Requires an
  Apple Developer membership with WeatherKit enabled.

## [1.3.0] — 2026-06-21

### Fixed
- **Apple build green on macOS CI (Swift 6 / iOS 26 SDK)** — fixed the issues the
  new macOS build surfaced: made `APIClient` `Sendable` (`@Sendable` token closure)
  to satisfy Swift 6 strict concurrency, constructed `SensitiveVault` inside the
  detached reveal task, and replaced the regular-width `NavigationSplitView` sidebar
  (whose `List(_:selection:)` initializer is unavailable on iOS) with a `TabView`
  shared across all devices.

### Changed
- **Apple deployment target lowered to 26** — v1.2.0 set iOS/watchOS/visionOS to
  27, but the iOS 27 SDK isn't available on CI / TestFlight build infrastructure
  (GitHub macOS runners ship Xcode 26). Targets are now **iOS/iPadOS/visionOS 26
  and watchOS 26** so the app builds and is TestFlight-able today; Swift 6 and the
  native Liquid Glass APIs are unaffected.

### Added
- **Apple build in CI + TestFlight workflow** — `.github/workflows/apple.yml` builds
  the native client on a **macOS runner** (XcodeGen + `xcodebuild`, no signing) on
  any `apple/**` change, validating Swift compilation in CI; a manual job archives
  and uploads to **TestFlight** via an App Store Connect API key. Builds with Xcode 26.
- **Server-side APNs sender for Live Activities** — completes the push loop. New
  migration `011_live_activities.sql` (RLS-scoped token store), DAL
  (`lib/data/liveActivities.ts`), an APNs helper (`lib/apns.ts`: ES256 provider
  JWT + HTTP/2 sender + pure payload builders, unit-tested) and versioned routes:
  `POST /api/v1/twin/live-activities` registers a push token and
  `POST /api/v1/twin/live-activities/push` pushes a `ContentState` update/end
  (returns `503` until the `APNS_*` env vars are set). The iOS `LiveActivityManager`
  now registers its token with the backend. Migration `011` has been applied to the
  live project.

## [1.2.0] — 2026-06-21

### Added
- **Phase 8 — push-ready Live Activities (APNs token)** — Live Activities are now
  requested with `pushType: .token` and `LiveActivityManager` streams
  `pushTokenUpdates`, capturing the per-activity APNs token for backend-driven
  updates. Adds the `aps-environment` entitlement and the `remote-notification`
  background mode. (The server-side APNs sender is the remaining piece.)
- **Phase 8 — OAuth & magic-link sign-in (Apple client)** — the native app now
  matches the web's auth options: **Apple / Google OAuth** via
  `ASWebAuthenticationSession` and **email magic link**, both completed through a
  `prvio://auth-callback` deep link (`onOpenURL`). Tokens are parsed from the
  callback (JWT claims decoded for the user id/email) into the Keychain session;
  password sign-in still works.
- **Apple client targets the latest stack (iOS 27 / Swift 6 / native Liquid Glass)**
  — bumped the deployment targets to **iOS/iPadOS/visionOS 27 and watchOS 27**,
  Swift **6.0**, and replaced the material-based glass approximation with the native
  SwiftUI **Liquid Glass** API (`.glassEffect`). Requires Xcode 27.
- **Phase 8 — Apple Watch live sync (WatchConnectivity)** — the Watch app now stays
  in sync with the paired iPhone. A `WatchBridge` (`Connectivity/`, app + watch
  targets only) pushes each new `EstateSnapshot` as the WatchConnectivity
  application context; the Watch ingests it live (seeded snapshot until first sync).
- **Phase 8 — Secure Enclave for sensitive records** — hardware-backed encryption
  in the Apple client: `SecureEnclaveCryptor` generates a P-256 key that never
  leaves the **Secure Enclave** and seals/unseals data via ECIES; `SensitiveVault`
  persists sealed records at rest with complete file protection. Sealing is silent
  (public key); revealing uses the private key and requires **user presence**
  (Face ID / Touch ID / passcode). Demoed by a "Secure note" card on the Profile
  screen. Completes the last core Phase 8 item.

### Changed
- **Release pipeline made generic** — replaced the one-shot v1.1.0 release workflow
  with a reusable, **tag-driven** `Release` workflow (`on: push: tags: v*`, plus a
  manual `workflow_dispatch`). It derives the version from the tag and extracts the
  matching `## [x.y.z]` section from `CHANGELOG.md` for the release notes, using the
  built-in `GITHUB_TOKEN`.

## [1.1.0] — 2026-06-21

### Added
- **Phase 8 — multiplatform (iPad / Mac / Vision Pro) + Apple Watch** — the
  `PRVIOEarth` target now builds for **iPhone + iPad + Mac Catalyst + Vision Pro**
  from one codebase, with an adaptive layout (tab bar on iPhone, `NavigationSplitView`
  sidebar on regular widths). A new standalone **watchOS** target
  (`PRVIOEarthWatch`) reuses the shared `EstateSnapshot` to show estate health,
  counts and tasks across vertical pages. All targets share the code under
  `apple/Shared/`.
- **Phase 8 — Live Activities (ActivityKit)** — in-progress estate jobs
  (maintenance / delivery / inspection / incident) surface on the **Lock Screen**
  and **Dynamic Island** (compact / minimal / expanded). `MaintenanceActivityAttributes`
  (shared, with a live `ContentState` of status / progress / ETA) is driven by a
  `LiveActivityManager` (start / update / end) in the app and rendered by
  `MaintenanceLiveActivity` in the widget extension. Enabled via
  `NSSupportsLiveActivities`; a demo trigger lives on the Property detail screen.
- **Phase 8 — WidgetKit extension (`apple/PRVIOEarthWidgets`)** — Home Screen
  (`systemSmall`/`systemMedium`) and Lock Screen (`accessoryCircular`/
  `accessoryRectangular`/`accessoryInline`) widgets: **Property Status** (health
  ring, zones, objects) and **Tasks & Maintenance** (open tasks, next due). The app
  publishes a compact `EstateSnapshot` to a shared **App Group**
  (`group.earth.prvio.app`) via `SharedStore`, which triggers a WidgetKit reload;
  the widget reads it with no network in-process. XcodeGen wires the extension
  target, App Group entitlements and snapshot bridge.
- **Bearer-token auth for `/api/v1` (native enabler)** — the backend now accepts
  `Authorization: Bearer <jwt>` in addition to the SSR cookie session, so the
  native Apple client (and any token-based client) uses the **same versioned API**
  and RLS isolation as the web app. `createClient()` scopes every PostgREST/RPC
  request to the bearer user; `currentUserId()` validates the token via
  `auth.getUser(token)` (fail-closed on forged tokens). Pure header parsing lives
  in `lib/supabase/auth-header.ts` with unit tests. Verified live: requests with a
  forged bearer return `401` (not `500`).
- **Phase 8 — iPhone SwiftUI app foundation (`apple/`)** — the first native Apple
  client, reusing the same versioned backend contracts as the web app. Includes an
  XcodeGen project (`project.yml`), a shared layer (versioned `APIClient` that
  decodes the `{ apiVersion, data }` envelope and sends `Authorization: Bearer`;
  Codable models matching `/api/v1`; Supabase **GoTrue** sign-in; **Keychain**
  session storage; **Face ID / Touch ID** unlock via `LocalAuthentication`), a
  Liquid-Glass design system, and Overview / Properties / Profile screens with an
  offline **demo-data** fallback. Built in Xcode on macOS (not compiled in the
  Linux CI). Authenticates via Supabase today; reading live estate data needs the
  deferred backend Bearer enabler. See [`apple/README.md`](apple/README.md).

- **End-to-end smoke tests (Playwright)** — a runtime test suite (`e2e/smoke.spec.ts`)
  that builds and starts the app and drives the key surfaces in a real browser
  (Overview, Zones, Inventory, Tasks, More, Settings, a zone detail, the Digital
  Twin Energy module, AI assistant and Login), plus a bottom-navigation flow.
  Runs in localStorage prototype mode (no backend), added as a dedicated **CI job**
  (`npm run test:e2e`) alongside the existing lint / unit-test / build pipeline.
  This complements the vitest unit tests by verifying routing and rendering at
  runtime, not just at build time.
- **Platform hardening & connect-up** — wired the new smart-home surfaces to the
  live feed and persisted their controls: the **floorplan** now derives room
  power from the live house load (Live/Simulat badge) and HVAC/lights/doors/music
  controls persist in the store (shared with the House sheet). The AI summarizer
  now **actually calls a bring-your-own model** server-side (moderated, on-device
  fallback). Added migration **006** (`device_registry`, `presence_events`,
  `automation_schedules`, RLS) with a DAL + `GET /api/v1/twin/devices`. A **live
  alerts pipeline** (`deriveAlerts`) surfaces energy/twin alerts in the
  notifications center, and a **visual automation builder** (`/automations/builder`)
  composes When→Where→Then rules with a live preview. Quality: **vitest unit
  tests + GitHub Actions CI**, a refreshed **architecture diagram set** (Energy &
  Smart-Home) and a **STRIDE threat model**. The app is now an installable **PWA**
  (manifest + icon) and the Energie tab can **export a CSV** energy report.
- **Home-Assistant-inspired smart-home features** — a batch of additions drawn
  from the awesome-home-assistant ecosystem: **interactive floorplan**
  (`/twin/floorplan`) with live per-room overlays (power, temperature,
  **presence** avatars), **mushroom-style quick-control chips** and tap-a-room
  detail; **solar forecast** (clear-sky predicted vs actual on the Solar sheet);
  **dynamic tariff** with a cheapest-window highlight and a **"charge when
  cheap"** toggle (`energy.chargeWhenCheap`); an **OCPP charging-session** card
  on the EV node (connector, energy delivered, duration, cost); **Powercalc**
  virtual per-device wattage in the House breakdown; **HVAC + heat-pump climate
  control** (setpoint, mode, schedule) in the House sheet; **protocol + Local/
  Cloud badges** (Matter/Thread/Zigbee/Z-Wave/Wi-Fi) on the Home Assistant
  gateway device list; and an Automations **scheduler timeline** + **area
  grouping** filter.

- **Live detail screens & device trust (Phase 2)** — the **Property** detail
  (`/properties/[id]`) now loads the live record via a new `useProperty(id)` hook
  (name, location, area, active) with a **Synced/Demo** badge; the **Zone**
  (`/zones/[slug]`) and **Asset** (`/inventory/[id]`) detail screens resolve
  remote records via `useZones`/`useAssets` so API-loaded items open (no more
  404), each badged Synced/Demo with seed/store fallback. Active sessions gain
  **device trust**: `setSessionTrust` + `PATCH /api/v1/profile/sessions/[id]`
  (`{ trusted }`, audited), surfaced in the Security screen as a Trusted badge
  and a Trust/Untrust toggle alongside Revoke / Sign out all.
- **AI document orchestrator & bring-your-own-model (Phase 6)** — a backend
  document-understanding orchestrator (`POST /api/v1/ai/summarize`) produces the
  grounded, schema-validated summary server-side under guardrails with audit;
  the Documents AI Summary sheet prefers it and falls back to the on-device
  summarizer (Backend AI / On-device badge). **Bring-your-own-model** is now
  supported end to end: the assistant config persists a custom endpoint, model
  name and API key (on device); the assistant settings show a BYO panel with a
  readiness indicator, and the AI chat header shows the active model
  (`via …` + setup-needed hint).

- **Energy flow animation, node analytics & live event bus** — the `/twin/energy`
  **Live** diagram now animates real-time power flows: a canvas streams glowing
  particles along each connection with count, speed and brightness ∝ kW and
  direction from the live state (solar supplies, house/EV consume, battery
  charge/discharge, grid import/export); idle flows dim and stop. Each node is
  tappable → a detail sheet (Solar production; Powerwall SOC + animated fill,
  charge/discharge, runtime, temperature, health; Porsche EV % + charging pulse,
  speed, time-to-full; House load with consumer **and room-level** breakdowns;
  Grid import/export, price, peak, tariff). Readings are wired to a real event
  bus: `useEnergyLive` subscribes to the **`prvio-energy` Supabase Realtime**
  broadcast channel (falling back to the on-device simulation; a Live/Simulat
  badge shows the source), `POST /api/v1/twin/energy` publishes to it and
  appends to a durable **`energy_readings`** time-series (migration `005`, RLS),
  `GET …?history` returns it, and `scripts/energy-publisher.mjs` simulates the
  gateway. The Powerwall sub-tab shows a live status card from the same feed.
- **Energy module (Tesla-style)** — a new `/twin/energy` surface modelled on the
  Tesla app's energy section, with four sub-tabs: **Live** (a photoreal 3D render
  of the estate energy system — solar roof, Powerwall, Porsche EV under carport
  and grid — an **exact clone of the estate render** (clean plate) with only the
  readings live (Solar, Home, Powerwall %, Porsche charge + car battery, grid),
  overlaid as plain labels with leader lines matching the reference's text,
  colours and positions), **Energie** (monthly usage
  bar chart + "Utilizat din" source breakdown), **Impact** (autonomy donut,
  time-of-use split, solar value, solar offset, backup-outage history) and
  **Powerwall** (backup-reserve slider, operational mode, Tibber tariff graph,
  off-grid runtime and storm watch). Backed by a framework-free model
  (`app/lib/twin/energy.ts`) with a live power-balance simulation; Powerwall
  preferences (reserve, mode, off-grid, storm watch) persist in the store.
  Linked from the Digital Twin and More → Monitoring.
- **Chat breadth & avatar ring color (Phase 5)** — household chat now spans all
  spec channel types: Group, **Property**, Zone, **Asset** and **Task** channels
  (plus Direct Messages), each with seeded threads and a typed header badge. The
  signed-in user's messages now show their avatar with the **selected ring color**
  from their profile, carrying avatar-ring identity into chat/collaboration.
- **Backend promotion of prototype layers** — migration
  `004_ai_knowledge_and_twin.sql` adds a **pgvector `knowledge_chunks`** store
  with a backend-authorized, RLS + ownership-checked `match_knowledge` similarity
  RPC, and a durable **`twin_events`** table published over Supabase Realtime.
  New DAL (`lib/data/ai.ts`, `lib/data/twin.ts`), versioned routes
  (`/api/v1/ai/retrieve`, `/api/v1/twin/events`) with auth + audit, and generated
  types. The AI assistant now prefers the **backend retrieval store** (falling
  back to the on-device retriever, shown via a source badge), and the Digital
  Twin seeds from and durably appends to the **backend event bus** when
  configured (falling back to the on-device simulation).
- **3D Digital Twin view** — the twin map gains a 2D/3D toggle with an isometric,
  health-extruded perspective of the estate.
- **Digital Twin (Phase 7)** — a new `/twin` surface with a 2D spatial estate
  map (zones positioned on a normalized canvas with live status dots), live
  telemetry that ticks every 2s with per-sensor time-series sparklines, a
  real-time **State Events** feed (event-bus stand-in emitting on status
  transitions), and a normal/drifting/alert status strip. Tap a zone to filter
  its telemetry. Backed by a framework-free model in `app/lib/twin/telemetry.ts`.
- **Home Assistant / IoT integration gateway** — a new
  `/settings/integrations/home-assistant` gateway screen showing connection
  status, the IoT→Gateway→Backend→Twin sync flow, a connected-device/entity list
  with online state and last-seen, and a sync action — reflecting backend-managed
  contracts (clients never talk to IoT directly). Linked from Integrations, the
  Digital Twin, and the property detail Zones/Parcels tab.
- **Contractor management — full field set** — contractors now carry the complete
  spec field set: Company Name, Contact Person, Phone, Email, Website, Services,
  Notes, Documents, Insurance Records, Ratings and Property History. A new
  contractor detail sheet surfaces all of it (with Call/Email/Website actions and
  the multi-service call menu), and the add composer captures email, website,
  services and insurance. (Storage key bumped to `prvio-contractors-v2`.)
- **Document understanding & summarization** — a new `app/lib/ai/documents.ts`
  produces grounded, schema-validated summaries (summary, key points, extracted
  details + retention) with document content treated as untrusted and output
  moderated. The Documents screen gains a per-document ✨ AI Summary sheet; each
  run is recorded in the AI decision audit log.
- **Ownership Transfer workflow** — a high-risk, multi-step wizard at
  `/properties/transfer` covering ownership verification, recipient + legal
  confirmation records, asset/zone reassignment, document transfer, a
  type-to-confirm (`TRANSFER`) final step, and preserved audit history. Transfer
  records persist in the store and are listed back; entry points added from the
  property detail Overview and Settings → Estate.
- **AI guardrails & retrieval layer** — new `app/lib/ai/guardrails.ts` (treats
  every prompt as untrusted: prompt-injection/policy-probe/high-risk
  classification, deny-by-default allowlisted tools, output moderation, AI
  Must/Must-Never policy) and `app/lib/ai/retrieval.ts` (scope-controlled,
  deny-by-default retrieval over estate knowledge with provenance). The AI
  assistant now classifies each message, refuses injection/policy probes,
  routes high-risk actions to a human-approval workflow, grounds answers in
  retrieved sources (shown inline), and logs every decision. A new
  **AI Guardrails** screen (`/settings/ai-guardrails`) surfaces the policy,
  allowlisted tools and the AI decision audit log.
- **Auto-Lock configuration** — the Security screen now exposes the full mandated
  option set (Immediately, 30s, 1m, 5m, 15m, 30m, 1h, Custom minutes) via a picker
  sheet, plus Touch ID, Passcode Lock and Suspicious Activity toggles. All device
  security preferences persist in the store (`SecurityPrefs`).
- **Privacy, Ownership & Compliance center** — the Privacy & Data screen now
  implements granular **consent management** (analytics, crash reports,
  personalization, AI processing, marketing) with timestamped withdrawal; a
  **data-subject request** workflow covering Right of Access, Data Portability,
  Correction, Erasure, Restriction and Objection under GDPR/CCPA, with a tracked
  **request history** (submitted/in-review/completed) persisted in the store; a
  displayed **data-retention schedule** by data category; and a structured,
  machine-readable export.
- **Calling integrations** — a reusable `CallMenu` deep-links to Standard Phone
  Call, FaceTime Audio/Video, WhatsApp Audio/Video and Telegram Audio/Video via
  their URL schemes. Wired into the Contractors cards (Call) and Direct-Message
  chat headers (spec: Communication & Collaboration → Calling Integrations).
- **Account & Identity** — full profile model backed by the persisted client store:
  First Name, Last Name, Display Name, Email, Phone, Notes.
- **Avatar Ring Color** — user-selectable ring, persisted and reflected across the
  Profile screen, the Settings profile card, and (forthcoming) chat/collaboration.
- **Social Links** — iOS Contacts-style "+" add experience supporting Facebook,
  Instagram, X, Threads, LinkedIn, TikTok, YouTube, Telegram, WhatsApp and Custom links.
- **Trusted Persons** — assign one or more trusted persons with continuity
  permissions (emergency access, ownership transfer, recovery approvals, estate continuity).
- **Membership** — Account Creation Date, Member Since badge and Total Time Using PRVIO.
- **Documentation foundation** — product specification (`docs/PRODUCT_SPEC.md`),
  phased delivery roadmap (`docs/ROADMAP.md`), architecture diagram set
  (`docs/architecture/diagram-set.md`) and diagram legend / notation guide
  (`docs/architecture/diagram-legend.md`).
- **Virtual AI Assistant configuration** — user-owned AI identity (custom name,
  avatar, personality), bring-your-own-model selection and voice toggle, persisted
  in the store and reflected in the assistant chat surface.
- **Property Value Tracking** — the property "Value" tab now shows current value
  with a historical sparkline, purchase price, improvements, estimated
  appreciation, a year-by-year historical breakdown and market notes (spec §6).
- **Backend foundation (Phase 2)** — migration `002_account_identity.sql` adding
  extended profile fields, `profile_social_links`, `trusted_persons`,
  `user_sessions` and an immutable `audit_log`, all RLS-protected; generated
  database types; a typed data-access layer (`lib/data/profile.ts`); and the first
  URI-versioned API route (`/api/v1/profile`, GET/PATCH) with input allowlisting
  and audit logging.
- **Authentication (Phase 2)** — Supabase SSR auth: a `/login` screen (email
  magic-link + Apple/Google OAuth), `/auth/callback` and `/auth/signout` route
  handlers, and Next.js middleware that refreshes the session and gates the app.
  All auth is guarded behind `isSupabaseConfigured()` so the app still runs in the
  localStorage prototype mode when no Supabase env vars are present.

- **Live Supabase backend** — provisioned a dedicated project (eu-west-1) and
  applied migrations `001`–`003`; added `003_harden_function_grants.sql` to revoke
  the REST RPC surface from trigger-only `SECURITY DEFINER` helpers (security
  advisors 0028/0029). README documents the env setup.

- **Profile wired to Supabase** — the Edit Profile screen now reads and writes
  through the versioned `/api/v1/profile` endpoints (incl. new `social-links` and
  `trusted-persons` POST/DELETE routes) via a `useProfile` hook that falls back to
  the localStorage store when Supabase is unconfigured or the visitor is signed
  out. A "Synced / Local" badge shows the active source. Verified end-to-end
  against the live project: unauthenticated requests return `401`, and middleware
  redirects protected routes to `/login`.
- **Security wired to Supabase** — the Security screen's Active Sessions and Audit
  Log now load from `/api/v1/profile/sessions` and `/api/v1/audit` via a
  `useSecurity` hook, with working per-session revoke and "sign out all others"
  (DELETE routes), falling back to demo data when signed out. New data-access
  helpers `revokeOtherSessions` and `listAuditLog`.
- **Estate wired to Supabase** — new `lib/data/estate.ts` and versioned routes:
  `/api/v1/properties` (GET list / POST create), `/api/v1/properties/[id]`
  (GET / PATCH), and nested `/zones` and `/assets` (GET list / POST create), all
  RLS-scoped and audited. The Properties list screen now renders from
  `/api/v1/properties` via a `useProperties` hook (computed portfolio summary),
  falling back to the demo estate when signed out.
- **Zones & Inventory wired to Supabase** — `useZones` and `useAssets` hooks load
  the first property's zones/assets from the estate API and render them in the
  Zones and Inventory screens (with data-driven inventory stats and "Synced /
  Demo" badges), falling back to the seed + store data when signed out or empty.

### Notes
- Without Supabase env vars the client still persists to `localStorage`
  (`prvio-store-v1`). When configured, profile data is server-authoritative;
  wiring the remaining surfaces (properties, sessions, audit UI) is the next step.

### Changed
- **Floorplan (spatial Digital Twin) disabled for now** — added a central feature
  flag (`app/lib/features.ts`, `FEATURES.floorplan = false`). The Floorplan entry
  in More → Monitoring and the "Open Floorplan" deep links (Home Assistant
  integration, property detail) are now hidden, and the `/twin/floorplan` route
  guards itself (redirects to `/more`). Fully reversible by flipping the flag.
  The **Energy** module (`/twin/energy`) is intentionally unaffected and stays live.

### Verified / Documented
- **Live backend verification** — verified the live Supabase project end to end:
  migrations `001`–`010` applied, RLS enabled on all 28 tables, runtime auth
  gating (`401` on `/api/v1/*`, `307`→`/login` on protected routes) and
  fail-closed RLS confirmed via direct PostgREST. Documented the results and an
  **`owns_property` guardrail** in the threat model warning that the `0029`
  advisor on `owns_property` / `match_knowledge` is intentional and must not be
  "fixed" (revoking `EXECUTE` from `authenticated` would break every
  property-scoped RLS policy). Refreshed the stale threat-model open items.

## [1.0.0] — 2026-06-17

### Added
- Initial PRVIO Earth dashboard prototype (Next.js 14 App Router, Tailwind, iOS-26
  "Liquid Glass" design language).
- Estate surfaces: Overview, Zones (forest, greenhouse, orchard, lake, garden, house,
  driveway, smart home, smart pond, more), Inventory with QR lookup, Tasks,
  Maintenance, Automations, Sensors, Documents, Contractors, Notifications, Search.
- On-device AI assistant surface with estate-aware responses.
- Settings: Profile, Security (sessions, audit log), Privacy & Data, Notifications,
  Units, Integrations, Appearance, Language, Onboarding.
- Supabase initial schema migration (`supabase/migrations/001_initial_schema.sql`)
  and base architecture documentation (`docs/architecture/system-overview.md`).

[Unreleased]: https://github.com/adiparvu/v3-dash-home-/compare/v1.4.0...HEAD
[1.4.0]: https://github.com/adiparvu/v3-dash-home-/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/adiparvu/v3-dash-home-/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/adiparvu/v3-dash-home-/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/adiparvu/v3-dash-home-/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/adiparvu/v3-dash-home-/releases/tag/v1.0.0
