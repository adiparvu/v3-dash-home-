-- 013_privacy_compliance.sql
-- Data privacy & compliance backend (spec: Data Privacy, Ownership & Compliance).
-- Persists per-user consent state and data-subject (GDPR/CCPA) requests, each
-- RLS-scoped to the authenticated user. Data export is produced on demand by the
-- backend; retention schedules are served as documented policy. Audit entries are
-- written by the API for every consent change and request.

create table if not exists public.consents (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  consent_key text        not null,
  granted     boolean     not null default false,
  updated_at  timestamptz not null default now(),
  unique (user_id, consent_key)
);

alter table public.consents enable row level security;
drop policy if exists "consents: self all" on public.consents;
create policy "consents: self all"
  on public.consents for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table if not exists public.privacy_requests (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  type        text        not null, -- access | export | erasure | rectification | restriction | objection
  regulation  text,                 -- gdpr | ccpa
  status      text        not null default 'pending',
  note        text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);

create index if not exists privacy_requests_user_idx
  on public.privacy_requests(user_id, created_at desc);

alter table public.privacy_requests enable row level security;
drop policy if exists "privacy_requests: self all" on public.privacy_requests;
create policy "privacy_requests: self all"
  on public.privacy_requests for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
