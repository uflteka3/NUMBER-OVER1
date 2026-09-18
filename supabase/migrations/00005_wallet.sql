-- ============================================================
-- NUMBER OVER · Migration 00005 — Wallet, ledger, paiements, refunds
--
-- Principes :
--  · montants en cents (bigint), jamais de flottant ;
--  · TOUTE variation de solde = 1 ligne wallet_transactions (append-only) ;
--  · débit/crédit uniquement via fonctions transactionnelles idempotentes ;
--  · jamais d'UPDATE direct du solde depuis l'application.
-- ============================================================

create table public.wallet_accounts (
  user_id       uuid primary key references public.profiles (id) on delete restrict,
  balance_cents bigint      not null default 0 check (balance_cents >= 0),
  currency      text        not null default 'USD',
  version       bigint      not null default 0,   -- optimistic locking
  updated_at    timestamptz not null default now()
);

alter table public.wallet_accounts enable row level security;

create table public.wallet_transactions (
  id                  bigint generated always as identity primary key,
  user_id             uuid        not null references public.profiles (id) on delete restrict,
  type                text        not null check (type in ('credit', 'debit', 'refund', 'adjustment')),
  amount_cents        bigint      not null check (amount_cents > 0),
  currency            text        not null default 'USD',
  status              text        not null default 'confirmed' check (status in ('pending', 'confirmed', 'failed')),
  reference_type      text,                       -- 'activation' | 'topup' | 'refund' | 'admin' …
  reference_id        text,
  idempotency_key     text        unique,         -- anti double exécution
  description         text,
  -- Solde après opération (traçabilité comptable)
  balance_after_cents bigint      check (balance_after_cents >= 0),
  created_at          timestamptz not null default now()
);

alter table public.wallet_transactions enable row level security;
create index wallet_transactions_user_idx on public.wallet_transactions (user_id, created_at desc);

create table public.topups (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid        not null references public.profiles (id) on delete restrict,
  amount_cents  bigint      not null check (amount_cents > 0),
  currency      text        not null default 'USD',
  status        text        not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'expired')),
  provider      text,                       -- 'stripe' | 'nowpayments' | …
  external_ref  text        unique,          -- référence unique côté PSP (anti double crédit)
  created_at    timestamptz not null default now(),
  confirmed_at  timestamptz
);

alter table public.topups enable row level security;
create index topups_user_idx on public.topups (user_id, created_at desc);

create table public.payments (
  id           uuid primary key default gen_random_uuid(),
  topup_id     uuid        not null references public.topups (id) on delete cascade,
  provider     text        not null,
  provider_ref text        not null unique,
  amount_cents bigint      not null check (amount_cents > 0),
  currency     text        not null default 'USD',
  status       text        not null default 'pending',
  raw          jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

alter table public.payments enable row level security;
create index payments_topup_idx on public.payments (topup_id);

create table public.refunds (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     uuid   not null references public.profiles (id) on delete restrict,
  activation_id               uuid   not null unique references public.activations (id) on delete restrict,
  amount_cents                bigint not null check (amount_cents > 0),
  provider_refund_amount_cents bigint check (provider_refund_amount_cents is null or provider_refund_amount_cents >= 0),
  reason                      text,
  provider_ref                text,
  wallet_transaction_id       bigint not null references public.wallet_transactions (id),
  created_at                  timestamptz not null default now()
);

alter table public.refunds enable row level security;
create index refunds_user_idx on public.refunds (user_id, created_at desc);

-- ------------------------------------------------------------
-- wallet_debit : débit atomique + idempotent
-- ------------------------------------------------------------
create or replace function public.wallet_debit(
  p_user_id         uuid,
  p_amount_cents    bigint,
  p_idempotency_key text,
  p_reference_type  text default null,
  p_reference_id    text default null,
  p_description     text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_id bigint;
  v_balance     bigint;
  v_new_balance bigint;
  v_tx_id       bigint;
begin
  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'invalid_amount';
  end if;

  -- Idempotence : clé déjà traitée → retourne la transaction existante
  select id into v_existing_id
  from public.wallet_transactions
  where idempotency_key = p_idempotency_key;
  if v_existing_id is not null then
    return v_existing_id;
  end if;

  insert into public.wallet_accounts (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  -- Verrou de ligne : sérialise les débits concurrents du même compte
  select balance_cents into v_balance
  from public.wallet_accounts
  where user_id = p_user_id
  for update;

  if v_balance < p_amount_cents then
    raise exception 'insufficient_funds';
  end if;

  v_new_balance := v_balance - p_amount_cents;

  begin
    insert into public.wallet_transactions (
      user_id, type, amount_cents, currency, status,
      reference_type, reference_id, idempotency_key, description, balance_after_cents
    ) values (
      p_user_id, 'debit', p_amount_cents, 'USD', 'confirmed',
      p_reference_type, p_reference_id, p_idempotency_key, p_description, v_new_balance
    )
    returning id into v_tx_id;
  exception
    when unique_violation then
      select id into v_tx_id from public.wallet_transactions
      where idempotency_key = p_idempotency_key;
      return v_tx_id;
  end;

  update public.wallet_accounts
  set balance_cents = v_new_balance, version = version + 1, updated_at = now()
  where user_id = p_user_id;

  return v_tx_id;
end;
$$;

-- ------------------------------------------------------------
-- wallet_credit : crédit atomique + idempotent
-- ------------------------------------------------------------
create or replace function public.wallet_credit(
  p_user_id         uuid,
  p_amount_cents    bigint,
  p_idempotency_key text,
  p_reference_type  text default null,
  p_reference_id    text default null,
  p_description     text default null
)
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_existing_id bigint;
  v_balance     bigint;
  v_new_balance bigint;
  v_tx_id       bigint;
begin
  if p_amount_cents is null or p_amount_cents <= 0 then
    raise exception 'invalid_amount';
  end if;

  select id into v_existing_id
  from public.wallet_transactions
  where idempotency_key = p_idempotency_key;
  if v_existing_id is not null then
    return v_existing_id;
  end if;

  insert into public.wallet_accounts (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select balance_cents into v_balance
  from public.wallet_accounts
  where user_id = p_user_id
  for update;

  v_new_balance := v_balance + p_amount_cents;

  begin
    insert into public.wallet_transactions (
      user_id, type, amount_cents, currency, status,
      reference_type, reference_id, idempotency_key, description, balance_after_cents
    ) values (
      p_user_id, 'credit', p_amount_cents, 'USD', 'confirmed',
      p_reference_type, p_reference_id, p_idempotency_key, p_description, v_new_balance
    )
    returning id into v_tx_id;
  exception
    when unique_violation then
      select id into v_tx_id from public.wallet_transactions
      where idempotency_key = p_idempotency_key;
      return v_tx_id;
  end;

  update public.wallet_accounts
  set balance_cents = v_new_balance, version = version + 1, updated_at = now()
  where user_id = p_user_id;

  return v_tx_id;
end;
$$;

-- ------------------------------------------------------------
-- wallet_refund : remboursement d'une activation — au plus une fois
-- ------------------------------------------------------------
create or replace function public.wallet_refund(
  p_activation_id uuid,
  p_reason        text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_activation public.activations%rowtype;
  v_refund_id  uuid;
  v_tx_id      bigint;
begin
  select * into v_activation
  from public.activations
  where id = p_activation_id;
  if not found then
    raise exception 'activation_not_found';
  end if;

  -- Déjà remboursée → retourne le remboursement existant
  select id into v_refund_id
  from public.refunds
  where activation_id = p_activation_id;
  if v_refund_id is not null then
    return v_refund_id;
  end if;

  if v_activation.price_client_cents is null or v_activation.price_client_cents <= 0 then
    raise exception 'nothing_to_refund';
  end if;

  -- Le crédit est lui-même idempotent via la clé 'refund:<activation_id>'
  v_tx_id := public.wallet_credit(
    v_activation.user_id,
    v_activation.price_client_cents,
    'refund:' || p_activation_id::text,
    'activation',
    p_activation_id::text,
    coalesce(p_reason, 'Remboursement activation')
  );

  insert into public.refunds (user_id, activation_id, amount_cents, reason, wallet_transaction_id)
  values (v_activation.user_id, p_activation_id, v_activation.price_client_cents,
          coalesce(p_reason, 'refund'), v_tx_id)
  returning id into v_refund_id;

  update public.activations
  set status = 'refunded', updated_at = now()
  where id = p_activation_id and status <> 'refunded';

  insert into public.activation_events (activation_id, type, payload)
  values (p_activation_id, 'refunded', jsonb_build_object('refund_id', v_refund_id));

  return v_refund_id;
end;
$$;

-- Fonctions financières : serveur uniquement (service_role),
-- jamais appelables directement par un client via l'API.
revoke all on function public.wallet_debit(uuid, bigint, text, text, text, text) from anon, authenticated;
revoke all on function public.wallet_credit(uuid, bigint, text, text, text, text) from anon, authenticated;
revoke all on function public.wallet_refund(uuid, text) from anon, authenticated;
grant execute on function public.wallet_debit(uuid, bigint, text, text, text, text) to service_role;
grant execute on function public.wallet_credit(uuid, bigint, text, text, text, text) to service_role;
grant execute on function public.wallet_refund(uuid, text) to service_role;
