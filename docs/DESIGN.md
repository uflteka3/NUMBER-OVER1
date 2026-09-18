# NUMBER OVER — Identité & Design System (Phase 2)

## Positionnement

Plateforme d'activations SMS **premium, technologique, crédible**. L'évitement assumé
du look "dashboard crypto/template générique" : une nuit profonde, un iris électrique,
un cyan "signal", du verre dépoli, et une typographie qui assume les chiffres.

## Couleurs

| Token | Hex | Usage |
|---|---|---|
| `night-950` | `#04060c` | fond global |
| `night-900` → `night-500` | `#070b14` → `#3b4a7d` | surfaces, bordures |
| `brand-500` | `#6f6cff` | primaire (iris) |
| `brand-600/700` | `#5b4df0` / `#4a3bd0` | états hover/pressed |
| `accent-400/500` | `#22d3ee` / `#06b6d4` | cyan signal (temps réel, OTP) |
| `success/warning/danger` | `#34d399` / `#fbbf24` / `#fb7185` | états sémantiques |

Dégradé signature : `linear-gradient(100deg, brand-500, accent-500)` — boutons primaires,
surbrillances, logo.

## Typographies (auto-hébergées via Fontsource)

- **Space Grotesk** (`font-display`) : titres, wordmark — géométrique, tech.
- **Inter** (`font-sans`) : corps de texte — lisibilité.
- **JetBrains Mono** (`font-mono`) : numéros de téléphone, codes OTP, statuts, labels.

## Composants (`src/components/ui/`)

| Composant | Variantes / props |
|---|---|
| `Button` | primary (dégradé signature), secondary (glass), outline, ghost, danger · tailles sm/md/lg/icon · `loading`, `href` |
| `Badge` | tones neutral/brand/accent/success/warning/danger · `dot`, `pulse` |
| `Card` | glass, `hover` (lift + glow) |
| `Input` + `Field` | icône, état d'erreur, focus ring iris |
| `Modal` | portal, blur overlay, scale/fade, `Escape`, tailles |
| `Toast` + `useToast` | succès/erreur/info/warning, barre de progression, auto-dismiss |
| `Spinner` / `Dots` | chargement |
| `Skeleton` | shimmer |
| `SectionHeading` | eyebrow + titre + lead |

Utilitaires CSS : `glass`, `glass-strong`, `text-gradient`, `bg-grid`, `shadow-glow`,
`shadow-card`, `mask-fade-x`, `no-scrollbar`.

## Animations

- Helpers : `Reveal` (fade-up au scroll), `fadeUp`, `staggerContainer/staggerItem` (`src/components/motion/reveal.tsx`).
- **Signature** : `ActivationVisual` (hero) — cycle complet d'une activation :
  attribution du numéro (effet décodage chiffre par chiffre) → attente SMS (anneau pulsant)
  → SMS reçu + code → confirmation. Boucle ~12 s.
- Marquees du catalogue (2 rangées, sens opposés, pause au survol).
- Transitions de page (`template.tsx`), hovers (lift + glow), accordéon FAQ (hauteur animée).
- **`prefers-reduced-motion`** : respecté partout — `MotionConfig reducedMotion="user"`
  + garde CSS globale + états statiques de secours dans les composants animés.
- Uniquement `transform` / `opacity` animés → aucun reflow, 60 fps.

## Logo

Monogramme **N** + barres de signal ascendantes sur un squircle dégradé iris→cyan
(`src/components/brand/logo.tsx`, `src/app/icon.svg`).

## Données affichées

Règle stricte : **aucune donnée inventée**. Les services/pays cités sur la landing sont
les exemples publiés dans la documentation officielle VirtualSMS ; aucun prix ni stock
n'est affiché avant la synchronisation réelle (Phase 5). La mention « dès 0,05 $ »
provient de la documentation publique du fournisseur.
