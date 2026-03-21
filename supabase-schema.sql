-- ============================================================
-- MIDILLI Community Gallery — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Gallery posts
create table if not exists gallery_posts (
  id          uuid default gen_random_uuid() primary key,
  image_url   text not null,
  prompt      text,
  username    text not null default 'Anonymous',
  model       text,
  created_at  timestamptz default now()
);

-- 2. Likes (one per user per post)
create table if not exists gallery_likes (
  id          uuid default gen_random_uuid() primary key,
  post_id     uuid references gallery_posts(id) on delete cascade not null,
  username    text not null,
  created_at  timestamptz default now(),
  unique(post_id, username)
);

-- 3. Comments
create table if not exists gallery_comments (
  id          uuid default gen_random_uuid() primary key,
  post_id     uuid references gallery_posts(id) on delete cascade not null,
  username    text not null,
  content     text not null,
  created_at  timestamptz default now()
);

-- Enable Row Level Security
alter table gallery_posts    enable row level security;
alter table gallery_likes    enable row level security;
alter table gallery_comments enable row level security;

-- Public read/write policies (no auth required for MVP)
create policy "public read posts"    on gallery_posts    for select using (true);
create policy "public insert posts"  on gallery_posts    for insert with check (true);

create policy "public read likes"    on gallery_likes    for select using (true);
create policy "public insert likes"  on gallery_likes    for insert with check (true);
create policy "public delete likes"  on gallery_likes    for delete using (true);

create policy "public read comments"   on gallery_comments for select using (true);
create policy "public insert comments" on gallery_comments for insert with check (true);
