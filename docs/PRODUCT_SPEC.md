# PRVIO Earth — Product Specification

**Version:** v1.0.0
**Last updated:** 2026-06-18
**Status:** Living document — the canonical source of truth for product scope.

> PRVIO Earth is a premium **private estate operating system**: a private property,
> asset, maintenance, communication and digital-twin platform centered around a
> single owner and their trusted collaborators. The product is designed to feel like
> a first-party Apple experience, privacy-first and secure by default, integrating
> deeply with the Apple ecosystem.

The reference implementation in this repository is a **web prototype** (Next.js +
Tailwind, iOS-26 "Liquid Glass" design language). Apple-native SwiftUI clients are a
future track that consumes the same versioned backend contracts. See
[ROADMAP.md](./ROADMAP.md) for phasing and [architecture](./architecture/) for diagrams.

---

## 1. Experience principles

- Feel like a first-party Apple experience.
- Privacy by design; security by default.
- Simplicity and usability above all.
- Deep Apple-ecosystem integration.

## 2. Account, Security & Identity

**Profile fields:** First Name, Last Name, Display Name, Email, Phone, Avatar,
Avatar Ring Color (selectable, visible across chat/collaboration), Notes, Social Links.

**Social links** (Contacts-style "+" add): Facebook, Instagram, X, Threads, LinkedIn,
TikTok, YouTube, Telegram, WhatsApp, Custom links.

**Membership:** Account Creation Date, Member Since badge, Total Time Using PRVIO.

**Trusted Persons:** one or more, eligible for emergency access, ownership transfer
requests, recovery approvals and estate-continuity permissions.

**Active Sessions:** view device name, platform, location (when available), last
activity. Sign out individual sessions, sign out all, revoke compromised devices.

**Security controls:** Face ID, Touch ID, Passcode lock, end-to-end encryption for
sensitive records, device trust management, login alerts, suspicious-activity
detection, session monitoring, audit logs.

**Auto-lock options:** immediately, 30s, 1m, 5m, 15m, 30m, 1h, custom.

## 3. Data Privacy, Ownership & Compliance

- Privacy by design / by default: collect only what is necessary, transparent
  processing, granular consent, minimized third-party sharing, encryption in transit
  and at rest, audit trails for sensitive access.
- **Regulatory:** GDPR, CCPA and future regulations — consent tracking/withdrawal,
  right of access, portability, rectification, erasure, restriction, objection,
  verified consumer requests, clear notices, DPA support, regional handling.
- **Retention:** configurable per-category policies, manual deletion (unless legally
  restricted), automatic purge of expired data, audit-log retention, preservation of
  legally required and ownership-transfer records, visible schedules, secure archival
  and permanent deletion workflows.
- **Ownership:** user-generated content, estate records, documents, communications,
  digital-twin data and AI knowledge bases remain owned by the user unless explicitly
  transferred. Machine-readable exports and full account deletion are supported.
  Data is never sold; AI never claims ownership of user content.

## 4. Widgets & iOS Experience

- **Home Screen widgets** (Small/Medium/Large): Tasks, Property Status, Weather,
  Seasonal Checklist, Maintenance Due, Property Value, Security Overview.
- **Lock Screen widgets:** Property Status, Open Tasks, Weather Alerts, Security
  Alerts, Seasonal Reminders.
- **Notification Center widgets:** maintenance reminders, security events, property
  updates, seasonal tasks, automation status.
- **Live Activities:** active maintenance jobs, deliveries, security incidents,
  property inspections.

## 5. Virtual AI Assistant

User-owned AI identity with custom name, avatar and personality; estate-knowledge
integration; property-specific memory; maintenance assistance; seasonal
recommendations; document understanding; voice interaction. The architecture must let
users **bring their own future AI models** without platform redesign.

## 6. Property & Estate Management

- **Property transfer:** ownership verification, legal confirmation records, asset
  reassignment, document transfer, audit-history preservation.
- **Contractor management:** Company Name, Contact Person, Phone, Email, Website,
  Services, Notes, Documents, Insurance Records, Ratings, Property History.
- **Property value tracking:** current value, historical value, purchase price,
  improvements, estimated appreciation, market notes.

## 7. Communication & Collaboration

- **Household chat:** direct messages, group chats, property chats, asset chats, task chats.
- **Calling integrations:** Phone, FaceTime Audio/Video, WhatsApp Audio/Video,
  Telegram Audio/Video — launching the corresponding installed service.

## 8. System Architecture

Four clearly separated layers; see [architecture/diagram-set.md](./architecture/diagram-set.md).

- **Client Layer** — Apple/SwiftUI + web clients. Auth & session, local caching,
  offline-first, widgets/Live Activities/App Intents, digital-twin visualization,
  secure document viewing. Communicates **only** through versioned backend APIs;
  never touches databases, AI infra or IoT directly.
- **Backend Layer** — system of record: identity & access, property/asset/maintenance/
  communication/document services, workflow orchestration, audit & compliance,
  integration management, event routing, persistence abstraction. Exposes versioned
  APIs; publishes/consumes domain events; enforces authorization.
- **AI Layer** — assistant orchestration, retrieval-augmented estate knowledge,
  document understanding, recommendations, anomaly detection, NL interfaces, BYO
  model. Receives authorized requests from backend only; least-privilege access.
- **Digital Twin Layer** — 3D visualization, spatial asset mapping, telemetry,
  infrastructure modeling, simulation, geospatial relationships, real-time state.
  Receives authoritative data from backend; syncs with Home Assistant/IoT via
  backend-managed contracts.

**Cross-layer rules:** Client → Backend only; Backend ↔ AI via secured contracts;
Backend ↔ Digital Twin via events; Backend ↔ external via integration gateways; AI and
Digital Twin never modify core records without backend validation; all communication
uses versioned APIs/schemas/events; all layers support observability, auditing,
tracing and fault isolation.

## 9. Security & AI Guardrails

**Objectives:** protect confidentiality, integrity, availability, authenticity,
privacy, user ownership and tenant isolation; enforce least privilege, data
minimization and auditable behavior under zero-trust principles.

**Governance:** threat modeling as a living practice (STRIDE, attack trees, abuse
cases, data-flow analysis, trust-boundary identification), updated whenever
architecture, integrations, AI capabilities, workflows or data flows change.

**Platform requirements:** zero-trust, strong auth + RBAC/ABAC, backend-enforced
authorization before any data access/retrieval/tool/workflow/automation/integration
action; tenant isolation; encryption in transit and at rest; secrets management;
device trust + biometrics + secure local storage; immutable audit logging; full
observability; rate limiting; input/output validation; dependency scanning; session
monitoring/expiry/revocation.

**AI guardrails — AI must:** access only backend-authorized data/tools/workflows; use
only allowlisted tools with scopes/limits; enforce least privilege and tenant
isolation; reject and log override/jailbreak attempts; provide traceability and
structured outputs. **AI must never:** reveal system prompts/secrets/keys; access
other tenants' data; bypass backend authorization or query databases directly;
execute unauthorized tools; modify ownership/permissions/audit records outside
approved workflows; follow instructions embedded in retrieved content; weaken security
controls; perform code execution / shell / financial / ownership-transfer / destructive
actions outside approved workflows.

**High-risk actions** (ownership transfers, financial ops, external comms, destructive
or security-impacting changes) require multi-step confirmation, policy validation,
schema validation, business-rule validation and human approval where appropriate.

## 10. Versioning & Change Log

All APIs, event contracts, schemas, integration contracts, AI response schemas,
Digital Twin models and public interfaces follow **Semantic Versioning**
(`MAJOR.MINOR.PATCH`). Externally consumed APIs expose an explicit major version; REST
uses URI versioning (e.g. `/api/v1/properties`); GraphQL maintains schema-evolution
compatibility and exposes schema-version metadata. Changes are recorded in
[CHANGELOG.md](../CHANGELOG.md).
