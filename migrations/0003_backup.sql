alter table blocks add column if not exists backup_email text;
create index if not exists blocks_backup_email_idx on blocks (backup_email);
