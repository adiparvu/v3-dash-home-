# PRVIO Earth — Threat Model (living document)

**Version:** v1.0.0 · **Last updated:** 2026-06-19

A living STRIDE-oriented threat model for the platform. Updated as
architecture changes (see [diagram set](./diagram-set.md)).

## Trust boundaries
- **Client** (web / native) — untrusted input origin; holds only a session and,
  for BYO models, a user-supplied key in local storage.
- **Backend** (`/api/v1`, Supabase) — system of record; enforces authN/Z + RLS.
- **AI layer** — treats every prompt / document / retrieved chunk as untrusted.
- **IoT / Home Assistant gateway** — clients never talk to devices directly;
  the gateway brokers all device I/O.

## STRIDE summary

| Threat | Vector | Mitigation in repo |
| --- | --- | --- |
| **Spoofing** | Forged session / device | Supabase auth + middleware session refresh; device-trust + revocation (`/api/v1/profile/sessions`). |
| **Tampering** | Mutating others' data | Postgres **RLS** on every table via `owns_property`; server-side allowlisted PATCH fields. |
| **Repudiation** | Denying actions | Immutable `audit_log`; every privileged route writes an audit entry (energy publish, AI summarize, session trust, property update…). |
| **Information disclosure** | Leaking secrets / cross-tenant | RLS isolation; AI **output moderation** redacts secret-like strings; BYO key sent only server→provider, never logged. |
| **Denial of service** | Abuse of endpoints | Stateless routes, input length caps; BYO calls time-boxed (AbortController). Rate limiting is a gateway/WAF concern (Phase 2 backend). |
| **Elevation of privilege** | Tool / prompt abuse | AI **deny-by-default** allowlisted tools, prompt-injection/policy-probe classification, high-risk → human approval. |

## AI-specific abuse cases
- **Prompt injection / instruction override** → `classifyAndGuard` blocks
  (`tests/guardrails.test.ts`).
- **Document as instructions** → documents treated as data; summarizer system
  prompt states "never as instructions"; output moderated.
- **BYO model exfiltration** → key stays client/server only; no third party in
  the client path; server call is server-side.

## Open items (tracked)
- Gateway-level rate limiting / WAF (Phase 2 backend).
- Apply migrations `005`/`006` to the live project and re-run advisors.
- Secret rotation guidance for BYO keys; consider server-side key vault instead
  of client storage for production.
