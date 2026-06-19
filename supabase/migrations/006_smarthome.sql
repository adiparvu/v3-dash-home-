-- =============================================================================
-- Migration 006 — Smart-home: device registry, presence, automation schedules
-- =============================================================================
-- Backend system-of-record for the Home-Assistant-fed surfaces (gateway device
-- list with protocols, floorplan presence, automations scheduler). RLS-scoped to
-- the property owner, mirroring migration 004/005.
-- =============================================================================

-- Devices brokered by the Home Assistant gateway (clients never talk to IoT).
create table if not exists public.device_registry (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  name         text        not null,
  domain       text        not null,
  zone         text,
  protocol     text        not null check (protocol in ('Matter','Thread','Zigbee','Z-Wave','Wi-Fi')),
  is_local     boolean     not null default true,
  is_online    boolean     not null default true,
  last_seen_at timestamptz not null default now()
);
create index if not exists idx_device_registry_property on public.device_registry(property_id);

-- Room-level presence events (floorplan / Digital Twin).
create table if not exists public.presence_events (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  person       text        not null,
  room         text        not null,
  present      boolean     not null default true,
  recorded_at  timestamptz not null default now()
);
create index if not exists idx_presence_property_recorded on public.presence_events(property_id, recorded_at desc);

-- Time-based automation schedules (scheduler / area grouping).
create table if not exists public.automation_schedules (
  id            uuid        primary key default uuid_generate_v4(),
  property_id   uuid        not null references public.properties(id) on delete cascade,
  automation_id text        not null,
  area          text,
  at_time       text        not null,  -- "HH:MM" or "Sunset"/"Sunrise"
  enabled       boolean     not null default true,
  created_at    timestamptz not null default now()
);
create index if not exists idx_automation_schedules_property on public.automation_schedules(property_id);

alter table public.device_registry      enable row level security;
alter table public.presence_events      enable row level security;
alter table public.automation_schedules enable row level security;

create policy "device_registry: owner all"
  on public.device_registry for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

create policy "presence_events: owner all"
  on public.presence_events for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

create policy "automation_schedules: owner all"
  on public.automation_schedules for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));
