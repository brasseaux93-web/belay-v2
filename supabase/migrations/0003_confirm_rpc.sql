-- =============================================================================
-- BELAY — Supabase deployment artifact: confirm_block() RPC
-- =============================================================================
-- Apply AFTER 0002_blocks_events.sql.
--
-- Confirmers call this RPC instead of issuing a direct UPDATE. Running as
-- SECURITY DEFINER means it executes with the permissions of its owner
-- (the Supabase postgres role), bypassing the confirmer-only UPDATE policy
-- while still performing all business-rule checks inside the function body.
-- This is the canonical way to let a restricted caller apply a locked, atomic
-- update without granting them broad column-level write access.
-- =============================================================================

create or replace function public.confirm_block(p_block_id text)
returns public.blocks
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_email text;
  v_block        public.blocks;
  v_now          bigint;
begin
  -- Resolve the caller's verified email from the JWT claim.
  v_caller_email := lower(auth.jwt() ->> 'email');
  if v_caller_email is null or v_caller_email = '' then
    raise exception 'caller email not found in JWT' using errcode = 'P0001';
  end if;

  -- Lock the row for the duration of this transaction.
  select * into v_block
  from public.blocks
  where id = p_block_id
  for update;

  if not found then
    raise exception 'block not found' using errcode = 'P0002';
  end if;

  -- Only the assigned confirmer may confirm.
  if v_block.confirmer_email <> v_caller_email then
    raise exception 'caller is not the assigned confirmer' using errcode = 'P0003';
  end if;

  -- Business rules: block must be in a confirmable state.
  -- Mirrors canConfirm() in src/lib/belay/clock.ts.
  if v_block.status not in ('claimed_showed_up', 'claimed_used_but_here') then
    raise exception 'block is not in a confirmable state (status: %)', v_block.status
      using errcode = 'P0004';
  end if;

  if v_block.received_at is not null then
    raise exception 'block has already been confirmed' using errcode = 'P0005';
  end if;

  v_now := extract(epoch from now()) * 1000; -- Unix ms

  -- Apply the confirmation.
  update public.blocks
  set
    status      = 'received',
    received_at = v_now
  where id = p_block_id;

  -- Insert the CONFIRMED event.
  insert into public.events (id, block_id, type, timestamp, actor_id)
  values (
    gen_random_uuid()::text,
    p_block_id,
    'CONFIRMED',
    v_now,
    auth.uid()
  );

  -- Return the updated row.
  select * into v_block from public.blocks where id = p_block_id;
  return v_block;
end;
$$;

-- Revoke default public execute, grant only to authenticated users.
revoke execute on function public.confirm_block(text) from public;
grant  execute on function public.confirm_block(text) to authenticated;

comment on function public.confirm_block(text) is
  'Atomically marks a block as received and inserts the CONFIRMED event. '
  'Callable only by the assigned confirmer (verified via JWT email claim). '
  'Prefer this over a direct UPDATE to blocks.';
