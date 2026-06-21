-- =============================================================================
-- Migration 011 — Live Activity push tokens
-- =============================================================================
-- Stores the per-activity APNs push token reported by the iOS app so the backend
-- can push ContentState updates to in-progress estate-job Live Activities.
-- RLS-scoped to the owning user; the backend reads them with the service-role key
-- when sending pushes.
-- =============================================================================

create table if not exists public.live_activities (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  property_id uuid        references public.properties(id) on delete cascade,
  activity_id text        not null,
  push_token  text        not null,
  kind        text        not null default 'Maintenance',
  job_title   text,
  ended       boolean     not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (user_id, activity_id)
);

create index if not exists idx_live_activities_user on public.live_activities(user_id);
create index if not exists idx_live_activities_activity on public.live_activities(activity_id);

alter table public.live_activities enable row level security;

create policy "live_activities: owner all"
  on public.live_activities for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create trigger set_live_activities_updated_at
  before update on public.live_activities
  for each row execute function public.handle_updated_at();
