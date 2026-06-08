-- ============================================================
-- Life OS — Supabase schema
-- Run this in the Supabase SQL editor (or via the CLI).
-- Single-user app: every table is scoped by user_id with RLS.
-- ============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- Daily todos
-- ----------------------------------------------------------------
create table if not exists public.daily_todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  text text not null,
  completed boolean not null default false,
  ai_generated boolean not null default false,
  area text not null default 'discipline',
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- If the table already existed without `area`, add it:
alter table public.daily_todos
  add column if not exists area text not null default 'discipline';

-- ----------------------------------------------------------------
-- Habits
-- ----------------------------------------------------------------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  area text not null,
  target_frequency int not null default 7,
  created_at timestamptz not null default now()
);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  date date not null default current_date,
  completed boolean not null default false,
  unique (habit_id, date)
);

-- ----------------------------------------------------------------
-- Finanzas — Portafolio
-- ----------------------------------------------------------------
create table if not exists public.portfolio_positions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ticker text not null,
  shares numeric not null,
  currency text not null default 'COP',
  last_updated timestamptz not null default now()
);

create table if not exists public.portfolio_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  total_value_cop numeric not null,
  unique (user_id, date)
);

-- ----------------------------------------------------------------
-- Finanzas — Agencia
-- ----------------------------------------------------------------
create table if not exists public.agency_clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  monthly_usd numeric not null default 0,
  status text not null default 'pipeline',
  notes text
);

create table if not exists public.agency_income_log (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.agency_clients (id) on delete cascade,
  month date not null,
  amount_usd numeric not null,
  received boolean not null default false
);

-- ----------------------------------------------------------------
-- Finanzas — Personal
-- ----------------------------------------------------------------
create table if not exists public.personal_income (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  month date not null,
  source text not null,
  amount_cop numeric not null
);

create table if not exists public.personal_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  category text not null,
  amount_cop numeric not null,
  note text
);

-- ----------------------------------------------------------------
-- Colegio
-- ----------------------------------------------------------------
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null
);

create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.subjects (id) on delete cascade,
  date date not null default current_date,
  description text,
  grade numeric not null,
  max_grade numeric not null default 7,
  pdf_url text
);

-- ----------------------------------------------------------------
-- Health
-- ----------------------------------------------------------------
create table if not exists public.health_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  steps int,
  sleep_hours numeric,
  hrv numeric,
  resting_hr int,
  active_calories int,
  unique (user_id, date)
);

-- ----------------------------------------------------------------
-- Scores diarios (calculados)
-- ----------------------------------------------------------------
create table if not exists public.daily_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  score_health numeric,
  score_discipline numeric,
  score_school numeric,
  score_finance numeric,
  score_agency numeric,
  score_global numeric,
  unique (user_id, date)
);

-- ----------------------------------------------------------------
-- Daily highlights (momento memorable)
-- ----------------------------------------------------------------
create table if not exists public.daily_highlights (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  date date not null default current_date,
  text text not null,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

-- ============================================================
-- Row Level Security
-- Each user can only access their own rows. Child tables are
-- guarded through their parent's user_id.
-- ============================================================
do $$
declare
  t text;
  user_tables text[] := array[
    'daily_todos','habits','portfolio_positions','portfolio_snapshots',
    'agency_clients','personal_income','personal_expenses','subjects',
    'health_logs','daily_scores','daily_highlights'
  ];
begin
  foreach t in array user_tables loop
    execute format('alter table public.%I enable row level security;', t);
    execute format($f$
      create policy "owner_all_%1$s" on public.%1$I
      for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
    $f$, t);
  end loop;
end $$;

-- Explicit todos policy (idempotent) — guards against the loop above not
-- having applied on an earlier deploy. Safe to run on its own.
alter table public.daily_todos enable row level security;
drop policy if exists "users_own_todos" on public.daily_todos;
create policy "users_own_todos" on public.daily_todos
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Daily highlights (idempotent)
alter table public.daily_highlights enable row level security;
drop policy if exists "owner_highlights" on public.daily_highlights;
create policy "owner_highlights" on public.daily_highlights
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Child tables: scope via the parent relationship.
alter table public.habit_logs enable row level security;
create policy "owner_habit_logs" on public.habit_logs for all
  using (exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid()))
  with check (exists (select 1 from public.habits h where h.id = habit_id and h.user_id = auth.uid()));

alter table public.agency_income_log enable row level security;
create policy "owner_agency_income_log" on public.agency_income_log for all
  using (exists (select 1 from public.agency_clients c where c.id = client_id and c.user_id = auth.uid()))
  with check (exists (select 1 from public.agency_clients c where c.id = client_id and c.user_id = auth.uid()));

alter table public.grades enable row level security;
create policy "owner_grades" on public.grades for all
  using (exists (select 1 from public.subjects s where s.id = subject_id and s.user_id = auth.uid()))
  with check (exists (select 1 from public.subjects s where s.id = subject_id and s.user_id = auth.uid()));
