/**
 * Données de la landing page.
 *
 * Sources : documentation officielle VirtualSMS (github.com/virtualsms-io/api-docs,
 * virtualsms.io/api/openapi.json). Aucun prix, stock, pays ou service n'est inventé :
 * seuls les exemples publiés par le fournisseur sont cités.
 * Les données live (prix, stock, catalogue complet) seront synchronisées en Phase 5.
 */

export interface ServiceItem {
  name: string;
  code: string; // code fournisseur officiel (spec OpenAPI)
  tint: string; // couleur de marque publique
}

export const SERVICES: ServiceItem[] = [
  { name: "WhatsApp", code: "wa", tint: "#25D366" },
  { name: "Telegram", code: "tg", tint: "#229ED9" },
  { name: "Google", code: "go", tint: "#EA4335" },
  { name: "Instagram", code: "ig", tint: "#E1306C" },
  { name: "Discord", code: "ds", tint: "#5865F2" },
  { name: "TikTok", code: "lf", tint: "#FE2C55" },
  { name: "X / Twitter", code: "tw", tint: "#E7E9EA" },
  { name: "Facebook", code: "fb", tint: "#1877F2" },
  { name: "Microsoft", code: "mm", tint: "#00A4EF" },
  { name: "Amazon", code: "am", tint: "#FF9900" },
  { name: "OpenAI", code: "oi", tint: "#10A37F" },
  { name: "Uber", code: "ub", tint: "#BFBFBF" },
  { name: "PayPal", code: "pp", tint: "#009CDE" },
  { name: "Binance", code: "bn", tint: "#F0B90B" },
];

export interface CountryItem {
  iso: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryItem[] = [
  { iso: "FR", name: "France", flag: "🇫🇷" },
  { iso: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { iso: "US", name: "États-Unis", flag: "🇺🇸" },
  { iso: "DE", name: "Allemagne", flag: "🇩🇪" },
  { iso: "ES", name: "Espagne", flag: "🇪🇸" },
  { iso: "PL", name: "Pologne", flag: "🇵🇱" },
  { iso: "HR", name: "Croatie", flag: "🇭🇷" },
  { iso: "ID", name: "Indonésie", flag: "🇮🇩" },
  { iso: "BR", name: "Brésil", flag: "🇧🇷" },
  { iso: "IN", name: "Inde", flag: "🇮🇳" },
  { iso: "NL", name: "Pays-Bas", flag: "🇳🇱" },
  { iso: "CA", name: "Canada", flag: "🇨🇦" },
];

export const TOTAL_COUNTRIES_LABEL = "145+";
export const TOTAL_SERVICES_LABEL = "2 500+";

export const STEPS = [
  {
    title: "Rechargez votre compte",
    description: "Ajoutez du crédit à votre wallet NUMBER OVER en quelques instants, de façon sécurisée.",
  },
  {
    title: "Choisissez un pays",
    description: "145+ pays couverts, avec disponibilités et prix synchronisés en continu.",
  },
  {
    title: "Choisissez un service",
    description: "WhatsApp, Telegram, Google, Discord… plus de 2 500 services pris en charge.",
  },
  {
    title: "Achetez le numéro",
    description: "Le prix est vérifié côté serveur au moment de l'achat. Aucune surprise, aucun surcoût caché.",
  },
  {
    title: "Recevez le SMS",
    description: "Le message arrive en temps réel sur votre écran, sans rafraîchir la page.",
  },
  {
    title: "Consultez le code",
    description: "Le code OTP est détecté et extrait automatiquement, prêt à être copié en un geste.",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Qu'est-ce qu'une activation SMS ?",
    answer:
      "Une activation est la location unique et temporaire d'un numéro de téléphone réel, le temps de recevoir un SMS de vérification (code OTP) pour un service donné. Ce n'est ni un abonnement, ni une ligne permanente : une activation = un numéro, un service, un code.",
  },
  {
    question: "Combien de temps le numéro reste-t-il actif ?",
    answer:
      "Le numéro reste à votre disposition pendant la fenêtre d'activation définie par l'opérateur (typiquement une vingtaine de minutes), largement suffisante pour recevoir votre code. Une fois l'activation terminée ou expirée, le numéro est libéré.",
  },
  {
    question: "Que se passe-t-il si je ne reçois aucun SMS ?",
    answer:
      "Vous ne payez rien. Si aucun SMS n'arrive dans la fenêtre d'activation, la commande expire et le montant est automatiquement recrédité sur votre wallet. Vous pouvez aussi annuler vous-même après la période de rétention initiale de 2 minutes.",
  },
  {
    question: "Les numéros sont-ils de vraies cartes SIM ?",
    answer:
      "Oui. Par défaut, les numéros proviennent de cartes SIM physiques sur les grands opérateurs, et non de numéros VoIP — ce qui maximise le taux d'acceptation par les plateformes.",
  },
  {
    question: "Quels moyens de paiement sont acceptés ?",
    answer:
      "Les moyens de paiement exacts seront annoncés à l'ouverture du service : carte bancaire et crypto-actifs sont prévus. Toutes les confirmations de paiement sont vérifiées côté serveur avant tout crédit.",
  },
  {
    question: "Puis-je utiliser NUMBER OVER pour n'importe quel service ?",
    answer:
      "Vous devez respecter les conditions d'utilisation des plateformes concernées ainsi que la réglementation applicable. NUMBER OVER fournit des activations SMS légitimes et n'est pas conçu pour contourner les systèmes de sécurité, de vérification d'identité ou anti-fraude des services tiers.",
  },
] as const;
