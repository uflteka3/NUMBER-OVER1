-- ============================================================
-- NUMBER OVER · Migration 00003 — Catalogue & couche provider
-- ============================================================

-- Référentiels d'affichage NUMBER OVER (noms, drapeaux, catégories)
create table public.countries (
  iso    char(2) primary key,
  name   text        not null,
  flag   text        not null default '🏳️',
  active boolean     not null default true,
  sort   integer     not null default 100
);

create table public.services (
  code     text primary key,              -- code fournisseur (ex. 'wa', 'tg')
  name     text        not null,
  tint     text        not null default '#6f6cff',
  category text        not null default 'Autre',
  active   boolean     not null default true,
  sort     integer     not null default 100
);

-- Compte(s) fournisseur — AUCUN secret en base (les clés vivent en variables d'env)
create table public.provider_accounts (
  id                 uuid primary key default gen_random_uuid(),
  provider           text not null default 'virtualsms',
  label              text not null default 'Compte principal',
  last_balance_cents bigint check (last_balance_cents is null or last_balance_cents >= 0),
  last_synced_at     timestamptz,
  created_at         timestamptz not null default now()
);

-- Miroirs du catalogue fournisseur (synchronisation planifiée)
create table public.provider_services (
  code      text primary key,
  name      text        not null,
  raw       jsonb       not null default '{}'::jsonb,
  active    boolean     not null default true,
  synced_at timestamptz not null default now()
);

create table public.provider_countries (
  iso       text primary key,
  name      text        not null,
  raw       jsonb       not null default '{}'::jsonb,
  synced_at timestamptz not null default now()
);

create table public.provider_prices (
  service_code text        not null,
  country_iso  text        not null,
  cost_cents   bigint      not null check (cost_cents >= 0),
  stock        integer     not null default 0 check (stock >= 0),
  currency     text        not null default 'USD',
  fetched_at   timestamptz not null default now(),
  primary key (service_code, country_iso)
);

create index provider_prices_lookup_idx
  on public.provider_prices (country_iso, service_code)
  where stock > 0;

-- Moteur de prix : marges appliquées au coût fournisseur.
-- type 'percent' → value en % (ex. 30.00) · type 'fixed' → value en cents (prix imposé)
create table public.pricing_rules (
  id           uuid primary key default gen_random_uuid(),
  scope        text        not null check (scope in ('global', 'service', 'country', 'service_country')),
  service_code text,
  country_iso  text,
  type         text        not null check (type in ('percent', 'fixed')),
  value        numeric(12, 2) not null check (value >= 0),
  priority     integer     not null default 100,
  active       boolean     not null default true,
  created_by   uuid        references public.profiles (id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (
    (scope = 'global')           or
    (scope = 'service'           and service_code is not null and country_iso is null) or
    (scope = 'country'           and country_iso  is not null and service_code is null) or
    (scope = 'service_country'   and service_code is not null and country_iso is not null)
  )
);

alter table public.countries           enable row level security;
alter table public.services            enable row level security;
alter table public.provider_accounts   enable row level security;
alter table public.provider_services   enable row level security;
alter table public.provider_countries  enable row level security;
alter table public.provider_prices     enable row level security;
alter table public.pricing_rules       enable row level security;

create trigger pricing_rules_set_updated_at
  before update on public.pricing_rules
  for each row execute function public.set_updated_at();
