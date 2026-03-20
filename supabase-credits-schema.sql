-- ============================================================
-- MIDILLI User Credits — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Credits table (one row per user)
create table if not exists user_credits (
  user_id    uuid references auth.users(id) on delete cascade primary key,
  credits    int not null default 10,
  updated_at timestamptz default now()
);

-- 2. Row-level security
alter table user_credits enable row level security;

create policy "users read own credits"
  on user_credits for select
  using (auth.uid() = user_id);

create policy "users update own credits"
  on user_credits for update
  using (auth.uid() = user_id);

create policy "service insert credits"
  on user_credits for insert
  with check (true);

-- 3. Auto-give 10 credits on every new signup
create or replace function handle_new_user_credits()
returns trigger as $$
begin
  insert into user_credits (user_id, credits)
  values (new.id, 10)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created_credits on auth.users;
create trigger on_auth_user_created_credits
  after insert on auth.users
  for each row execute procedure handle_new_user_credits();
