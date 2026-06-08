-- Migration: daily_highlights for "momento memorable del día"
create table if not exists public.daily_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  text text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

alter table public.daily_highlights enable row level security;
drop policy if exists "owner_highlights" on public.daily_highlights;
create policy "owner_highlights" on public.daily_highlights
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
