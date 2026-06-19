-- =============================================================================
-- Migration 005 — Energy readings (time-series)
-- =============================================================================
-- Durable history behind the Energy module: every live reading published on the
-- `prvio-energy` event bus (POST /api/v1/twin/energy) is appended here, feeding
-- the Energie / Impact charts. RLS-scoped to the property owner, mirroring
-- twin_events (migration 004).
-- =============================================================================

create table if not exists public.energy_readings (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  solar        numeric     not null,
  home         numeric     not null,
  vehicle      numeric     not null,
  battery      numeric     not null,  -- + charging, − discharging
  grid         numeric     not null,  -- + importing, − exporting
  battery_pct  numeric     not null,
  car_pct      numeric,
  recorded_at  timestamptz not null default now()
);

create index if not exists idx_energy_readings_property_recorded
  on public.energy_readings(property_id, recorded_at desc);

alter table public.energy_readings enable row level security;

create policy "energy_readings: owner all"
  on public.energy_readings for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));
