-- =============================================================================
-- Migration 009 — Sensor & zone taxonomy for the monitoring framework
-- =============================================================================
-- Extends the existing sensor/zone enums so the reusable Zone-Monitoring
-- framework can cover water quality (heleșteu / pool), climate (greenhouse) and
-- new property modules, and publishes `telemetry` over Realtime so MonitorCards
-- update live. Adding enum values is idempotent (IF NOT EXISTS).
-- =============================================================================

-- New sensor kinds (water quality, hydroponics, flow).
alter type public.sensor_type add value if not exists 'ph';
alter type public.sensor_type add value if not exists 'dissolved_oxygen';
alter type public.sensor_type add value if not exists 'salinity';
alter type public.sensor_type add value if not exists 'ec';
alter type public.sensor_type add value if not exists 'water_flow';
alter type public.sensor_type add value if not exists 'turbidity';
alter type public.sensor_type add value if not exists 'pressure';

-- New zone kinds (modules beyond the original estate areas).
alter type public.zone_type add value if not exists 'pool';
alter type public.zone_type add value if not exists 'cellar';
alter type public.zone_type add value if not exists 'garage';

-- Live telemetry push for the monitoring surfaces.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'telemetry'
     ) then
    execute 'alter publication supabase_realtime add table public.telemetry';
  end if;
end$$;
