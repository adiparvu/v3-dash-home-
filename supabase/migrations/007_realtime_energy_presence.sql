-- =============================================================================
-- Migration 007 — Realtime: energy readings, presence & notifications
-- =============================================================================
-- Migration 004 published `twin_events` over Supabase Realtime. This extends the
-- same `supabase_realtime` publication to the surfaces that benefit from live
-- push instead of polling:
--   • energy_readings   — Live energy diagram / Energie / Impact charts
--   • presence_events   — floorplan room presence
--   • notifications     — durable notification history
-- Each ALTER is guarded so the migration is idempotent (re-runnable).
-- =============================================================================

do $$
declare
  tbl text;
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    return;  -- publication not present (e.g. local stack without Realtime)
  end if;

  foreach tbl in array array['energy_readings', 'presence_events', 'notifications']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = tbl
    ) then
      execute format('alter publication supabase_realtime add table public.%I', tbl);
    end if;
  end loop;
end$$;
