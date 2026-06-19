# Changelog

All notable changes to PRVIO Earth are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(`MAJOR.MINOR.PATCH`) as mandated by the platform versioning strategy.

## [Unreleased]

### Added
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

[Unreleased]: https://github.com/adiparvu/v3-dash-home-/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/adiparvu/v3-dash-home-/releases/tag/v1.0.0
