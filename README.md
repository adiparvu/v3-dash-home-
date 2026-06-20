# PRVIO Earth

A premium **private estate operating system** — property, asset, maintenance,
communication and digital-twin management for a single owner and trusted
collaborators. This repository is the web client (Next.js 14 App Router, Tailwind,
iOS-26 "Liquid Glass" design language) plus the Supabase backend schema.

See [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) for scope,
[`docs/ROADMAP.md`](docs/ROADMAP.md) for the phased plan, and
[`docs/architecture/`](docs/architecture/) for the architecture diagrams.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in the values below
npm run dev                        # http://localhost:3000
```

The app runs in a **localStorage prototype mode** with no configuration. To enable
authentication and Supabase persistence, set:

| Variable | Where to find it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase dashboard → Project Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same page (public, RLS-protected) |
| `SUPABASE_SERVICE_ROLE_KEY` | same page → `service_role` (server-only secret) |

When these are present, the Next.js middleware enforces auth (redirecting to
`/login`) and the data layer reads/writes through Supabase with Row Level Security.

## Backend

The schema lives in [`supabase/migrations/`](supabase/migrations/):

- `001_initial_schema.sql` — properties, parcels, zones, assets, tasks, sensors,
  telemetry, automations, documents, contractors, maintenance, notifications, chat.
- `002_account_identity.sql` — extended profiles, social links, trusted persons,
  user sessions and an immutable audit log.
- `003_harden_function_grants.sql` — revokes the RPC surface from trigger helpers.

Apply them to a Supabase project with the [Supabase CLI](https://supabase.com/docs/guides/local-development)
(`supabase db push`) or the dashboard SQL editor.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run lint` — lint
- `npm test` — unit tests (vitest)
- `npm run test:e2e` — end-to-end smoke tests (Playwright; builds + starts the app
  and drives the key surfaces in a browser in localStorage prototype mode). Run
  `npx playwright install chromium` once to fetch the browser.

### Energy event-bus test publisher

Simulate the backend / Home Assistant gateway feeding the **Energy → Live**
diagram. It broadcasts an `EnergyState` on the `prvio-energy` Supabase Realtime
channel every couple of seconds; the Live diagram (`useEnergyLive`) picks it up
and shows the green **Live** badge.

```bash
NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  node scripts/energy-publisher.mjs [intervalSeconds]
```

The app's own `POST /api/v1/twin/energy` (auth-gated) publishes to the same
channel; `GET /api/v1/twin/energy` returns a freshly simulated reading.
