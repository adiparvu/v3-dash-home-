-- =============================================================================
-- Migration 008 — Web Push subscriptions
-- =============================================================================
-- Stores the browser PushSubscription for each of a user's devices so the
-- backend (the push-notify edge function) can deliver Web Push notifications.
-- RLS-scoped to the owning user: a user may only see / manage their own
-- subscriptions. The edge function reads them with the service-role key.
-- =============================================================================

create table if not exists public.push_subscriptions (
  id          uuid        primary key default uuid_generate_v4(),
  user_id     uuid        not null references public.profiles(id) on delete cascade,
  endpoint    text        not null unique,
  p256dh      text        not null,
  auth        text        not null,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_push_subscriptions_user on public.push_subscriptions(user_id);

alter table public.push_subscriptions enable row level security;

create policy "push_subscriptions: owner all"
  on public.push_subscriptions for all
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
