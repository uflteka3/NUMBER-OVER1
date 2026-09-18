# NUMBER OVER — Architecture technique (Phase 1)

> Statut : **proposition d'architecture — en attente de validation**.
> Aucune fonctionnalité n'est implémentée dans cette phase.
> Date de l'audit : 2026-09-18.

---

## 1. Résumé de l'audit

### 1.1 Repository

- Repo `uflteka3/NUMBER-OVER1` **quasiment vide** (greenfield) : uniquement un `README.md` d'une ligne, 1 commit initial.
- Aucun code, aucune configuration, aucun secret existant. On part sur une base saine.
- Branche de travail : `arena/01a0b238-number-over1`.

### 1.2 Environnement de développement

| Outil | État |
|---|---|
| Node.js | v22.22.3 ✅ (compatible Next.js 15) |
| npm | 10.9.8 ✅ — registry npm accessible (ping OK) |
| Python | 3.11.2 ✅ |
| `gh` (GitHub CLI) | 2.23.0 ✅ authentifié |
| Supabase CLI | ❌ non installé (sera installé en Phase 4, ou migrations SQL directes) |
| Vercel CLI | ❌ non installé (sera installé/configuré en Phase 11) |

### 1.3 Credentials

- **Aucun credential présent** dans l'environnement à ce jour (scan des variables d'environnement effectué : aucune variable Supabase / VirtualSMS / paiement détectée).
- ⚠️ **Action requise côté utilisateur** avant les phases concernées :
  - Phase 4 (Supabase) : URL projet, clé `anon`, clé `service_role`.
  - Phase 5 (VirtualSMS) : clé API VirtualSMS.
  - Phase 6 (Paiements) : clés du prestataire de paiement choisi.
  - Phase 11 (Vercel) : token/projet Vercel + domaine éventuel.

### 1.4 VirtualSMS — vérification de la documentation officielle

Sources consultées et recoupées (2026-09-18) :
- `github.com/virtualsms-io/api-docs` (README + `webhooks.md`)
- `virtualsms.io/api/openapi.json` (spécification OpenAPI 3.1, v1.2.0)

**Constats vérifiés :**

| Élément | Valeur confirmée |
|---|---|
| Base URL | `https://virtualsms.io/api/v1` |
| Auth endpoints modernes | Header **`X-API-Key`** (PAS `Bearer` — le Bearer n'existe que sur la surface legacy) |
| Prix (public) | `GET /api/v1/price?service={code}&country={iso}` |
| Services | `GET /api/v1/customer/services` — chaque service expose `service_id`, `service_code`, `name`, `price`, `available` (stock), `countries[]` |
| Pays | `GET /api/v1/customer/countries` (filtrable par `?service=`) |
| Solde | `GET /api/v1/customer/balance` (USD) — **info admin uniquement** |
| Profil / Transactions | `GET /api/v1/customer/profile` / `GET /api/v1/customer/transactions` |
| Achat | `POST /api/v1/customer/purchase` `{service, country}` → `order_id` (uuid), `phone_number`, `price`, `status`, `expires_at`, `can_swap_number` |
| Statut ordre + SMS | `GET /api/v1/customer/order/{id}` → `status`, `messages[]` (sender, content, received_at) |
| Annulation | `POST /api/v1/customer/cancel/{id}` — **hold de 2 min**, sinon `425 Too Early` + secondes restantes |
| Swap | `POST /api/v1/customer/swap/{id}` — même hold de 2 min |
| WebSocket | `wss://virtualsms.io/ws/orders` (messages `sms`, `expired`) |
| Webhooks | CRUD complet sur `/api/v1/customer/webhooks` ; secret retourné **une seule fois** à la création |
| Signature webhooks | **HMAC-SHA256** sur le body brut, header `X-VirtualSMS-Signature: sha256=<hex>` ; anti-rejeu : `X-VirtualSMS-Timestamp` ± 5 min |
| Événements webhook | `sms.received`, `order.cancelled`, `order.expired`, `order.swapped`, `balance.low` |
| Retry webhooks | 5 tentatives : 1m → 5m → 30m → 2h → 12h ; auto-pause après 20 échecs consécutifs |
| Idempotence webhooks | dédupliquer par `X-VirtualSMS-Delivery` **et/ou** `id` d'enveloppe (ULID `evt_…`) |
| Rate limits | **60 req/min** par clé sur `/api/v1/customer/*` ; 10 req/min sur certains endpoints ; `429` si dépassé |
| Statuts d'ordre | `created` → `waiting` → `sms_received` → `completed` ; terminaisons : `cancelled`, `expired` |
| Erreurs achat | codes stables : `insufficient_balance`, `invalid_service`, `missing_params`, `no_numbers`, `internal_error` |
| Remboursements | auto-refund si aucun SMS ; `order.cancelled` porte `refunded_amount`, `refund_currency`, `reason` (`user_cancelled`, `timeout_no_sms`, `operator_rejected`) ; `expired` remboursé via worker séparé (`refunded_at`) |
| Politique anti-abus fournisseur | nombres physiques (SIM réelles), pas de contournement — à respecter dans nos règles d'usage |

**Points de vigilance identifiés :**

1. **Préfixe de clé** : le README GitHub montre `vms_…`, la spec OpenAPI montre `vsms_…`. On confirmera avec la vraie clé en Phase 5 (impact cosmétique uniquement, variable `VIRTUALSMS_API_KEY`).
2. **Double surface REST** : `/api/v1/orders/*` (surface "Orders" de la spec) et `/api/v1/customer/*` (surface recommandée). Conformément au cahier des charges et à la doc, **on standardise sur `/api/v1/customer/*`** pour tout : achat, statut, cancel, swap.
3. **Budget de requêtes très contraint** (60/min partagé entre catalogue, achats, statuts, admin) → cache + synchronisation DB obligatoires, aucun polling client direct. Le WebSocket ne peut pas être consommé par le navigateur (clé API côté serveur) → il sera consommé par notre backend si pertinent, avec fallback polling serveur contrôlé.
4. **Hold de 2 minutes** sur cancel/swap → l'UI doit afficher un compte à rebours et gérer le `425` proprement.
5. **Prix en USD flottant** côté fournisseur → conversion en **entiers (cents)** côté NUMBER OVER dès la frontière provider.
6. Le secret de webhook n'est retourné qu'une fois → procédure d'enregistrement immédiat en variable d'environnement lors du provisioning (Phase 5).

---

## 2. Stack technique proposée

| Couche | Choix | Justification |
|---|---|---|
| Framework | **Next.js 15 (App Router) + TypeScript strict** | frontend + backend (API routes / Server Actions) dans un seul déploiement Vercel, pattern BFF natif |
| Styles | **Tailwind CSS 4 + tokens CSS custom** | design system premium maîtrisé, mobile-first, performances |
| Animations | **Framer Motion + CSS** | transitions de page, micro-interactions, `prefers-reduced-motion` respecté |
| Base de données / Auth | **Supabase** (Postgres, Auth, RLS, Realtime) | imposé par le cahier des charges ; Realtime = push des statuts d'activation au navigateur sans polling |
| Fournisseur SMS | **VirtualSMS** via couche `SMSProvider` | imposé ; derrière une interface pour multi-fournisseur futur |
| Validation | **Zod** | validation serveur de toutes les entrées |
| Requêtes client | **TanStack Query** + Supabase Realtime | cache, états loading/error, invalidation contrôlée |
| Rate limiting | **Upstash Ratelimit** (ou fallback table Postgres) | limites par utilisateur + budget global provider |
| Secrets | Variables d'environnement Vercel / `.env.local` (jamais committé) | règle absolue du cahier des charges |
| CI | GitHub Actions : lint, typecheck, build, **scan de secrets (gitleaks)** | aucun secret ne doit entrer dans l'historique |

---

## 3. Architecture logique

```
┌─────────────┐   HTTPS    ┌──────────────────────────────┐
│  NAVIGATEUR │ ─────────► │  NEXT.JS (Vercel)            │
│  (jamais de │            │  ┌────────────────────────┐  │
│  clé, jamais│            │  │ Frontend (RSC + client)│  │
│  de prix de │            │  └──────────┬─────────────┘  │
│  vérité)    │            │  ┌──────────▼─────────────┐  │
└──────┬──────┘            │  │ API Routes / BFF        │  │
       │                   │  │ - validation Zod        │  │
       │                   │  │ - rate limiting         │  │
       │                   │  │ - moteur de prix        │  │
       │                   │  │ - orchestration achat   │  │
       │                   │  └─────┬───────────┬───────┘  │
       │                   └────────┼───────────┼──────────┘
       │                            │           │
       │  Supabase Realtime         │           │ X-API-Key (serveur only)
       │  (push statuts/SMS)        ▼           ▼
       │                   ┌─────────────┐  ┌──────────────┐
       └────────────────── │  SUPABASE   │  │  VIRTUALSMS  │
                           │  Postgres   │  │  /api/v1/…   │
                           │  Auth + RLS │  │  + webhooks  │
                           │  Realtime   │  │  + WS        │
                           └─────────────┘  └──────┬───────┘
                                    ▲              │
                                    │   webhooks HMAC-SHA256
                                    │   → /api/webhooks/virtualsms
                                    └──────────────┘
```

**Principes non négociables :**

1. Le navigateur ne parle **jamais** à VirtualSMS. Toute opération sensible passe par nos routes serveur.
2. Le prix affiché au client est **recalculé côté serveur** au moment de l'achat ; tout prix venant du navigateur est ignoré.
3. Le wallet n'est crédité/débité que par des **fonctions Postgres transactionnelles** (ledger append-only), jamais par un simple `UPDATE` de solde applicatif.
4. Chaque webhook est **vérifié (HMAC + timestamp), dédupliqué, journalisé** avant traitement.
5. RLS activée sur **toutes** les tables exposées ; la clé `service_role` ne vit que côté serveur.

---

## 4. Couche Provider (abstraction)

```ts
interface SMSProvider {
  readonly id: 'virtualsms' | string;
  getServices(): Promise<ProviderService[]>;
  getCountries(serviceCode?: string): Promise<ProviderCountry[]>;
  getPrice(serviceCode: string, countryIso: string): Promise<ProviderPrice>;
  getBalance(): Promise<ProviderBalance>;           // admin uniquement
  getProfile(): Promise<ProviderProfile>;           // admin uniquement
  purchase(input: PurchaseInput): Promise<ProviderOrder>;
  getOrder(orderId: string): Promise<ProviderOrderStatus>;
  cancel(orderId: string): Promise<ProviderCancelResult>;  // gère 425
  swap(orderId: string): Promise<ProviderSwapResult>;      // gère 425
  // webhooks (provisionnement admin)
  createWebhook(sub: WebhookSubscription): Promise<ProviderWebhook>;
  listWebhooks(): Promise<ProviderWebhook[]>;
  deleteWebhook(id: string): Promise<void>;
}
```

- Implémentation : `VirtualSMSProvider` (fetch avec `X-API-Key`, timeout, retry + backoff sur `429`/5xx, **mais jamais de retry aveugle sur `purchase`** — voir §7).
- Toute erreur provider est normalisée (`ProviderError` avec code stable) et journalisée dans `provider_api_logs` **sanitisé** (jamais la clé, jamais les secrets).
- Wrappeur `ProviderClient` : token bucket interne (budget 60 req/min partagé), déduplication des appels identiques en vol, cache court pour `services`/`countries`/`price`.

---

## 5. Catalogue & moteur de prix

### Synchronisation catalogue (évite le polling provider)

- Tables miroir : `provider_services`, `provider_countries`, `provider_prices`.
- Job planifié (Vercel Cron / pg_cron) : rafraîchissement toutes les **5–10 min** (≈ 3 appels/cycle → très loin du plafond 60/min) + invalidation manuelle admin.
- Le catalogue lu par le frontend vient **de notre base** (rapide, filtrable, disponible même si le provider est lent) avec horodatage de fraîcheur.

### Moteur de prix (serveur uniquement)

```
prix_client  =  f( cout_fournisseur_cents, règles )
règles (par priorité décroissante) :
  1. prix fixe pour (service × pays)   [table pricing_rules]
  2. marge pour service × pays
  3. marge par service
  4. marge par pays
  5. marge globale (site_settings)
+ arrondi commercial (ex: au cent supérieur)
```

- Table `pricing_rules` (scope: global | service | country | service_country ; type: percent | fixed ; priorité).
- Le devis affiché dans le catalogue est recalculé/re-vérifié **au clic "Acheter"** ; un prix périmé (> TTL) bloque l'achat et propose le nouveau prix.

---

## 6. Wallet & ledger financier

**Principes :** montants en **cents entiers** (`bigint`), devise par ligne, ledger **append-only**, solde matérialisé mais toujours reconciliable depuis le ledger.

Tables :
- `wallet_accounts` (user_id PK, balance_cents, currency, version — optimistic locking)
- `wallet_transactions` (id, user_id, type `credit|debit|refund|adjustment`, amount_cents, currency, status, reference_type, reference_id, idempotency_key UNIQUE, description, created_at)
- `topups` (id, user_id, amount, provider, status, external_ref…)
- `payments` (id, topup_id, provider, provider_ref, raw status…)
- `refunds` (id, user_id, activation_id, amount_cents, provider_refund_amount_cents, reason, provider_ref, UNIQUE(activation_id) pour anti double-remboursement)

Fonctions Postgres (RPC `SECURITY DEFINER`, appelées côté serveur) :
- `wallet_debit(user, amount, idem_key, ref)` : `SELECT … FOR UPDATE`, vérifie solde, insère transaction, met à jour solde, **idempotente** (clé unique).
- `wallet_credit(user, amount, idem_key, ref)` : idem.
- `wallet_refund(activation)` : crédite une seule fois par activation.

Règle : **toute** variation de solde = 1 ligne `wallet_transactions`. Aucune exception.

---

## 7. Machine à états d'achat (cœur critique)

```
créée (initiated)
   │  wallet_debit OK (idempotence par idem_key)
   ▼
debited ──erreur provider──► refund_pending → refunded
   │  purchase provider OK (order_id reçu)
   ▼
number_assigned ──provider no_numbers/erreur──► refund_pending → refunded
   │
   ▼
waiting_sms ──sms.received (webhook / WS / poll)──► sms_received → completed
   │                                               (SMS stocké dans sms_messages)
   ├── cancel utilisateur (≥ 2 min) ──► cancelling → cancelled → refunded
   ├── order.expired / timeout ───────► expired → refund_pending → refunded
   └── order.swapped ─────────────────► number_updated (nouveau numéro, ancien archivé)
```

### Gestion du cas critique « fournisseur OK / base KO »

1. **Idempotence de bout en bout** : le client génère `idem_key` (UUID) par tentative d'achat ; contrainte UNIQUE en base. Un retry réseau ou double-clic retourne la **même** activation, jamais deux débits.
2. **Saga avec journal** : chaque achat écrit un `purchase_intents` (statut, étape atteinte, `idem_key`, payload provider). Les étapes sont rejouables.
3. **Réconciliation** : job planifié qui compare `activations` locales ↔ état provider (`GET /customer/order/{id}`) et `customer/transactions` ; tout débit local sans `order_id` après N minutes → remboursement automatique ; tout `order_id` orphelin → rattachement.
4. **`purchase` n'est jamais re-tenté aveuglément** après un timeout : on vérifie d'abord via transactions/statut provider si l'ordre existe (évite le double achat côté fournisseur).
5. **Réponse lente ≠ échec** : si le provider confirme après timeout, le webhook/la réconciliation rattache l'ordre à l'intention d'achat.

---

## 8. Réception des SMS — 3 canaux, 1 pipeline

Priorité décroissante, tous convergent vers le **même** handler `processProviderEvent` (idempotent) :

1. **Webhooks** `/api/webhooks/virtualsms` :
   - lecture du **raw body** → vérification HMAC-SHA256 (`X-VirtualSMS-Signature`) à temps constant ;
   - rejet si `X-VirtualSMS-Timestamp` > 5 min d'écart ;
   - insertion dans `webhook_events` (**UNIQUE** sur `event_id` + composite `(delivery_id)`) → si doublon : `200` immédiat, aucun traitement ;
   - réponse `200` rapide, traitement transactionnel ensuite (SMS, statut, notification, Realtime) ;
   - événements `data.test === true` journalisés mais ignorés fonctionnellement.
2. **WebSocket** consommé côté serveur (worker léger, option activable) — complément temps réel.
3. **Polling serveur contrôlé** (fallback) : uniquement pour les activations `waiting_sms` actives, cadence **≥ 10 s par activation**, plafonnée par le budget global, avec backoff et arrêt à expiration. **Aucun polling depuis le navigateur vers VirtualSMS.**

Côté client : **Supabase Realtime** (channel par activation) pousse numéro, SMS, statuts. Fallback : polling de *notre* API toutes les 5 s max, uniquement pendant une activation en attente.

---

## 9. Modèle de données (Supabase / Postgres)

| Table | Rôle (colonnes clés) |
|---|---|
| `profiles` | id (= auth.users), email, display_name, role_id, status (`active`,`blocked`), created_at |
| `roles` | `user`, `admin` (+ permissions futures) |
| `countries` / `services` | référentiels d'affichage NUMBER OVER (nom, drapeau/iso, catégorie, actif, ordre) |
| `provider_accounts` | 1 ligne par compte fournisseur (label; **pas de clé en base** — la clé vit en env var) |
| `provider_services` | code, name, raw JSON, synced_at |
| `provider_countries` | iso, name, synced_at |
| `provider_prices` | service_code, country_iso, cost_cents, stock, fetched_at (cache à durée de vie courte) |
| `pricing_rules` | scope, service_code?, country_iso?, type (`percent`,`fixed`), value, priority, active |
| `activations` | id, user_id, service_code, country_iso, provider `order_id` **UNIQUE**, phone_number, price_client_cents, cost_provider_cents, status (machine §7), idempotency_key **UNIQUE**, expires_at, cancel_available_at, created_at… |
| `activation_events` | activation_id, type, payload JSONB, created_at (audit du cycle de vie) |
| `sms_messages` | id, activation_id, sender, content, code, received_at, **UNIQUE(activation_id, content, received_at)** anti-doublon |
| `wallet_accounts` / `wallet_transactions` / `topups` / `payments` / `refunds` | cf. §6 |
| `notifications` | user_id, type, title, body, read_at, data JSONB |
| `webhook_events` | **event_id UNIQUE**, delivery_id, type, order_id, received_at, processed_at, attempts, status, error, payload JSONB |
| `provider_api_logs` | endpoint, méthode, status, latence, code d'erreur, order_id, request_id — **sanitisé (aucune clé/secret)** |
| `audit_logs` | actor (user/admin/système), action, entity, entity_id, diff JSONB, ip, created_at |
| `site_settings` | clé/valeur JSONB (marge globale, feature flags, seuils) |

**Index** prévus : `activations(user_id, status)`, `activations(order_id)`, `wallet_transactions(user_id, created_at)`, `sms_messages(activation_id)`, `webhook_events(event_id)`, `provider_prices(service_code, country_iso)`.

**RLS (extrait des politiques) :** `activations`, `sms_messages`, `wallet_*`, `notifications`, `topups`, `payments` → `USING (auth.uid() = user_id)` ; lecture catalogue/prix ouverte aux authentifiés (et partiellement publique pour la landing) ; écriture wallet exclusivement via fonctions `SECURITY DEFINER` ; admin = rôle vérifié dans `profiles` (fonction `is_admin()` stable) ; **RLS jamais désactivée**.

---

## 10. API NUMBER OVER (routes serveur — extrait)

| Route | Rôle |
|---|---|
| `GET /api/catalog/services` · `/countries` · `/price` | catalogue depuis nos tables (avec devis serveur) |
| `POST /api/activations` | achat (corps = service, country, idem_key — **jamais de prix**) |
| `GET /api/activations` · `/:id` | liste/détail de SES activations |
| `POST /api/activations/:id/cancel` · `/swap` | gestion 425 + compte à rebours |
| `GET /api/wallet` · `/api/wallet/transactions` | solde + historique |
| `POST /api/topups` | création d'une recharge (redirige vers le PSP) |
| `POST /api/webhooks/virtualsms` | réception événements provider (HMAC) |
| `POST /api/webhooks/payments/:provider` | confirmation paiement (signature PSP) — **seule source de crédit** |
| `GET /api/notifications` | notifications utilisateur |
| `/api/admin/*` | back-office (utilisateurs, activations, wallet, tarification, provider, stats, logs) — garde `is_admin` |

---

## 11. Paiements (Phase 6 — architecture modulaire)

```ts
interface PaymentProvider {
  createCheckout(topup: Topup): Promise<{ redirectUrl: string; externalRef: string }>;
  verifyWebhook(rawBody: string, headers: Headers): Promise<PaymentEvent>;
  getPayment(ref: string): Promise<PaymentStatus>;
}
```

Flux : `topups` (pending) → redirection PSP → **webhook PSP vérifié** (signature) → `payments` confirmé → `wallet_credit` (idempotent via ref externe UNIQUE) → notification. **Jamais de crédit sur un retour navigateur.**

➜ **Question ouverte** (voir §14) : choix du/des PSP (Stripe carte ? NOWPayments crypto ? les deux ?) — dépend des credentials fournis.

---

## 12. Sécurité & anti-abus

- **Secrets** : uniquement variables d'environnement (`VIRTUALSMS_API_KEY`, `VIRTUALSMS_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, clés PSP…). `.env.example` = noms uniquement. Scan **gitleaks** en CI + hooks. Jamais de clé affichée en clair (admin : empreinte masquée `vsms_…xyz`).
- **Validation** : Zod sur 100 % des entrées ; requêtes DB paramétrées (PostgREST/RPC).
- **Rate limiting applicatif** : achat (ex : 5/min, 20/jour par compte — paramétrable), topups, endpoints sensibles ; blocage admin ; surveillance volumes anormaux ; audit trail.
- **Anti double-achat** : clé d'idempotence + verrou d'état + bouton désactivé côté UI (défense en profondeur, la vérité reste la contrainte DB).
- **Webhooks** : HMAC temps constant, fenêtre 5 min, dédup, journal.
- **En-têtes** : CSP, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy`, CORS restreint.
- **Conformité** : la plateforme fournit des activations SMS légitimes ; aucune fonctionnalité de contournement KYC/anti-fraude ; respect des CGU VirtualSMS et des services tiers (affichage des règles d'usage en Phase 8/12).

---

## 13. Structure du repository (proposée)

```
NUMBER-OVER1/
├── docs/                     # ARCHITECTURE.md (ce fichier), DECISIONS.md, RUNBOOK.md
├── supabase/
│   └── migrations/           # SQL versionné (Phases 4+)
├── src/
│   ├── app/                  # Next.js App Router (pages + api/)
│   ├── components/           # design system
│   ├── lib/                  # utils partagés
│   └── server/
│       ├── providers/        # virtualsms/ (SMSProvider), payments/
│       ├── services/         # catalog, pricing, wallet, activations, notifications
│       ├── jobs/             # sync catalogue, réconciliation, polling
│       └── db/               # clients Supabase (server / admin)
├── public/
├── .env.example              # noms de variables UNIQUEMENT
├── .gitignore
└── .github/workflows/        # CI : lint, typecheck, build, scan secrets
```

---

## 14. Questions / décisions à valider

1. **Credentials** : fourniras-tu les accès Supabase + VirtualSMS au début des phases 4 et 5 ? (aucun détecté dans l'environnement actuel)
2. **Paiement (Phase 6)** : Stripe (carte), crypto (NOWPayments), ou les deux ?
3. **Supabase** : projet hébergé (supabase.com) — confirmé ? (je créerai les migrations versionnées ; appliquées via SQL Editor ou CLI)
4. **Domaine** : un domaine custom pour la prod, ou sous-domaine `*.vercel.app` au départ ?
5. **Marge par défaut** proposée : 30 % globale avec prix fixes possibles — OK comme point de départ ?
6. **WebSocket provider** : l'activer dès la Phase 5 (worker serveur) ou démarrer webhooks + polling contrôlé, et ajouter le WS en Phase 9 si nécessaire ? (recommandation : webhooks + polling d'abord — plus simple et robuste)
7. **Devise client** : USD partout (aligné provider) ou affichage multi-devise ? (recommandation : USD au départ)
8. **Langue(s)** de l'interface : français uniquement, anglais uniquement, ou i18n FR/EN ? (le marché cible influence la landing)

---

## 15. Couverture des exigences (traçabilité)

Le cahier des charges (sections 1–47) est intégralement couvert par cette architecture et le découpage en 12 phases. Points d'attention déjà adressés ci-dessus : développement par phases avec validation (§global), secrets (§12), endpoints VirtualSMS réels et vérifiés (§1.4), couche provider (§4), marge (§5), ledger (§6), cas critiques (§7), webhooks idempotents (§8), RLS (§9), paiements serveur (§11), anti-abus (§12), Vercel/GitHub (§2, structure).
