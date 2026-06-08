-- Migration: add `area` to daily_todos so todos keep their color/category.
-- Run in the Supabase SQL editor.
alter table public.daily_todos
  add column if not exists area text not null default 'discipline';
