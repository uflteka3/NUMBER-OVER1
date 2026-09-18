# NUMBER OVER

Plateforme professionnelle d'activations SMS/OTP temporaires — numéros réels dans 145+ pays,
2 500+ services, réception en temps réel, remboursement automatique.

> 🚧 Projet en développement par phases validées. Voir [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
> pour l'architecture complète et [`docs/DESIGN.md`](docs/DESIGN.md) pour le design system.

## Stack

- **Next.js 16** (App Router) + TypeScript strict
- **Tailwind CSS 4** + design system maison (Framer Motion)
- **Supabase** — Postgres, Auth, RLS, Realtime *(Phase 4)*
- **VirtualSMS** — fournisseur SMS via couche provider abstraite *(Phase 5)*

## Développement

```bash
npm install
cp .env.example .env.local   # remplir les valeurs (jamais committées)
npm run dev                  # http://localhost:3000
```

Pages utiles en cours de développement :

| Route | Contenu |
|---|---|
| `/` | Landing page |
| `/design-system` | Vitrine des composants (page de vérification, retirée avant prod) |

## Règles de sécurité

- Aucun secret dans le code, les logs ou Git — uniquement des variables d'environnement.
- La clé API VirtualSMS ne vit que côté serveur (`VIRTUALSMS_API_KEY`).
- Le navigateur n'est jamais source de vérité (prix recalculés côté serveur).

## Déploiement

Vercel *(Phase 11)*.
