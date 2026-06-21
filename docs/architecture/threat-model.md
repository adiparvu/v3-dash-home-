# PRVIO Earth — Threat Model (living document)

**Version:** v1.0.0 · **Last updated:** 2026-06-20

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

## Live backend verification (2026-06-20)

Verified against the live Supabase project `v3-dash-home (PRVIO Earth)`
(`tircswflgkosuxudcnsd`, eu-west-1, Postgres 17):

- **Migrations** `001`–`010` all applied; **28 tables, RLS enabled on every one**.
- **Auth gating (runtime)** — unauthenticated `/api/v1/*` return `401`
  (`{"apiVersion":"1.0.0","error":"unauthorized"}`); protected routes `307` to
  `/login?redirect=…`; `/login` is `200`.
- **RLS (direct PostgREST, anon key)** — every table denies anon access
  (fail-closed): parent tables return `[]`; property-scoped child tables return
  `42501 permission denied for function owns_property`.

### ⚠️ `owns_property` guardrail — do not "fix" the advisor

Supabase security advisor `0029` flags `owns_property(uuid)` and
`match_knowledge(...)` as `SECURITY DEFINER` functions executable by signed-in
users. **Both are intentional and must not be revoked from `authenticated`:**

- `owns_property` is called inside **every property-scoped RLS policy**, so the
  `authenticated` role *must* keep `EXECUTE` — revoking it breaks all child-table
  queries with `42501` for logged-in users.
- `match_knowledge` is the retrieval RPC and enforces ownership internally
  (`owns_property` → returns no rows if unauthorized).

The `42501` seen by **anon** on child tables is the *deliberate* hardening from
migration `003` (anon's `EXECUTE` on `owns_property` was revoked on purpose). It
is fail-closed and leaks only the function name; do not grant it back to anon
just for `[]`-shaped responses.

## Open items (tracked)
- Application-level rate limiting is now enforced in `middleware.ts` (per-IP
  fixed-window over `/api/v1`, stricter for `/api/v1/ai/*`; `lib/rateLimit.ts`).
  Cross-instance gateway-level rate limiting / WAF (shared store, e.g. Upstash)
  remains the Phase 2 upgrade for strict, distributed limits.
- `vector` extension lives in the `public` schema (advisor `0014`, low priority).
- Secret rotation guidance for BYO keys; consider server-side key vault instead
  of client storage for production.
