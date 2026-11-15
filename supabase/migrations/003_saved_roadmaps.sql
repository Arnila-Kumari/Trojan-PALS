-- Trojan PALS: saved research roadmaps and saved chats (max 3 each per student).
-- Run once in Supabase SQL Editor after 001_backend.sql. Safe to re-run.

create table if not exists public.saved_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  query text not null check (char_length(query) between 2 and 300),
  level text not null check (level in ('Undergraduate', 'Master''s', 'PhD')),
  target text check (target is null or char_length(target) <= 160),
  done text[] not null default '{}' check (cardinality(done) <= 60),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists saved_roadmaps_user on public.saved_roadmaps (user_id, created_at);

-- Hard limit of 3 roadmaps per student, enforced in the database too.
create or replace function public.limit_saved_roadmaps() returns trigger
language plpgsql security definer set search_path = pg_catalog, public as $$
begin
  if (select count(*) from public.saved_roadmaps where user_id = new.user_id) >= 3 then
    raise exception 'roadmap_limit' using errcode = 'P0001';
  end if;
  return new;
end; $$;
drop trigger if exists saved_roadmaps_limit on public.saved_roadmaps;
create trigger saved_roadmaps_limit before insert on public.saved_roadmaps
  for each row execute function public.limit_saved_roadmaps();

drop trigger if exists saved_roadmaps_updated on public.saved_roadmaps;
create trigger saved_roadmaps_updated before update on public.saved_roadmaps
  for each row execute function public.set_updated_at();

alter table public.saved_roadmaps enable row level security;
revoke all on public.saved_roadmaps from public, anon, authenticated;
grant select, delete on public.saved_roadmaps to authenticated;
grant insert (user_id, title, query, level, target, done) on public.saved_roadmaps to authenticated;
grant update (done) on public.saved_roadmaps to authenticated;

drop policy if exists saved_roadmaps_owner on public.saved_roadmaps;
create policy saved_roadmaps_owner on public.saved_roadmaps for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists usc_email_required on public.saved_roadmaps;
create policy usc_email_required on public.saved_roadmaps as restrictive for all to authenticated
  using ((select public.is_usc_user())) with check ((select public.is_usc_user()));

-- ------------------------------------------------------------------
-- Saved chatbot conversations (max 3 per student). Same file so one run sets up both.
create table if not exists public.saved_chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  messages jsonb not null check (jsonb_typeof(messages) = 'array' and jsonb_array_length(messages) <= 60
                                 and octet_length(messages::text) <= 120000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists saved_chats_user on public.saved_chats (user_id, updated_at);

create or replace function public.limit_saved_chats() returns trigger
language plpgsql security definer set search_path = pg_catalog, public as $$
begin
  if (select count(*) from public.saved_chats where user_id = new.user_id) >= 3 then
    raise exception 'chat_limit' using errcode = 'P0001';
  end if;
  return new;
end; $$;
drop trigger if exists saved_chats_limit on public.saved_chats;
create trigger saved_chats_limit before insert on public.saved_chats
  for each row execute function public.limit_saved_chats();
drop trigger if exists saved_chats_updated on public.saved_chats;
create trigger saved_chats_updated before update on public.saved_chats
  for each row execute function public.set_updated_at();

alter table public.saved_chats enable row level security;
revoke all on public.saved_chats from public, anon, authenticated;
grant select, delete on public.saved_chats to authenticated;
grant insert (user_id, title, messages) on public.saved_chats to authenticated;
grant update (title, messages) on public.saved_chats to authenticated;

drop policy if exists saved_chats_owner on public.saved_chats;
create policy saved_chats_owner on public.saved_chats for all to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
drop policy if exists usc_email_required on public.saved_chats;
create policy usc_email_required on public.saved_chats as restrictive for all to authenticated
  using ((select public.is_usc_user())) with check ((select public.is_usc_user()));
