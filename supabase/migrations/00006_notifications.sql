-- ============================================================
-- NUMBER OVER · Migration 00006 — Notifications
-- ============================================================

create table public.notifications (
  id         bigint generated always as identity primary key,
  user_id    uuid        not null references public.profiles (id) on delete cascade,
  type       text        not null check (type in ('sms', 'activation', 'wallet', 'system')),
  title      text        not null check (char_length(title) between 1 and 140),
  body       text        not null default '',
  data       jsonb       not null default '{}'::jsonb,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create index notifications_user_idx   on public.notifications (user_id, created_at desc);
create index notifications_unread_idx on public.notifications (user_id) where read_at is null;
