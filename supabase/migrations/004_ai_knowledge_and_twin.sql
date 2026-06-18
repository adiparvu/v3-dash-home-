-- =============================================================================
-- PRVIO Earth — AI knowledge store (pgvector) & Digital Twin event bus
-- Migration: 004_ai_knowledge_and_twin.sql
--
-- Promotes two prototype layers onto the live backend:
--   1. Retrieval-augmented estate knowledge — a pgvector-backed knowledge store
--      with a backend-authorized similarity-search RPC (deny-by-default, RLS +
--      ownership checked), mirroring app/lib/ai/retrieval.ts.
--   2. Real-time state sync — a durable twin_events table published over Supabase
--      Realtime, the system-of-record behind app/lib/twin/telemetry.ts events.
-- =============================================================================

create extension if not exists vector;

-- =============================================================================
-- TABLE: knowledge_chunks  (retrieval store)
-- =============================================================================

create table if not exists public.knowledge_chunks (
  id           uuid          primary key default uuid_generate_v4(),
  property_id  uuid          not null references public.properties(id) on delete cascade,
  scope        text          not null,
  title        text          not null,
  content      text          not null,
  keywords     text[]        not null default '{}',
  -- 1536-dim embeddings (OpenAI/text-embedding-3-small compatible); produced by
  -- the backend AI service, never by the client.
  embedding    vector(1536),
  metadata     jsonb,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now()
);

create index if not exists idx_knowledge_property on public.knowledge_chunks(property_id);
create index if not exists idx_knowledge_scope    on public.knowledge_chunks(property_id, scope);
-- Approximate-nearest-neighbour index for cosine similarity search.
create index if not exists idx_knowledge_embedding
  on public.knowledge_chunks using ivfflat (embedding vector_cosine_ops) with (lists = 100);

create trigger knowledge_chunks_updated_at
  before update on public.knowledge_chunks
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: twin_events  (event bus, system-of-record)
-- =============================================================================

create table if not exists public.twin_events (
  id                  uuid        primary key default uuid_generate_v4(),
  property_id         uuid        not null references public.properties(id) on delete cascade,
  sensor_external_id  text        not null,
  label               text        not null,
  message             text        not null,
  status              text        not null check (status in ('ok', 'warn', 'alert')),
  recorded_at         timestamptz not null default now()
);

create index if not exists idx_twin_events_property_recorded
  on public.twin_events(property_id, recorded_at desc);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.knowledge_chunks enable row level security;
alter table public.twin_events      enable row level security;

create policy "knowledge_chunks: owner all"
  on public.knowledge_chunks for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

create policy "twin_events: owner all"
  on public.twin_events for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- =============================================================================
-- RPC: match_knowledge  (backend-authorized similarity search)
-- =============================================================================
-- Deny-by-default retrieval: returns chunks for the given property only when the
-- caller owns it, restricted to the requested scopes, ordered by cosine
-- similarity. SECURITY DEFINER so it can read the ivfflat index, but it enforces
-- ownership explicitly before returning any row.
create or replace function public.match_knowledge(
  prop_id          uuid,
  query_embedding  vector(1536),
  match_scopes     text[],
  match_count      int default 5
)
returns table (
  id          uuid,
  scope       text,
  title       text,
  content     text,
  similarity  float
)
language plpgsql
security definer
stable
set search_path = ''
as $$
begin
  if not public.owns_property(prop_id) then
    return;  -- unauthorized: return no rows
  end if;

  return query
    select k.id, k.scope, k.title, k.content,
           1 - (k.embedding <=> query_embedding) as similarity
    from public.knowledge_chunks k
    where k.property_id = prop_id
      and (match_scopes is null or k.scope = any (match_scopes))
      and k.embedding is not null
    order by k.embedding <=> query_embedding
    limit greatest(1, least(match_count, 20));
end;
$$;

-- Keep the RPC off the anon surface (anon never passes ownership anyway).
revoke execute on function public.match_knowledge(uuid, vector, text[], int) from public, anon;
grant execute on function public.match_knowledge(uuid, vector, text[], int) to authenticated;

-- =============================================================================
-- REALTIME: publish twin_events for live state sync
-- =============================================================================
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    execute 'alter publication supabase_realtime add table public.twin_events';
  end if;
exception
  when duplicate_object then null;  -- already added
end$$;
