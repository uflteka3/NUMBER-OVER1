-- ============================================================
-- NUMBER OVER · Migration 00002 — Rôles & profils
-- ============================================================

create table public.roles (
  id          text primary key,
  description text
);

insert into public.roles (id, description) values
  ('user',  'Compte client standard'),
  ('admin', 'Administrateur NUMBER OVER (accès back-office)');

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text        check (char_length(display_name) between 1 and 80),
  role_id      text        not null default 'user' references public.roles (id),
  status       text        not null default 'active' check (status in ('active', 'blocked')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Vérifie l'appartenance au rôle admin.
-- security definer (owner = postgres) : bypass RLS → pas de récursion
-- lorsque cette fonction est utilisée dans la policy de `profiles`.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role_id = 'admin'
  );
$$;

-- Création automatique du profil (+ wallet + notification de bienvenue)
-- à chaque nouvel utilisateur Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'display_name', '')), '')
  );

  insert into public.wallet_accounts (user_id)
  values (new.id);

  insert into public.notifications (user_id, type, title, body)
  values (
    new.id,
    'system',
    'Bienvenue sur NUMBER OVER',
    'Votre compte est prêt. Rechargez votre wallet pour démarrer votre première activation.'
  );

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Ces fonctions ne doivent pas être appelables via l'API publique :
-- handle_new_user est réservée au trigger ; is_admin reste appelable.
revoke all on function public.handle_new_user() from anon, authenticated;
