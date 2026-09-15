-- =============================================================================
-- BELAY — Supabase deployment artifact: profiles table
-- =============================================================================
-- Apply this to a Supabase project via the SQL editor or supabase db push.
-- This file is a STANDALONE deployment artifact — it is NOT used by the
-- local Neon / PGLite path (migrations/). Do not import it from src/.
-- =============================================================================

-- Profiles: one row per auth.users entry. Stores display preferences only.
-- The id column is a foreign key to auth.users.id (Supabase Auth UUID).
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ── Row-Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Authenticated users can only read their own profile.
create policy "profiles_select_own"
  on public.profiles
  for select
  to authenticated
  using (id = auth.uid());

-- Authenticated users can only update their own profile.
create policy "profiles_update_own"
  on public.profiles
  for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- The auto-insert trigger (below) fires as the service role, so the inserting
-- policy grants the service role insert access — not end users directly.
create policy "profiles_insert_service"
  on public.profiles
  for insert
  to service_role
  with check (true);

-- ── Auto-insert trigger ───────────────────────────────────────────────────────
-- Creates a profile row whenever a new user signs up via Supabase Auth,
-- so applications never need to manually seed the profiles table.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop-then-create makes this idempotent on re-run.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Updated-at trigger ────────────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
