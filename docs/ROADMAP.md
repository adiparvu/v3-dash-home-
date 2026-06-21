# PRVIO Earth — Delivery Roadmap

**Version:** v1.7.0
**Last updated:** 2026-06-21
**Status legend:** ✅ done · 🚧 in progress · ⏳ planned

This roadmap translates the [Product Specification](./PRODUCT_SPEC.md) into incremental,
shippable phases. The current implementation is a **Next.js + Tailwind web prototype**
with an iOS-26 "Liquid Glass" design language and a localStorage-backed client store;
backend (Supabase), AI and Digital Twin layers are scaffolded and delivered over the
phases below. Native Apple (SwiftUI) clients described in the master spec are a
future track that reuses the same versioned backend contracts.

---

## Phase 0 — Foundation (shipped)

| Item | Status |
| --- | --- |
| Next.js 14 App Router + Tailwind + Liquid Glass design system | ✅ |
| Estate surfaces (Overview, Zones, Inventory + QR, Tasks, Maintenance, Automations, Sensors, Documents, Contractors, Notifications, Search) | ✅ |
| On-device AI assistant surface | ✅ |
| Settings shell (Profile, Security, Privacy, Notifications, Units, Integrations, Appearance, Language) | ✅ |
| Supabase initial schema migration | ✅ |
| Base architecture documentation | ✅ |

## Phase 1 — Account, Identity & Documentation (current)

| Item | Status |
| --- | --- |
| Profile model: First/Last/Display name, Email, Phone, Notes | ✅ |
| Avatar Ring Color (persisted + reflected across app) | ✅ |
| Social Links with Contacts-style "+" add experience | ✅ |
| Trusted Persons with continuity permissions | ✅ |
| Membership: creation date, Member Since badge, Total Time Using | ✅ |
| Product spec, roadmap, changelog, full architecture diagram set + legend | ✅ |
| Active sessions / audit log wired to backend | ✅ |
| Auto-lock full option set (immediate → 1h → custom) persisted | ✅ |

## Phase 2 — Backend & Identity Platform (Supabase)

| Item | Status |
| --- | --- |
| Live Supabase project provisioned (eu-west-1) + migrations applied | ✅ |
| Account & Identity schema: profile fields, social links, trusted persons, sessions, audit log (`002_account_identity.sql`) | ✅ |
| RLS policies + immutable audit log + hardened function grants | ✅ |
| Typed data-access layer (`lib/data/profile.ts`) | ✅ |
| First URI-versioned REST endpoint (`/api/v1/profile`) | ✅ |
| Auth (email magic-link / OAuth) + middleware session handling | ✅ |
| Login screen, auth callback + sign-out routes | ✅ |
| Profile read/write wired to UI via `/api/v1` (RLS) with store fallback | ✅ |
| `/api/v1` routes for social links + trusted persons (GET/POST/DELETE) | ✅ |
| Active sessions + audit log wired to the Security UI (`/api/v1/profile/sessions`, `/api/v1/audit`) | ✅ |
| Estate API: `/api/v1/properties` (list/create/detail/update) + nested zones & assets (list/create) | ✅ |
| Properties list UI wired to Supabase (RLS) with demo fallback | ✅ |
| Zones & Inventory UI wired to the estate API (first property) with demo fallback | ✅ |
| Property / zone / asset **detail** screens wired to live records | ✅ |
| Active session management + device trust + revocation (live) | ✅ |

## Phase 3 — Data Privacy, Ownership & Compliance

| Item | Status |
| --- | --- |
| Granular consent management + withdrawal | ✅ |
| Right of access / portability / rectification / erasure / restriction | ✅ |
| Configurable, documented data-retention policies (schedule displayed) | ✅ |
| Structured machine-readable export + account deletion workflow | ✅ |
| GDPR / CCPA request tracking | ✅ |

## Phase 4 — Property & Estate Management

| Item | Status |
| --- | --- |
| Property value tracking (current, historical, purchase, improvements, appreciation, market notes) | ✅ |
| Contractor management (full field set + insurance + ratings + history) | ✅ |
| Ownership transfer workflow (verification, legal records, asset/document reassignment, multi-step confirmation, audit preservation) | ✅ |

## Phase 5 — Communication & Collaboration

| Item | Status |
| --- | --- |
| Household chat (direct, group, property, asset, task) | ✅ |
| Avatar ring color shown in chat / collaboration | ✅ |
| Calling integrations (Phone, FaceTime, WhatsApp, Telegram) | ✅ |

## Phase 6 — Virtual AI Assistant

| Item | Status |
| --- | --- |
| User-owned AI identity (name, avatar, personality config) | ✅ |
| Bring-your-own-model selection (UI) | ✅ |
| Retrieval-augmented estate knowledge (pgvector store + match_knowledge RPC + `/api/v1/ai/retrieve`; on-device fallback) | ✅ |
| Document understanding + summarization (backend orchestrator `/api/v1/ai/summarize` + on-device fallback) | ✅ |
| Bring-your-own-model support (custom endpoint / model / API key, persisted; active model shown in chat) | ✅ |
| AI guardrails (deny-by-default tools, prompt isolation, classification, output validation, AI audit log) | ✅ |

## Phase 7 — Digital Twin & IoT

| Item | Status |
| --- | --- |
| 2D + 3D spatial property mapping (Digital Twin map with isometric view) | ✅ |
| Telemetry ingestion + time-series representation (live sparklines) | ✅ |
| Home Assistant / IoT integration gateway surface | ✅ |
| Real-time state sync via event bus (twin_events + Supabase Realtime + `/api/v1/twin/events`; on-device fallback) | ✅ |
| Energy module — Tesla-style power flow (Live flow diagram + Energie + Impact + Powerwall/reserve/mode/tariff/off-grid) | ✅ |

## Phase 8 — Apple-Native Clients & Widgets

| Item | Status |
| --- | --- |
| **iPhone SwiftUI app foundation** (`apple/`) — XcodeGen project, shared layer (versioned `APIClient`, Codable models, GoTrue auth, Keychain), Overview / Properties / Profile screens, demo fallback | ✅ |
| Face ID / Touch ID unlock + Keychain session storage | ✅ |
| iPhone + iPad + Mac (Catalyst) + Vision Pro — one multiplatform target, adaptive layout | ✅ |
| Apple Watch app (standalone watchOS target) + WatchConnectivity live sync from iPhone | ✅ |
| Home / Lock screen widgets (WidgetKit: Property Status, Tasks) via App Group snapshot | ✅ |
| Live Activities (Lock Screen + Dynamic Island) + server-side APNs push (`/api/v1/twin/live-activities`) | ✅ |
| Secure Enclave key handling for sensitive records (hardware-backed seal/reveal) | ✅ |
| Apple WeatherKit on Overview (native `WeatherStore` + attribution) | ✅ |
| **Backend enabler:** `/api/v1` accepts `Authorization: Bearer` (native token auth) | ✅ |
| **TestFlight delivery** — macOS CI archives, signs for App Store distribution, and uploads the iPhone/iPad app (`Prv.prvio.app`) to TestFlight (`.github/workflows/testflight.yml`) | ✅ |

> **Apple client** lives under [`apple/`](../apple/) and targets **iOS/iPadOS/
> visionOS 26, watchOS 26, Swift 6, and the native SwiftUI Liquid Glass APIs**
> (Xcode 26; the iOS 27 SDK isn't on build infra yet). It's built on a macOS CI
> runner (`.github/workflows/apple.yml`) and delivered to **TestFlight**
> (`.github/workflows/testflight.yml`). `/api/v1` accepts bearer tokens (validated server-side,
> RLS-scoped), so the native app reads the **same live data** as the web once
> signed in; with no config it stays in demo mode — see
> [`apple/README.md`](../apple/README.md).

---

## Cross-cutting requirements (every phase)

- **Security & AI guardrails** — zero-trust, least privilege, tenant isolation,
  backend-enforced authorization, immutable audit logging, threat models kept as
  living artifacts (STRIDE, attack trees, abuse cases, data-flow analysis).
- **Versioning** — SemVer across APIs, event contracts, schemas, AI response
  schemas and Digital Twin models; URI versioning for REST.
- **Architecture diagrams** — updated before merging architectural changes; treated
  as documentation defects when stale (see [diagram set](./architecture/diagram-set.md)).
