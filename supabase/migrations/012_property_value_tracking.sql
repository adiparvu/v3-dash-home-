-- 012_property_value_tracking.sql
-- Property value tracking (spec: Property & Estate Management → Property Value
-- Tracking): current value, purchase price, market notes on the property, plus
-- an append-only valuation history. RLS scopes every row to the owner via the
-- existing owns_property() guard, mirroring zones/assets/tasks.

alter table public.properties
  add column if not exists purchase_price numeric(14, 2),
  add column if not exists current_value  numeric(14, 2),
  add column if not exists market_notes   text;

create table if not exists public.property_valuations (
  id          uuid           primary key default uuid_generate_v4(),
  property_id uuid           not null references public.properties(id) on delete cascade,
  value       numeric(14, 2) not null,
  note        text,
  recorded_at timestamptz    not null default now(),
  created_at  timestamptz    not null default now()
);

create index if not exists property_valuations_property_id_idx
  on public.property_valuations(property_id, recorded_at desc);

alter table public.property_valuations enable row level security;

drop policy if exists "property_valuations: owner all" on public.property_valuations;
create policy "property_valuations: owner all"
  on public.property_valuations for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));
