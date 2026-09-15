create table if not exists blocks (
  id text primary key,
  client_id text not null,
  confirmer_email text not null,
  task text not null,
  start_time bigint not null,
  duration_minutes int not null default 90,
  status text not null,
  claim text,
  received_at bigint,
  pause_until bigint,
  created_at timestamptz not null default now()
);

create index if not exists blocks_client_id_idx on blocks (client_id);
create index if not exists blocks_confirmer_email_idx on blocks (confirmer_email);
create index if not exists blocks_start_time_idx on blocks (start_time desc);

create table if not exists events (
  id text primary key,
  block_id text not null references blocks(id) on delete cascade,
  type text not null,
  timestamp bigint not null,
  actor_id text,
  created_at timestamptz not null default now()
);

create index if not exists events_block_id_idx on events (block_id);
