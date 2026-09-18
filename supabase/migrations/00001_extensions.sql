-- ============================================================
-- NUMBER OVER · Migration 00001 — Extensions & fonctions utilitaires
-- ============================================================

create extension if not exists pgcrypto;

-- Trigger générique : met à jour la colonne updated_at
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
