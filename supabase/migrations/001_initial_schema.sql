-- =============================================================================
-- PRVIO Earth — Initial Schema
-- Migration: 001_initial_schema.sql
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- =============================================================================
-- ENUMS
-- =============================================================================

create type public.zone_type as enum (
  'forest',
  'greenhouse',
  'orchard',
  'lake',
  'garden',
  'house',
  'driveway',
  'smart_home',
  'custom'
);

create type public.asset_category as enum (
  'device',
  'plant',
  'equipment',
  'vehicle',
  'furniture',
  'structure',
  'other'
);

create type public.task_status as enum (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

create type public.task_priority as enum (
  'low',
  'normal',
  'high',
  'urgent'
);

create type public.sensor_type as enum (
  'temperature',
  'humidity',
  'co2',
  'moisture',
  'motion',
  'door',
  'light',
  'water_level',
  'custom'
);

-- =============================================================================
-- HELPER: updated_at trigger function
-- =============================================================================

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- TABLE: profiles
-- =============================================================================

create table public.profiles (
  id                    uuid        primary key references auth.users(id) on delete cascade,
  email                 text        not null unique,
  full_name             text,
  avatar_url            text,
  phone                 text,
  timezone              text        not null default 'UTC',
  locale                text        not null default 'en-US',
  onboarding_completed  boolean     not null default false,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: properties
-- =============================================================================

create table public.properties (
  id               uuid        primary key default uuid_generate_v4(),
  owner_id         uuid        not null references public.profiles(id) on delete cascade,
  name             text        not null,
  description      text,
  address          text,
  city             text,
  country          text,
  latitude         numeric(10, 7),
  longitude        numeric(10, 7),
  total_area_sqm   numeric(12, 2),
  cover_image_url  text,
  timezone         text        not null default 'UTC',
  currency         text        not null default 'USD',
  is_active        boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_properties_owner_id  on public.properties(owner_id);
create index idx_properties_created_at on public.properties(created_at desc);

create trigger properties_updated_at
  before update on public.properties
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: parcels
-- =============================================================================

create table public.parcels (
  id                uuid        primary key default uuid_generate_v4(),
  property_id       uuid        not null references public.properties(id) on delete cascade,
  name              text        not null,
  description       text,
  area_sqm          numeric(12, 2),
  boundary_geojson  jsonb,
  color             text,
  sort_order        integer     not null default 0,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_parcels_property_id on public.parcels(property_id);

create trigger parcels_updated_at
  before update on public.parcels
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: zones
-- =============================================================================

create table public.zones (
  id                uuid        primary key default uuid_generate_v4(),
  property_id       uuid        not null references public.properties(id) on delete cascade,
  parcel_id         uuid        references public.parcels(id) on delete set null,
  name              text        not null,
  description       text,
  type              public.zone_type not null default 'custom',
  area_sqm          numeric(12, 2),
  boundary_geojson  jsonb,
  color             text,
  icon              text,
  sort_order        integer     not null default 0,
  metadata          jsonb,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_zones_property_id on public.zones(property_id);
create index idx_zones_parcel_id   on public.zones(parcel_id);
create index idx_zones_type        on public.zones(type);

create trigger zones_updated_at
  before update on public.zones
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: assets
-- =============================================================================

create table public.assets (
  id                   uuid               primary key default uuid_generate_v4(),
  property_id          uuid               not null references public.properties(id) on delete cascade,
  zone_id              uuid               references public.zones(id) on delete set null,
  name                 text               not null,
  description          text,
  category             public.asset_category not null default 'other',
  subcategory          text,
  manufacturer         text,
  model                text,
  serial_number        text,
  purchase_date        date,
  purchase_price       numeric(12, 2),
  current_value        numeric(12, 2),
  warranty_expiry      date,
  condition            text,
  location_description text,
  latitude             numeric(10, 7),
  longitude            numeric(10, 7),
  image_urls           text[],
  metadata             jsonb,
  is_active            boolean            not null default true,
  created_at           timestamptz        not null default now(),
  updated_at           timestamptz        not null default now()
);

create index idx_assets_property_id on public.assets(property_id);
create index idx_assets_zone_id     on public.assets(zone_id);
create index idx_assets_category    on public.assets(category);
create index idx_assets_created_at  on public.assets(created_at desc);

create trigger assets_updated_at
  before update on public.assets
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: asset_qr_codes
-- =============================================================================

create table public.asset_qr_codes (
  id              uuid        primary key default uuid_generate_v4(),
  asset_id        uuid        not null references public.assets(id) on delete cascade,
  property_id     uuid        not null references public.properties(id) on delete cascade,
  code            text        not null unique default encode(gen_random_bytes(8), 'hex'),
  qr_image_url    text,
  label           text,
  is_active       boolean     not null default true,
  last_scanned_at timestamptz,
  scan_count      integer     not null default 0,
  created_at      timestamptz not null default now()
);

create index idx_asset_qr_codes_asset_id    on public.asset_qr_codes(asset_id);
create index idx_asset_qr_codes_property_id on public.asset_qr_codes(property_id);
create index idx_asset_qr_codes_code        on public.asset_qr_codes(code);

-- =============================================================================
-- TABLE: tasks
-- =============================================================================

create table public.tasks (
  id               uuid                 primary key default uuid_generate_v4(),
  property_id      uuid                 not null references public.properties(id) on delete cascade,
  zone_id          uuid                 references public.zones(id) on delete set null,
  asset_id         uuid                 references public.assets(id) on delete set null,
  assigned_to      uuid                 references public.profiles(id) on delete set null,
  contractor_id    uuid,  -- FK added after contractors table below
  title            text                 not null,
  description      text,
  status           public.task_status   not null default 'pending',
  priority         public.task_priority not null default 'normal',
  due_date         timestamptz,
  completed_at     timestamptz,
  recurrence_rule  text,
  estimated_hours  numeric(6, 2),
  actual_hours     numeric(6, 2),
  estimated_cost   numeric(12, 2),
  actual_cost      numeric(12, 2),
  tags             text[],
  attachments      jsonb,
  notes            text,
  created_by       uuid                 not null references public.profiles(id) on delete restrict,
  created_at       timestamptz          not null default now(),
  updated_at       timestamptz          not null default now()
);

create index idx_tasks_property_id  on public.tasks(property_id);
create index idx_tasks_zone_id      on public.tasks(zone_id);
create index idx_tasks_asset_id     on public.tasks(asset_id);
create index idx_tasks_assigned_to  on public.tasks(assigned_to);
create index idx_tasks_status       on public.tasks(status);
create index idx_tasks_priority     on public.tasks(priority);
create index idx_tasks_due_date     on public.tasks(due_date);
create index idx_tasks_created_at   on public.tasks(created_at desc);

create trigger tasks_updated_at
  before update on public.tasks
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: sensors
-- =============================================================================

create table public.sensors (
  id                         uuid               primary key default uuid_generate_v4(),
  property_id                uuid               not null references public.properties(id) on delete cascade,
  zone_id                    uuid               references public.zones(id) on delete set null,
  asset_id                   uuid               references public.assets(id) on delete set null,
  name                       text               not null,
  description                text,
  type                       public.sensor_type not null default 'custom',
  external_id                text,
  manufacturer               text,
  model                      text,
  firmware_version           text,
  unit                       text,
  min_value                  numeric,
  max_value                  numeric,
  alert_low                  numeric,
  alert_high                 numeric,
  sampling_interval_seconds  integer            not null default 60,
  battery_level              smallint check (battery_level between 0 and 100),
  last_seen_at               timestamptz,
  is_active                  boolean            not null default true,
  metadata                   jsonb,
  created_at                 timestamptz        not null default now(),
  updated_at                 timestamptz        not null default now()
);

create index idx_sensors_property_id on public.sensors(property_id);
create index idx_sensors_zone_id     on public.sensors(zone_id);
create index idx_sensors_asset_id    on public.sensors(asset_id);
create index idx_sensors_type        on public.sensors(type);
create index idx_sensors_external_id on public.sensors(external_id);

create trigger sensors_updated_at
  before update on public.sensors
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: telemetry  (time-series)
-- =============================================================================

create table public.telemetry (
  id           uuid        primary key default uuid_generate_v4(),
  sensor_id    uuid        not null references public.sensors(id) on delete cascade,
  property_id  uuid        not null references public.properties(id) on delete cascade,
  value        numeric     not null,
  raw_payload  jsonb,
  quality      smallint    check (quality between 0 and 100),
  recorded_at  timestamptz not null default now(),
  created_at   timestamptz not null default now()
);

-- Composite index for time-series queries: sensor + time window
create index idx_telemetry_sensor_recorded on public.telemetry(sensor_id, recorded_at desc);
create index idx_telemetry_property_recorded on public.telemetry(property_id, recorded_at desc);

-- =============================================================================
-- TABLE: automations
-- =============================================================================

create table public.automations (
  id                uuid        primary key default uuid_generate_v4(),
  property_id       uuid        not null references public.properties(id) on delete cascade,
  name              text        not null,
  description       text,
  is_active         boolean     not null default true,
  trigger_type      text        not null,
  trigger_config    jsonb       not null default '{}',
  conditions        jsonb,
  actions           jsonb       not null default '[]',
  last_triggered_at timestamptz,
  trigger_count     integer     not null default 0,
  created_by        uuid        not null references public.profiles(id) on delete restrict,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index idx_automations_property_id on public.automations(property_id);
create index idx_automations_is_active   on public.automations(is_active);
create index idx_automations_trigger_type on public.automations(trigger_type);

create trigger automations_updated_at
  before update on public.automations
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: documents
-- =============================================================================

create table public.documents (
  id               uuid        primary key default uuid_generate_v4(),
  property_id      uuid        not null references public.properties(id) on delete cascade,
  asset_id         uuid        references public.assets(id) on delete set null,
  zone_id          uuid        references public.zones(id) on delete set null,
  uploaded_by      uuid        not null references public.profiles(id) on delete restrict,
  name             text        not null,
  description      text,
  category         text,
  file_url         text        not null,
  file_name        text        not null,
  file_size_bytes  bigint,
  mime_type        text,
  tags             text[],
  expiry_date      date,
  is_archived      boolean     not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_documents_property_id  on public.documents(property_id);
create index idx_documents_asset_id     on public.documents(asset_id);
create index idx_documents_zone_id      on public.documents(zone_id);
create index idx_documents_uploaded_by  on public.documents(uploaded_by);
create index idx_documents_category     on public.documents(category);
create index idx_documents_created_at   on public.documents(created_at desc);

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: contractors
-- =============================================================================

create table public.contractors (
  id           uuid        primary key default uuid_generate_v4(),
  property_id  uuid        not null references public.properties(id) on delete cascade,
  name         text        not null,
  company      text,
  email        text,
  phone        text,
  specialties  text[],
  address      text,
  notes        text,
  rating       numeric(2, 1) check (rating between 0 and 5),
  is_preferred boolean     not null default false,
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index idx_contractors_property_id on public.contractors(property_id);
create index idx_contractors_is_active   on public.contractors(is_active);

create trigger contractors_updated_at
  before update on public.contractors
  for each row execute function public.handle_updated_at();

-- Add deferred FK from tasks → contractors now that contractors table exists
alter table public.tasks
  add constraint tasks_contractor_id_fkey
  foreign key (contractor_id) references public.contractors(id) on delete set null;

create index idx_tasks_contractor_id on public.tasks(contractor_id);

-- =============================================================================
-- TABLE: maintenance_records
-- =============================================================================

create table public.maintenance_records (
  id               uuid        primary key default uuid_generate_v4(),
  property_id      uuid        not null references public.properties(id) on delete cascade,
  asset_id         uuid        references public.assets(id) on delete set null,
  zone_id          uuid        references public.zones(id) on delete set null,
  task_id          uuid        references public.tasks(id) on delete set null,
  contractor_id    uuid        references public.contractors(id) on delete set null,
  performed_by     text,
  title            text        not null,
  description      text,
  maintenance_type text        not null,
  performed_at     timestamptz not null,
  next_due_at      timestamptz,
  cost             numeric(12, 2),
  labor_hours      numeric(6, 2),
  parts_used       jsonb,
  attachments      jsonb,
  notes            text,
  created_by       uuid        not null references public.profiles(id) on delete restrict,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index idx_maintenance_records_property_id   on public.maintenance_records(property_id);
create index idx_maintenance_records_asset_id      on public.maintenance_records(asset_id);
create index idx_maintenance_records_zone_id       on public.maintenance_records(zone_id);
create index idx_maintenance_records_task_id       on public.maintenance_records(task_id);
create index idx_maintenance_records_contractor_id on public.maintenance_records(contractor_id);
create index idx_maintenance_records_performed_at  on public.maintenance_records(performed_at desc);

create trigger maintenance_records_updated_at
  before update on public.maintenance_records
  for each row execute function public.handle_updated_at();

-- =============================================================================
-- TABLE: notifications
-- =============================================================================

create table public.notifications (
  id           uuid        primary key default uuid_generate_v4(),
  user_id      uuid        not null references public.profiles(id) on delete cascade,
  property_id  uuid        references public.properties(id) on delete cascade,
  title        text        not null,
  body         text        not null,
  type         text        not null,
  category     text,
  action_url   text,
  metadata     jsonb,
  is_read      boolean     not null default false,
  read_at      timestamptz,
  is_archived  boolean     not null default false,
  created_at   timestamptz not null default now()
);

create index idx_notifications_user_id     on public.notifications(user_id);
create index idx_notifications_property_id on public.notifications(property_id);
create index idx_notifications_is_read     on public.notifications(is_read);
create index idx_notifications_created_at  on public.notifications(created_at desc);

-- =============================================================================
-- TABLE: chat_messages
-- =============================================================================

create table public.chat_messages (
  id                uuid        primary key default uuid_generate_v4(),
  property_id       uuid        not null references public.properties(id) on delete cascade,
  user_id           uuid        not null references public.profiles(id) on delete cascade,
  role              text        not null check (role in ('user', 'assistant', 'system', 'tool')),
  content           text        not null,
  model             text,
  tokens_used       integer,
  context_snapshot  jsonb,
  attachments       jsonb,
  parent_message_id uuid        references public.chat_messages(id) on delete set null,
  created_at        timestamptz not null default now()
);

create index idx_chat_messages_property_id on public.chat_messages(property_id);
create index idx_chat_messages_user_id     on public.chat_messages(user_id);
create index idx_chat_messages_created_at  on public.chat_messages(created_at asc);
create index idx_chat_messages_parent_id   on public.chat_messages(parent_message_id);

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tables
alter table public.profiles            enable row level security;
alter table public.properties          enable row level security;
alter table public.parcels             enable row level security;
alter table public.zones               enable row level security;
alter table public.assets              enable row level security;
alter table public.asset_qr_codes      enable row level security;
alter table public.tasks               enable row level security;
alter table public.sensors             enable row level security;
alter table public.telemetry           enable row level security;
alter table public.automations         enable row level security;
alter table public.documents           enable row level security;
alter table public.contractors         enable row level security;
alter table public.maintenance_records enable row level security;
alter table public.notifications       enable row level security;
alter table public.chat_messages       enable row level security;

-- ---------------------------------------------------------------------------
-- profiles: users can only access their own profile
-- ---------------------------------------------------------------------------
create policy "profiles: owner select"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Helper: check property ownership
-- ---------------------------------------------------------------------------
-- Returns true when the calling user owns the given property_id.
create or replace function public.owns_property(prop_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.properties
    where id = prop_id and owner_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- properties
-- ---------------------------------------------------------------------------
create policy "properties: owner select"
  on public.properties for select
  using (owner_id = auth.uid());

create policy "properties: owner insert"
  on public.properties for insert
  with check (owner_id = auth.uid());

create policy "properties: owner update"
  on public.properties for update
  using (owner_id = auth.uid());

create policy "properties: owner delete"
  on public.properties for delete
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Macro: tables that carry property_id and must be owned through properties
-- (parcels, zones, assets, tasks, sensors, automations, documents,
--  contractors, maintenance_records, chat_messages)
-- ---------------------------------------------------------------------------

-- parcels
create policy "parcels: owner all"
  on public.parcels for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- zones
create policy "zones: owner all"
  on public.zones for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- assets
create policy "assets: owner all"
  on public.assets for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- asset_qr_codes
create policy "asset_qr_codes: owner all"
  on public.asset_qr_codes for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- tasks
create policy "tasks: owner all"
  on public.tasks for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- sensors
create policy "sensors: owner all"
  on public.sensors for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- telemetry
create policy "telemetry: owner all"
  on public.telemetry for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- automations
create policy "automations: owner all"
  on public.automations for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- documents
create policy "documents: owner all"
  on public.documents for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- contractors
create policy "contractors: owner all"
  on public.contractors for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- maintenance_records
create policy "maintenance_records: owner all"
  on public.maintenance_records for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- chat_messages
create policy "chat_messages: owner all"
  on public.chat_messages for all
  using (public.owns_property(property_id))
  with check (public.owns_property(property_id));

-- notifications: scoped to the recipient user
create policy "notifications: user select"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications: user update"
  on public.notifications for update
  using (user_id = auth.uid());

create policy "notifications: user delete"
  on public.notifications for delete
  using (user_id = auth.uid());

-- =============================================================================
-- TRIGGER: auto-create profile on new auth.users row
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', null)
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
