-- =============================================================================
-- Migration 010 — Cameras & AI detections (Frigate-style)
-- =============================================================================
-- Backend system-of-record for the AI camera capability: the camera registry and
-- the object-detection event stream (person / car / animal / package …) produced
-- by a Frigate / Scrypted NVR brokered through the Home Assistant gateway.
-- RLS-scoped to the property owner; camera_events are published over Realtime so
-- the camera wall and detection feed update live.
-- =============================================================================

create table if not exists public.cameras (
  id            uuid        primary key default uuid_generate_v4(),
  property_id   uuid        not null references public.properties(id) on delete cascade,
  name          text        not null,
  zone          text,
  stream_url    text,
  snapshot_url  text,
  vendor        text,
  ai_enabled    boolean     not null default true,
  is_online     boolean     not null default true,
  last_event_at timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists idx_cameras_property on public.cameras(property_id);

create table if not exists public.camera_events (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  camera_id    uuid        not null references public.cameras(id) on delete cascade,
  object       text        not null,             -- person | car | animal | package | …
  label        text,                             -- optional sub-label (e.g. "delivery")
  confidence   numeric,                          -- 0..1
  zone         text,
  snapshot_url text,
  recorded_at  timestamptz not null default now()
);
create index if not exists idx_camera_events_property_recorded
  on public.camera_events(property_id, recorded_at desc);
create index if not exists idx_camera_events_camera on public.camera_events(camera_id);

alter table public.cameras       enable row level security;
alter table public.camera_events enable row level security;

create policy "cameras: owner all"
  on public.cameras for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

create policy "camera_events: owner all"
  on public.camera_events for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- Live detection feed.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'camera_events'
     ) then
    execute 'alter publication supabase_realtime add table public.camera_events';
  end if;
end$$;
