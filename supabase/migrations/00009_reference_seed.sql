-- ============================================================
-- NUMBER OVER · Migration 00009 — Données de référence (seed)
--
-- Référentiels UNIQUEMENT issus de la documentation officielle
-- VirtualSMS (codes services/pays publiés). AUCUN prix ni stock :
-- ceux-ci proviendront exclusivement de la synchronisation live.
-- ============================================================

insert into public.countries (iso, name, flag, sort) values
  ('GB', 'Royaume-Uni',  '🇬🇧', 10),
  ('FR', 'France',       '🇫🇷', 20),
  ('US', 'États-Unis',   '🇺🇸', 30),
  ('DE', 'Allemagne',    '🇩🇪', 40),
  ('ES', 'Espagne',      '🇪🇸', 50),
  ('PL', 'Pologne',      '🇵🇱', 60),
  ('HR', 'Croatie',      '🇭🇷', 70),
  ('ID', 'Indonésie',    '🇮🇩', 80),
  ('BR', 'Brésil',       '🇧🇷', 90),
  ('IN', 'Inde',         '🇮🇳', 100),
  ('NL', 'Pays-Bas',     '🇳🇱', 110),
  ('CA', 'Canada',       '🇨🇦', 120)
on conflict (iso) do nothing;

insert into public.services (code, name, tint, category, sort) values
  ('wa', 'WhatsApp',    '#25D366', 'Messagerie',       10),
  ('tg', 'Telegram',    '#229ED9', 'Messagerie',       20),
  ('go', 'Google',      '#EA4335', 'Productivité',     30),
  ('ig', 'Instagram',   '#E1306C', 'Réseaux sociaux',  40),
  ('ds', 'Discord',     '#5865F2', 'Réseaux sociaux',  50),
  ('lf', 'TikTok',      '#FE2C55', 'Réseaux sociaux',  60),
  ('tw', 'X / Twitter', '#E7E9EA', 'Réseaux sociaux',  70),
  ('fb', 'Facebook',    '#1877F2', 'Réseaux sociaux',  80),
  ('mm', 'Microsoft',   '#00A4EF', 'Productivité',     90),
  ('am', 'Amazon',      '#FF9900', 'Marketplace',      100),
  ('oi', 'OpenAI',      '#10A37F', 'IA & Outils',      110),
  ('ub', 'Uber',        '#BFBFBF', 'Transport',        120),
  ('pp', 'PayPal',      '#009CDE', 'Paiement',         130),
  ('bn', 'Binance',     '#F0B90B', 'Crypto',           140)
on conflict (code) do nothing;

-- Marge par défaut de la plateforme (ajustable depuis /admin/tarification)
insert into public.pricing_rules (scope, type, value, priority)
values ('global', 'percent', 30.00, 1000)
on conflict do nothing;

insert into public.site_settings (key, value) values
  ('global_margin_percent', '30'::jsonb),
  ('maintenance_mode', 'false'::jsonb)
on conflict (key) do nothing;
