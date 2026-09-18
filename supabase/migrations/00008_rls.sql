-- ============================================================
-- NUMBER OVER · Migration 00008 — Grants & politiques RLS
--
-- Modèle :
--  · catalogue/référentiels : lecture publique (anon + authenticated) ;
--  · données personnelles : lecture limitée à son propriétaire ou à un admin ;
--  · écritures sensibles : UNIQUEMENT les fonctions security definer
--    et le rôle service_role (BFF Next.js). Aucune policy d'insertion
--    directe pour les clients sur les tables financières/activations.
-- ============================================================

-- ---------- Grants de base ----------
grant select on public.roles to authenticated;

-- Référentiels catalogue : lecture publique (landing + catalogue connecté)
grant select on public.countries to anon, authenticated;
grant select on public.services to anon, authenticated;
grant select on public.provider_services to anon, authenticated;
grant select on public.provider_countries to anon, authenticated;
grant select on public.provider_prices to anon, authenticated;

-- Données personnelles : lecture uniquement (aucune écriture directe)
grant select on public.profiles to authenticated;
grant update (display_name) on public.profiles to authenticated;

grant select on public.activations to authenticated;
grant select on public.activation_events to authenticated;
grant select on public.sms_messages to authenticated;

grant select on public.wallet_accounts to authenticated;
grant select on public.wallet_transactions to authenticated;
grant select on public.topups to authenticated;
grant select on public.payments to authenticated;
grant select on public.refunds to authenticated;

grant select on public.notifications to authenticated;
grant update (read_at) on public.notifications to authenticated;

-- Tables d'administration : lecture (policy is_admin)
grant select on public.provider_accounts to authenticated;
grant select on public.pricing_rules to authenticated;
grant select on public.webhook_events to authenticated;
grant select on public.provider_api_logs to authenticated;
grant select on public.audit_logs to authenticated;
grant select on public.site_settings to authenticated;

-- ---------- profiles ----------
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (auth.uid() = id or public.is_admin());

create policy profiles_update_own_name on public.profiles
  for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------- roles ----------
create policy roles_read on public.roles
  for select to authenticated
  using (true);

-- ---------- catalogue & miroirs provider (lecture publique) ----------
create policy countries_read on public.countries
  for select to anon, authenticated
  using (true);

create policy services_read on public.services
  for select to anon, authenticated
  using (true);

create policy provider_services_read on public.provider_services
  for select to anon, authenticated
  using (true);

create policy provider_countries_read on public.provider_countries
  for select to anon, authenticated
  using (true);

create policy provider_prices_read on public.provider_prices
  for select to anon, authenticated
  using (true);

-- ---------- activations ----------
create policy activations_select_own on public.activations
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy activation_events_select_own on public.activation_events
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.activations a
      where a.id = activation_events.activation_id
        and a.user_id = auth.uid()
    )
  );

create policy sms_messages_select_own on public.sms_messages
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.activations a
      where a.id = sms_messages.activation_id
        and a.user_id = auth.uid()
    )
  );

-- ---------- wallet ----------
create policy wallet_accounts_select_own on public.wallet_accounts
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy wallet_transactions_select_own on public.wallet_transactions
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy topups_select_own on public.topups
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy payments_select_own on public.payments
  for select to authenticated
  using (
    public.is_admin()
    or exists (
      select 1 from public.topups t
      where t.id = payments.topup_id
        and t.user_id = auth.uid()
    )
  );

create policy refunds_select_own on public.refunds
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

-- ---------- notifications ----------
create policy notifications_select_own on public.notifications
  for select to authenticated
  using (auth.uid() = user_id or public.is_admin());

create policy notifications_mark_read on public.notifications
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------- administration ----------
create policy provider_accounts_admin on public.provider_accounts
  for select to authenticated
  using (public.is_admin());

create policy pricing_rules_admin on public.pricing_rules
  for select to authenticated
  using (public.is_admin());

create policy webhook_events_admin on public.webhook_events
  for select to authenticated
  using (public.is_admin());

create policy provider_api_logs_admin on public.provider_api_logs
  for select to authenticated
  using (public.is_admin());

create policy audit_logs_admin on public.audit_logs
  for select to authenticated
  using (public.is_admin());

create policy site_settings_admin on public.site_settings
  for select to authenticated
  using (public.is_admin());
