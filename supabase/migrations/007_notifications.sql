-- =============================================================================
-- Migration 007 — Notifications (durable history)
-- =============================================================================
-- Backend system-of-record for the notifications center. Written by domain
-- services / the alerts pipeline; read by the client. RLS-scoped to the owner.
-- Live energy/twin alerts are still derived on-device; this is the durable
-- history above which they render.
-- =============================================================================

create table if not exists public.notifications (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  kind         text        not null,          -- alert | task | automation | system | security | maintenance
  title        text        not null,
  body         text,
  severity     text        not null default 'info' check (severity in ('alert','warn','info','ok')),
  read         boolean     not null default false,
  created_at   timestamptz not null default now()
);
create index if not exists idx_notifications_property_created on public.notifications(property_id, created_at desc);

alter table public.notifications enable row level security;

create policy "notifications: owner all"
  on public.notifications for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));
