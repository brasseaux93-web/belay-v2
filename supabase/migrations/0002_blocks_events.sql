-- =============================================================================
-- BELAY — Supabase deployment artifact: blocks + events tables
-- =============================================================================
-- Apply AFTER 0001_profiles.sql.
-- This mirrors migrations/0002_blocks.sql + migrations/0003_backup.sql but
-- adds Supabase-native RLS policies. The column layout and types are
-- intentionally identical to the Neon schema so data can be moved between
-- backends without transformation.
--
-- Timestamp columns use bigint (Unix ms) to match the application model —
-- the app stores and reads numeric ms timestamps, not timestamptz.
-- =============================================================================

-- ── blocks ────────────────────────────────────────────────────────────────────
create table if not exists public.blocks (
  id               text        primary key,
  -- The authenticated user who started this check-in.
  client_id        uuid        not null references auth.users (id) on delete cascade,
  -- Email of the person who must confirm. Stored lowercase.
  confirmer_email  text        not null,
  -- Optional backup notified if the block goes "dark".
  backup_email     text,
  task             text        not null,
  -- Unix ms timestamps.
  start_time       bigint      not null,
  duration_minutes int         not null default 90,
  status           text        not null,
  claim            text,
  received_at      bigint,
  pause_until      bigint,
  created_at       timestamptz not null default now()
);

create index if not exists blocks_client_id_idx      on public.blocks (client_id);
create index if not exists blocks_confirmer_email_idx on public.blocks (confirmer_email);
create index if not exists blocks_backup_email_idx    on public.blocks (backup_email);
create index if not exists blocks_start_time_idx      on public.blocks (start_time desc);

-- ── blocks RLS ───────────────────────────────────────────────────────────────
alter table public.blocks enable row level security;

-- 1. Clients (block owners) have full read access to their own blocks.
drop policy if exists "blocks_client_select" on public.blocks;
create policy "blocks_client_select"
  on public.blocks
  for select
  to authenticated
  using (client_id = auth.uid());

-- 2. Clients can start new blocks.
drop policy if exists "blocks_client_insert" on public.blocks;
create policy "blocks_client_insert"
  on public.blocks
  for insert
  to authenticated
  with check (client_id = auth.uid());

-- 3. Clients can perform all status transitions on their own blocks.
drop policy if exists "blocks_client_update" on public.blocks;
create policy "blocks_client_update"
  on public.blocks
  for update
  to authenticated
  using  (client_id = auth.uid())
  with check (client_id = auth.uid());

-- 4. Confirmers can read blocks assigned to them.
drop policy if exists "blocks_confirmer_select" on public.blocks;
create policy "blocks_confirmer_select"
  on public.blocks
  for select
  to authenticated
  using (confirmer_email = lower(auth.jwt() ->> 'email'));

-- 5. Backups can read blocks where they are listed as backup.
drop policy if exists "blocks_backup_select" on public.blocks;
create policy "blocks_backup_select"
  on public.blocks
  for select
  to authenticated
  using (backup_email = lower(auth.jwt() ->> 'email'));

-- 6. Confirmers may update ONLY the received_at and status columns — and only to
--    the values that mark a block as received. All other column changes are
--    rejected by the with check clause. Prefer calling the confirm_block() RPC
--    (0003_confirm_rpc.sql) which enforces this atomically in a SECURITY DEFINER
--    function, but this policy also gates direct UPDATE attempts.
drop policy if exists "blocks_confirmer_update" on public.blocks;
create policy "blocks_confirmer_update"
  on public.blocks
  for update
  to authenticated
  using  (confirmer_email = lower(auth.jwt() ->> 'email'))
  with check (
    confirmer_email = lower(auth.jwt() ->> 'email')
    and status      = 'received'
    and received_at is not null
  );

-- ── events ────────────────────────────────────────────────────────────────────
create table if not exists public.events (
  id         text    primary key,
  block_id   text    not null references public.blocks (id) on delete cascade,
  type       text    not null,
  -- Unix ms.
  timestamp  bigint  not null,
  actor_id   uuid,
  created_at timestamptz not null default now()
);

create index if not exists events_block_id_idx on public.events (block_id);

-- ── events RLS ───────────────────────────────────────────────────────────────
alter table public.events enable row level security;

-- Events are readable by anyone who can see the parent block.
drop policy if exists "events_select_via_block" on public.events;
create policy "events_select_via_block"
  on public.events
  for select
  to authenticated
  using (
    exists (
      select 1 from public.blocks b
      where b.id = events.block_id
        and (
          b.client_id       = auth.uid()
          or b.confirmer_email = lower(auth.jwt() ->> 'email')
          or b.backup_email    = lower(auth.jwt() ->> 'email')
        )
    )
  );

-- Clients may insert standard client-side event types on their own blocks.
drop policy if exists "events_client_insert" on public.events;
create policy "events_client_insert"
  on public.events
  for insert
  to authenticated
  with check (
    type in ('SCHEDULED','STARTED','SHOWED_UP','USED_BUT_HERE','MISSED','ABOUT_TO_USE','PAUSE_ENDED','DARK')
    and exists (
      select 1 from public.blocks b
      where b.id = events.block_id
        and b.client_id = auth.uid()
    )
  );

-- Confirmers may only insert CONFIRMED events on blocks assigned to them.
drop policy if exists "events_confirmer_insert" on public.events;
create policy "events_confirmer_insert"
  on public.events
  for insert
  to authenticated
  with check (
    type = 'CONFIRMED'
    and exists (
      select 1 from public.blocks b
      where b.id = events.block_id
        and b.confirmer_email = lower(auth.jwt() ->> 'email')
    )
  );
