# Changelog

All notable changes to PRVIO Earth are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html)
(`MAJOR.MINOR.PATCH`) as mandated by the platform versioning strategy.

## [Unreleased]

### Added
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
- **Backend foundation (Phase 2)** — migration `002_account_identity.sql` adding
  extended profile fields, `profile_social_links`, `trusted_persons`,
  `user_sessions` and an immutable `audit_log`, all RLS-protected; generated
  database types; a typed data-access layer (`lib/data/profile.ts`); and the first
  URI-versioned API route (`/api/v1/profile`, GET/PATCH) with input allowlisting
  and audit logging.

### Notes
- The client persists to `localStorage` (`prvio-store-v1`) in this prototype phase.
  Supabase auth wiring and live session/audit data are tracked on the roadmap; the
  schema, data-access layer and `/api/v1` surface are in place to receive them.

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
