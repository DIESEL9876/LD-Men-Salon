-- =========================================================
-- Barber booking app - Supabase schema
-- Run in Supabase SQL editor (Database -> SQL editor -> New query)
-- =========================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  push_token text,
  created_at timestamptz not null default now()
);

-- 2. Barbers
create table if not exists public.barbers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  bio text,
  photo_url text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3. Services
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  duration_minutes int not null default 30,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 4. Working hours per barber (0=Sunday .. 6=Saturday)
create table if not exists public.working_hours (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references public.barbers(id) on delete cascade,
  day_of_week int not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  unique (barber_id, day_of_week)
);

-- 5. Time off (blocked ranges)
create table if not exists public.time_off (
  id uuid primary key default gen_random_uuid(),
  barber_id uuid not null references public.barbers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  reason text
);

-- 6. Appointments
create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  barber_id uuid not null references public.barbers(id) on delete restrict,
  service_id uuid not null references public.services(id) on delete restrict,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','completed')),
  payment_method text not null default 'in_store' check (payment_method in ('in_store','in_app')),
  payment_status text not null default 'pending' check (payment_status in ('pending','paid','refunded')),
  price numeric(10,2),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists appointments_barber_time_idx
  on public.appointments (barber_id, starts_at);
create index if not exists appointments_user_time_idx
  on public.appointments (user_id, starts_at);

-- =========================================================
-- Row Level Security
-- =========================================================

alter table public.profiles enable row level security;
alter table public.barbers enable row level security;
alter table public.services enable row level security;
alter table public.working_hours enable row level security;
alter table public.time_off enable row level security;
alter table public.appointments enable row level security;

-- Helper: is_admin()
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
drop policy if exists profiles_own_read on public.profiles;
create policy profiles_own_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists profiles_own_update on public.profiles;
create policy profiles_own_update on public.profiles
  for update using (auth.uid() = id);

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (public.is_admin());

-- barbers
drop policy if exists barbers_read on public.barbers;
create policy barbers_read on public.barbers
  for select using (active or public.is_admin());

drop policy if exists barbers_admin_write on public.barbers;
create policy barbers_admin_write on public.barbers
  for all using (public.is_admin()) with check (public.is_admin());

-- services
drop policy if exists services_read on public.services;
create policy services_read on public.services
  for select using (active or public.is_admin());

drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- working_hours
drop policy if exists working_hours_read on public.working_hours;
create policy working_hours_read on public.working_hours
  for select using (true);

drop policy if exists working_hours_admin_write on public.working_hours;
create policy working_hours_admin_write on public.working_hours
  for all using (public.is_admin()) with check (public.is_admin());

-- time_off
drop policy if exists time_off_read on public.time_off;
create policy time_off_read on public.time_off
  for select using (true);

drop policy if exists time_off_admin_write on public.time_off;
create policy time_off_admin_write on public.time_off
  for all using (public.is_admin()) with check (public.is_admin());

-- appointments
drop policy if exists appointments_read on public.appointments;
create policy appointments_read on public.appointments
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists appointments_insert on public.appointments;
create policy appointments_insert on public.appointments
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists appointments_update on public.appointments;
create policy appointments_update on public.appointments
  for update using (user_id = auth.uid() or public.is_admin());

drop policy if exists appointments_delete on public.appointments;
create policy appointments_delete on public.appointments
  for delete using (user_id = auth.uid() or public.is_admin());

-- =========================================================
-- Auto-create profile row on auth signup
-- =========================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =========================================================
-- Seed helper: after creating your first user via the app,
-- run this to make that user an admin:
--   update public.profiles set role = 'admin' where id = '<user-id>';
-- =========================================================
