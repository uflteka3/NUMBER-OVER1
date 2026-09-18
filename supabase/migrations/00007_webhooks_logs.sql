-- ============================================================
-- NUMBER OVER · Migration 00007 — Webhooks, logs, réglages
-- ============================================================

-- Réception des webhooks fournisseur — idempotence garantie par
-- l'unicité de event_id (ULID 'evt_…') et delivery_id (UUID de livraison).
create table public.webhook_events (
  id              bigint generated always as identity primary key,
  provider        text        not null default 'virtualsms',
  event_id        text        unique,
  delivery_id     text        unique,
  type            text        not null,
  order_id        text,
  signature_valid boolean     not null default false,
  payload         jsonb       not null,
  status          text        not null default 'received'
                  check (status in ('received', 'processed', 'failed', 'ignored')),
  attempts        integer     not null default 0,
  last_error      text,
  received_at     timestamptz not null default now(),
  processed_at    timestamptz
);

alter table public.webhook_events enable row level security;
create index webhook_events_type_idx     on public.webhook_events (type, received_at desc);
create index webhook_events_order_idx    on public.webhook_events (order_id) where order_id is not null;
create index webhook_events_pending_idx  on public.webhook_events (received_at)
  where status in ('received', 'failed');

-- Journal des appels API fournisseur — SANITISÉ par construction :
-- endpoint + statut + latence uniquement, jamais de clé ni de corps sensible.
create table public.provider_api_logs (
  id          bigint generated always as identity primary key,
  provider    text        not null default 'virtualsms',
  method      text        not null,
  endpoint    text        not null,           -- chemin seulement (aucune query avec clé)
  status_code integer     not null,
  latency_ms  integer     check (latency_ms is null or latency_ms >= 0),
  error_code  text,                            -- code stable fournisseur (no_numbers…)
  order_id    text,
  request_id  text,
  created_at  timestamptz not null default now()
);

alter table public.provider_api_logs enable row level security;
create index provider_api_logs_time_idx on public.provider_api_logs (created_at desc);
create index provider_api_logs_error_idx on public.provider_api_logs (error_code)
  where error_code is not null;

-- Journal d'audit (actions sensibles, admin et système)
create table public.audit_logs (
  id         bigint generated always as identity primary key,
  actor_id   uuid,
  actor_type text        not null default 'system' check (actor_type in ('user', 'admin', 'system')),
  action     text        not null,
  entity     text        not null,
  entity_id  text,
  diff       jsonb       not null default '{}'::jsonb,
  ip         inet,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;
create index audit_logs_time_idx   on public.audit_logs (created_at desc);
create index audit_logs_entity_idx on public.audit_logs (entity, entity_id);

-- Réglages plateforme (marge globale, feature flags, seuils…)
create table public.site_settings (
  key        text primary key,
  value      jsonb       not null,
  updated_at timestamptz not null default now(),
  updated_by uuid        references public.profiles (id)
);

alter table public.site_settings enable row level security;

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();
