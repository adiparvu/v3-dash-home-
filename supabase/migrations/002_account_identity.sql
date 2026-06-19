-- =============================================================================
-- PRVIO Earth — Account, Identity & Audit
-- Migration: 002_account_identity.sql
--
-- Phase 2 backend foundation for the Account & Identity feature shipped on the
-- client in Phase 1: extended profile fields, social links, trusted persons,
-- active-session tracking and an immutable audit log.
-- =============================================================================

-- =============================================================================
-- ENUMS
-- =============================================================================

create type public.social_platform as enum (
  'facebook',
  'instagram',
  'x',
  'threads',
  'linkedin',
  'tiktok',
  'youtube',
  'telegram',
  'whatsapp',
  'custom'
);

create type public.trusted_permission as enum (
  'emergency_access',
  'ownership_transfer',
  'recovery_approvals',
  'estate_continuity'
);

-- =============================================================================
-- EXTEND: profiles  (additive — keeps existing columns intact)
-- =============================================================================

alter table public.profiles
  add column if not exists first_name        text,
  add column if not exists last_name         text,
  add column if not exists display_name      text,
  add column if not exists notes             text,
  -- Index into the client RING_COLORS palette; kept as smallint for portability.
  add column if not exists avatar_ring_color smallint not null default 0,
  -- Auto-lock inactivity timeout in seconds; null = use app default.
  add column if not exists auto_lock_seconds integer,
  add column if not exists login_alerts      boolean  not null default true;

-- =============================================================================
-- TABLE: profile_social_links
-- =============================================================================

create table public.profile_social_links (
  id          uuid                    primary key default uuid_generate_v4(),
  profile_id  uuid                    not null references public.profiles(id) on delete cascade,
  platform    public.social_platform  not null,
  label       text,
  url         text                    not null,
  sort_order  integer                 not null default 0,
  created_at  timestamptz             not null default now()
);

create index idx_profile_social_links_profile_id on public.profile_social_links(profile_id);

-- =============================================================================
-- TABLE: trusted_persons
-- =============================================================================

create table public.trusted_persons (
  id            uuid                          primary key default uuid_generate_v4(),
  profile_id    uuid                          not null references public.profiles(id) on delete cascade,
  -- Optional link to an existing PRVIO account, when the trusted person has one.
  linked_user_id uuid                         references public.profiles(id) on delete set null,
  name          text                          not null,
  relationship  text,
  email         text,
  phone         text,
  permissions   public.trusted_permission[]   not null default '{}',
  invited_at    timestamptz                   not null default now(),
  accepted_at   timestamptz,
  created_at    timestamptz                   not null default now(),
  updated_at    timestamptz                   not null default now()
);

create index idx_trusted_persons_profile_id on public.trusted_persons(profile_id);

create trigger trusted_persons_updated_at
  before update on public.trusted_persons
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: user_sessions  (active sessions / device trust)
-- =============================================================================

create table public.user_sessions (
  id              uuid        primary key default uuid_generate_v4(),
  user_id         uuid        not null references public.profiles(id) on delete cascade,
  device_name     text,
  platform        text,
  ip_address      inet,
  location        text,
  user_agent      text,
  is_trusted      boolean     not null default false,
  is_current      boolean     not null default false,
  last_active_at  timestamptz not null default now(),
  revoked_at      timestamptz,
  created_at      timestamptz not null default now()
);

create index idx_user_sessions_user_id        on public.user_sessions(user_id);
create index idx_user_sessions_last_active_at on public.user_sessions(last_active_at desc);

-- =============================================================================
-- TABLE: audit_log  (append-only; immutable by policy)
-- =============================================================================

create table public.audit_log (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        references public.profiles(id) on delete set null,
  property_id  uuid        references public.properties(id) on delete set null,
  action       text        not null,
  resource     text,
  detail       text,
  ip_address   inet,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);

create index idx_audit_log_user_id     on public.audit_log(user_id);
create index idx_audit_log_property_id on public.audit_log(property_id);
create index idx_audit_log_created_at  on public.audit_log(created_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profile_social_links enable row level security;
alter table public.trusted_persons       enable row level security;
alter table public.user_sessions         enable row level security;
alter table public.audit_log             enable row level security;

-- profile_social_links: scoped to the owning profile
create policy "social_links: owner all"
  on public.profile_social_links for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- trusted_persons: scoped to the owning profile
create policy "trusted_persons: owner all"
  on public.trusted_persons for all
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- user_sessions: a user sees and revokes only their own sessions
create policy "user_sessions: owner select"
  on public.user_sessions for select
  using (user_id = auth.uid());

create policy "user_sessions: owner update"
  on public.user_sessions for update
  using (user_id = auth.uid());

create policy "user_sessions: owner delete"
  on public.user_sessions for delete
  using (user_id = auth.uid());

-- audit_log: read-only for the subject user; never updatable or deletable.
-- Writes are performed by backend services using the service role, which
-- bypasses RLS — there is intentionally no INSERT/UPDATE/DELETE policy here,
-- which makes the log effectively immutable for end users.
create policy "audit_log: owner select"
  on public.audit_log for select
  using (user_id = auth.uid());

-- =============================================================================
-- BACKFILL: derive name parts from existing full_name where possible
-- =============================================================================

update public.profiles
set
  display_name = coalesce(display_name, full_name),
  first_name   = coalesce(first_name, split_part(full_name, ' ', 1)),
  last_name    = coalesce(
                   last_name,
                   nullif(regexp_replace(full_name, '^\S+\s*', ''), '')
                 )
where full_name is not null;
