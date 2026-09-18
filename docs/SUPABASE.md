# Supabase — Guide de connexion (Phase 4)

Ce document explique comment créer le projet Supabase et connecter NUMBER OVER
en une dizaine de minutes. Tant que les variables d'environnement ne sont pas
renseignées, l'application reste en **mode démonstration** (données d'aperçu
étiquetées) ; dès qu'elles le sont, l'authentification réelle, la protection
des routes et la lecture du profil/wallet s'activent **sans changement de code**.

---

## 1. Créer le projet

1. Rendez-vous sur https://supabase.com → **New project**.
2. Choisissez : nom (`number-over`), région proche de vos utilisateurs
   (ex. `eu-central` ou `eu-west`), mot de passe base de données solide
   (conservez-le dans votre gestionnaire de mots de passe).
3. Attendez la fin du provisionnement (~2 min).

## 2. Appliquer les migrations

Le schéma est livré sous forme de 9 fichiers SQL dans `supabase/migrations/`,
à exécuter **dans l'ordre** via le **SQL Editor** du dashboard Supabase
(avec l'utilisateur `postgres`, ce qui est le cas par défaut) :

| Fichier | Contenu |
| --- | --- |
| `00001_extensions.sql` | pgcrypto + trigger `updated_at` |
| `00002_profiles.sql` | rôles, profils, `is_admin()`, création auto profil+wallet+notification de bienvenue à l'inscription |
| `00003_catalog.sql` | pays, services, comptes provider, prix, règles de marge |
| `00004_activations.sql` | activations, événements, SMS (contraintes d'unicité d'idempotence) |
| `00005_wallet.sql` | comptes, transactions, recharges, paiements, remboursements + `wallet_debit/wallet_credit/wallet_refund` sécurisées |
| `00006_notifications.sql` | notifications |
| `00007_webhooks_logs.sql` | événements webhooks, logs provider masqués, audit, paramètres |
| `00008_rls.sql` | grants + politiques RLS complètes |
| `00009_reference_seed.sql` | référentiels (pays/services réels VirtualSMS), règle de marge globale — aucun prix fictif |

> Astuce : ouvrez chaque fichier, collez son contenu dans une nouvelle requête
> du SQL Editor, **Run**, vérifiez « Success », puis passez au suivant.

## 3. Récupérer les clés

Dans **Project Settings → Data API** :

- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon / public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (**serveur uniquement**)

## 4. Configurer l'application

Créez `.env.local` **à la racine du projet** (déjà ignoré par Git) :

```bash
NEXT_PUBLIC_SUPABASE_URL=<Project URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
SUPABASE_SERVICE_ROLE_KEY=<service_role key>   # serveur uniquement, dès Phase 5
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Puis redémarrez le serveur de dev (`npm run dev`). La bannière passe de
« Mode démonstration » à « Compte connecté » et l'authentification devient
réelle (inscription → confirmation email → connexion).

## 5. Configurer l'auth Supabase

Dans **Authentication → URL Configuration** :

- **Site URL** : `http://localhost:3000` (dev) / votre domaine Vercel (prod)
- **Redirect URLs** : ajouter `http://localhost:3000/auth/callback` et
  `<votre-domaine>/auth/callback`

Google OAuth (optionnel, recommandé) : **Authentication → Providers → Google**,
coller le Client ID/Secret créés dans Google Cloud Console (origine de
redirection fournie par Supabase à recopier dans Google).

## 6. Promouvoir un compte administrateur

Après votre première inscription depuis le site :

```sql
-- SQL Editor — remplacez l'email par le vôtre
update public.profiles
   set role_id = 'admin', updated_at = now()
 where id = (select id from auth.users where email = '<VOTRE-EMAIL>');
```

Reconnectez-vous : la section **Administration** apparaît et `/admin/*`
est accessible (garde serveur dans `src/middleware.ts` + policy RLS).

## 7. Vérifier la sécurité

Lancez `supabase/verification/rls-checks.sql` (SQL Editor) en remplaçant
`<AUTH_UID_USER_A>` par l'UUID d'un compte de test. Les requêtes de fuite
(compte B volumétrie, wallet d'autrui, tables admin) doivent toutes
retourner 0 ligne ou échouer.

---

## Architecture d'accès

| Chemin d'accès | Rôle Postgres | Usage |
| --- | --- | --- |
| Navigateur (`@supabase/ssr`) | `anon` / `authenticated` | Auth, souscriptions Realtime, lectures RLS |
| Server Components / Actions (`supabase-server.ts`) | `authenticated` | Rendu des pages avec données de l'utilisateur |
| Route Handlers BFF (`supabase-admin.ts`) | `service_role` | Phases 5+ : webhooks, prix recalculés, fonctions financières — jamais exposé au client |

La clé `service_role` contourne la RLS : elle ne circule **que** dans le
serveur Next.js (Route Handlers), jamais dans un Client Component, jamais
dans une variable `NEXT_PUBLIC_*`, jamais dans un log.

## Sécurité déjà en place

- **RLS active sur toutes les tables** ; les politiques limitent chaque
  utilisateur à ses données, l'admin étant le seul à voir les logs et
  paramètres internes.
- **Aucune écriture financière directe** : `wallet_debit` / `wallet_credit` /
  `wallet_refund` sont `security definer` et exécutables **uniquement** par
  `service_role`. Idempotence garantie par contraintes d'unicité
  (`idempotency_key`, `refunds.activation_id`).
- **Profils créés automatiquement** à l'inscription (trigger sur
  `auth.users`), avec wallet à 0 et notification de bienvenue.
- **Énumération de comptes évitée** : réinitialisation de mot de passe et
  inscription ne révèlent jamais si une adresse email est déjà inscrite.
