-- ============================================================
-- NUMBER OVER · Migration 00004 — Activations, événements, SMS
-- ============================================================

create table public.activations (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid        not null references public.profiles (id) on delete restrict,
  service_code         text        not null,
  country_iso          text        not null,
  -- Référence unique de l'ordre chez le fournisseur (anti rattachement double)
  provider_order_id    text        unique,
  phone_number         text,
  status               text        not null default 'pending' check (status in (
                         'pending',         -- intention créée, en cours de traitement
                         'waiting',         -- numéro attribué, en attente du SMS
                         'sms_received',    -- SMS reçu, code disponible
                         'completed',       -- activation terminée
                         'cancelled',       -- annulée par l'utilisateur
                         'expired',         -- fenêtre écoulée sans SMS
                         'refund_pending',  -- remboursement en cours
                         'refunded',        -- remboursée
                         'failed'           -- échec (aucun débit ou déjà compensé)
                       )),
  price_client_cents   bigint      check (price_client_cents >= 0),
  cost_provider_cents  bigint      check (cost_provider_cents >= 0),
  currency             text        not null default 'USD',
  -- Clé d'idempotence de bout en bout (générée par le client) — anti double-achat
  idempotency_key      uuid        not null unique,
  expires_at           timestamptz,
  cancel_available_at  timestamptz,
  completed_at         timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table public.activations enable row level security;

create index activations_user_idx    on public.activations (user_id, created_at desc);
create index activations_status_idx  on public.activations (status)
  where status in ('pending', 'waiting', 'sms_received', 'refund_pending');

create trigger activations_set_updated_at
  before update on public.activations
  for each row execute function public.set_updated_at();

-- Journal d'audit du cycle de vie d'une activation (append-only)
create table public.activation_events (
  id            bigint generated always as identity primary key,
  activation_id uuid        not null references public.activations (id) on delete cascade,
  type          text        not null,
  payload       jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now()
);

alter table public.activation_events enable row level security;
create index activation_events_activation_idx on public.activation_events (activation_id, created_at);

-- SMS reçus — doublon impossible grâce à la contrainte unique composite
create table public.sms_messages (
  id            bigint generated always as identity primary key,
  activation_id uuid        not null references public.activations (id) on delete cascade,
  sender        text        not null default '',
  content       text        not null check (char_length(content) > 0),
  code          text,
  received_at   timestamptz not null,
  created_at    timestamptz not null default now(),
  unique (activation_id, content, received_at)
);

alter table public.sms_messages enable row level security;
create index sms_messages_activation_idx on public.sms_messages (activation_id, received_at);
