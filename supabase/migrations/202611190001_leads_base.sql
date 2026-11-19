-- Base schema for a dedicated agency Supabase project.
create table if not exists public.leads (
  crm_id uuid not null default gen_random_uuid(),
  name text,
  email text,
  phone text,
  status text default 'NUOVO',
  source text,
  created_at timestamptz default now(),
  message text,
  gmail_message_id text
);

alter table public.leads add column if not exists crm_id uuid not null default gen_random_uuid();
alter table public.leads add column if not exists name text;
alter table public.leads add column if not exists email text;
alter table public.leads add column if not exists phone text;
alter table public.leads add column if not exists status text;
alter table public.leads add column if not exists source text;
alter table public.leads add column if not exists created_at timestamptz;
alter table public.leads add column if not exists message text;
alter table public.leads add column if not exists gmail_message_id text;

create unique index if not exists leads_gmail_message_id_uidx
  on public.leads (gmail_message_id);

create unique index if not exists leads_crm_id_uidx
  on public.leads (crm_id);

alter table public.leads enable row level security;
grant select on table public.leads to authenticated;
