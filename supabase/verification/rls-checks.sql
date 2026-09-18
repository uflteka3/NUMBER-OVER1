-- ============================================================
-- NUMBER OVER · Vérifications RLS (à lancer dans le SQL Editor
-- du dashboard Supabase, APRÈS avoir appliqué les migrations
-- et créé un compte de test via l'inscription).
--
-- Exécutez chaque bloc avec `set role` — Supabase SQL Editor
-- permet de simuler un rôle et un user précis.
-- ============================================================

-- 0) Sanity check : la RLS est active partout
select relname, relrowsecurity
from pg_class
where relnamespace = 'public'::regnamespace
  and relkind = 'r'
order by relname;
-- → tout doit afficher relrowsecurity = true

-- 1) Un utilisateur ne voit que SON profil
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select id from public.profiles;
  -- → une seule ligne : celle de l'utilisateur A
rollback;

-- 2) Un utilisateur ne voit que SES activations / événements / SMS
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select count(*) as activations from public.activations;
  select count(*) as events from public.activation_events;
  select count(*) as sms from public.sms_messages;
  -- → uniquement les lignes liées à l'utilisateur A
rollback;

-- 3) Wallet : lecture de SON solde uniquement, JAMAIS d'écriture directe
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select balance_cents from public.wallet_accounts;   -- → 1 ligne (la sienne)
  update public.wallet_accounts
     set balance_cents = 999999
   where true;
  -- → doit ÉCHOUER (0 ligne affectée / permission denied)
  insert into public.wallet_transactions (user_id, type, amount_cents, status)
  values ('<AUTH_UID_USER_A>', 'credit', 100, 'confirmed');
  -- → doit ÉCHOUER (permission denied : aucun grant insert)
rollback;

-- 4) Notifications : un utilisateur peut MARQUER les siennes comme lues,
--    mais rien d'autre (aucune insertion directe possible côté client).
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select count(*) from public.notifications;          -- → les siennes seulement
  insert into public.notifications (user_id, type, title, body)
  values ('<AUTH_UID_USER_A>', 'system', 'x', 'x');
  -- → doit ÉCHOUER (pas de grant insert)
rollback;

-- 5) Tables d'administration invisibles pour un utilisateur standard
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select count(*) from public.webhook_events;         -- → 0 (policy is_admin)
  select count(*) from public.provider_api_logs;      -- → 0
  select count(*) from public.audit_logs;             -- → 0
  select count(*) from public.site_settings;          -- → 0
rollback;

-- 6) Catalogue : accessible en lecture publique (anon compris)
begin;
  set local role anon;
  select count(*) from public.countries;              -- → OK (12)
  select count(*) from public.services;               -- → OK (14)
  select count(*) from public.provider_prices;        -- → OK (0 = jamais sync)
  select count(*) from public.pricing_rules;          -- → 0 (réservé admin)
rollback;

-- 7) Les fonctions financières refusent l'exécution au rôle authenticated
begin;
  set local role authenticated;
  set local "request.jwt.claims" = '{"sub":"<AUTH_UID_USER_A>"}';
  select public.wallet_credit('<AUTH_UID_USER_A>'::uuid, 100, '<uuid>::uuid');
  -- → doit ÉCHOUER (permission denied for function wallet_credit)
rollback;

-- 8) Test des fonctions financières avec le service_role (simulateur BFF)
--    À exécuter SANS set role (vous êtes postgres dans l'éditeur) :
select public.wallet_credit('<AUTH_UID_USER_A>'::uuid, 1000, gen_random_uuid());
select public.wallet_debit('<AUTH_UID_USER_A>'::uuid, 400, gen_random_uuid(), null::uuid);
-- Rejouer avec le MÊME idempotency_key → doit retourner la même transaction
-- sans débiter une deuxième fois :
select public.wallet_debit('<AUTH_UID_USER_A>'::uuid, 400, '<MÊME-UUID>'::uuid, null::uuid);
-- Vérifier le ledger : chaque balance_after_cents se suit, et le solde final
-- = somme algébrique des transactions confirmées.
select * from public.wallet_transactions order by created_at;
select user_id, balance_cents, version from public.wallet_accounts;
