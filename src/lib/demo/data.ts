/**
 * ⚠️ DONNÉES D'APERÇU — MODE DÉMO (Phase 3)
 *
 * Ces fixtures servent uniquement à valider le design et les interactions.
 * Elles sont clairement étiquetées « démo » dans l'interface et seront
 * remplacées par les vraies données Supabase/VirtualSMS en Phases 4-5.
 * Les prix repris d'exemples publics du fournisseur (ex. WhatsApp US 0,50 $)
 * restent purement illustratifs.
 */

import type {
  Activation,
  AdminUser,
  AppNotification,
  CatalogService,
  PricingRule,
  ProviderLog,
  WalletTransaction,
} from "./types";

export const DEMO_MODE = true;

const min = 60_000;
const hour = 60 * min;
const day = 24 * hour;
const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();
const ahead = (ms: number) => new Date(now + ms).toISOString();

/* ------------------------------- Utilisateur ------------------------------ */

export const demoUser = {
  name: "Alex Martin",
  email: "alex.martin@exemple.com",
  balanceCents: 1250,
  role: "admin" as const,
  registeredAt: ago(42 * day),
};

/* ------------------------------ Activations ------------------------------- */

export const demoActivations: Activation[] = [
  {
    id: "act-live",
    serviceName: "Telegram",
    serviceCode: "tg",
    serviceTint: "#229ED9",
    countryIso: "GB",
    countryName: "Royaume-Uni",
    flag: "🇬🇧",
    phoneNumber: "+44 7700 900123",
    status: "waiting",
    priceCents: 42,
    costCents: 30,
    orderId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    createdAt: ago(1 * min),
    expiresAt: ahead(19 * min),
    cancelAvailableAt: ahead(1 * min),
    sms: [],
    events: [
      { id: "ev1", type: "created", label: "Activation créée — wallet débité", at: ago(1 * min) },
      { id: "ev2", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(55_000) },
    ],
  },
  {
    id: "act-2",
    serviceName: "Binance",
    serviceCode: "bn",
    serviceTint: "#F0B90B",
    countryIso: "ID",
    countryName: "Indonésie",
    flag: "🇮🇩",
    phoneNumber: "+62 812 9000 4417",
    status: "waiting",
    priceCents: 68,
    costCents: 49,
    orderId: "3b241101-e2bb-4255-8caf-4136c566a962",
    createdAt: ago(12 * min),
    expiresAt: ahead(8 * min),
    cancelAvailableAt: ago(10 * min),
    sms: [],
    events: [
      { id: "ev3", type: "created", label: "Activation créée — wallet débité", at: ago(12 * min) },
      { id: "ev4", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(12 * min + 4000) },
    ],
  },
  {
    id: "act-3",
    serviceName: "Discord",
    serviceCode: "ds",
    serviceTint: "#5865F2",
    countryIso: "DE",
    countryName: "Allemagne",
    flag: "🇩🇪",
    phoneNumber: "+49 152 3410 8823",
    status: "sms_received",
    priceCents: 35,
    costCents: 25,
    orderId: "8f7b3d21-9c4e-4a1b-b6d2-7e5f1a2c9d84",
    createdAt: ago(25 * min),
    expiresAt: ahead(3 * min),
    cancelAvailableAt: ago(23 * min),
    sms: [
      {
        id: "sms1",
        sender: "Discord",
        content: "Your Discord verification code is: 582 391",
        code: "582391",
        receivedAt: ago(22 * min),
      },
    ],
    events: [
      { id: "ev5", type: "created", label: "Activation créée — wallet débité", at: ago(25 * min) },
      { id: "ev6", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(25 * min + 3000) },
      { id: "ev7", type: "sms_received", label: "SMS reçu — code détecté", at: ago(22 * min) },
    ],
  },
  {
    id: "act-4",
    serviceName: "WhatsApp",
    serviceCode: "wa",
    serviceTint: "#25D366",
    countryIso: "US",
    countryName: "États-Unis",
    flag: "🇺🇸",
    phoneNumber: "+1 347 671 1222",
    status: "completed",
    priceCents: 65,
    costCents: 50, // exemple public fournisseur : 0,50 $
    orderId: "2c9f4e80-1a3b-4d5c-9e7f-6b8a1d3c5e72",
    createdAt: ago(3 * hour),
    expiresAt: ago(3 * hour - 20 * min),
    cancelAvailableAt: ago(3 * hour - 2 * min),
    sms: [
      {
        id: "sms2",
        sender: "WhatsApp",
        content: "Your WhatsApp code is 438-271. Don't share this code.",
        code: "438271",
        receivedAt: ago(3 * hour - 4 * min),
      },
    ],
    events: [
      { id: "ev8", type: "created", label: "Activation créée — wallet débité", at: ago(3 * hour) },
      { id: "ev9", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(3 * hour - 5000) },
      { id: "ev10", type: "sms_received", label: "SMS reçu — code détecté", at: ago(3 * hour - 4 * min) },
      { id: "ev11", type: "completed", label: "Activation terminée", at: ago(3 * hour - 3 * min) },
    ],
  },
  {
    id: "act-5",
    serviceName: "Google",
    serviceCode: "go",
    serviceTint: "#EA4335",
    countryIso: "FR",
    countryName: "France",
    flag: "🇫🇷",
    phoneNumber: "+33 6 44 21 90 37",
    status: "refunded",
    priceCents: 28,
    costCents: 20,
    orderId: "5d1a7c92-4e6f-4b8a-a3c1-2f9d8e5b7a41",
    createdAt: ago(1 * day + 2 * hour),
    expiresAt: ago(1 * day + 2 * hour - 20 * min),
    cancelAvailableAt: ago(1 * day + 2 * hour - 2 * min),
    sms: [],
    events: [
      { id: "ev12", type: "created", label: "Activation créée — wallet débité", at: ago(1 * day + 2 * hour) },
      { id: "ev13", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(1 * day + 2 * hour - 4000) },
      { id: "ev14", type: "expired", label: "Expirée — aucun SMS reçu", at: ago(1 * day + 2 * hour - 20 * min) },
      { id: "ev15", type: "refunded", label: "Remboursement automatique crédité", at: ago(1 * day + 2 * hour - 19 * min) },
    ],
  },
  {
    id: "act-6",
    serviceName: "Instagram",
    serviceCode: "ig",
    serviceTint: "#E1306C",
    countryIso: "PL",
    countryName: "Pologne",
    flag: "🇵🇱",
    phoneNumber: "+48 512 337 904",
    status: "cancelled",
    priceCents: 31,
    costCents: 22,
    orderId: "9e2b5f37-8c1d-4a6e-b2f4-7a9c1e3d5f68",
    createdAt: ago(2 * day),
    expiresAt: ago(2 * day - 20 * min),
    cancelAvailableAt: ago(2 * day - 2 * min),
    sms: [],
    events: [
      { id: "ev16", type: "created", label: "Activation créée — wallet débité", at: ago(2 * day) },
      { id: "ev17", type: "number_assigned", label: "Numéro attribué par l'opérateur", at: ago(2 * day - 6000) },
      { id: "ev18", type: "cancelled", label: "Annulée par l'utilisateur — remboursée", at: ago(2 * day - 9 * min) },
    ],
  },
];

export const demoActiveActivations = demoActivations.filter(
  (a) => a.status === "waiting" || a.status === "sms_received"
);

/* ------------------------------ Transactions ------------------------------ */

export const demoTransactions: WalletTransaction[] = [
  { id: "tx1", type: "debit", label: "Activation · Telegram — Royaume-Uni", reference: "act-live", amountCents: -42, status: "confirmed", at: ago(1 * min) },
  { id: "tx2", type: "debit", label: "Activation · Binance — Indonésie", reference: "act-3b2411", amountCents: -68, status: "confirmed", at: ago(12 * min) },
  { id: "tx3", type: "debit", label: "Activation · Discord — Allemagne", reference: "act-8f7b3d", amountCents: -35, status: "confirmed", at: ago(25 * min) },
  { id: "tx4", type: "debit", label: "Activation · WhatsApp — États-Unis", reference: "act-2c9f4e", amountCents: -65, status: "confirmed", at: ago(3 * hour) },
  { id: "tx5", type: "refund", label: "Remboursement · Google — France", reference: "act-5d1a7c", amountCents: 28, status: "confirmed", at: ago(1 * day + 2 * hour - 19 * min) },
  { id: "tx6", type: "debit", label: "Activation · Google — France", reference: "act-5d1a7c", amountCents: -28, status: "confirmed", at: ago(1 * day + 2 * hour) },
  { id: "tx7", type: "refund", label: "Remboursement · Instagram — Pologne", reference: "act-9e2b5f", amountCents: 31, status: "confirmed", at: ago(2 * day - 9 * min) },
  { id: "tx8", type: "credit", label: "Recharge wallet · Carte bancaire", reference: "topup_8d3k2m", amountCents: 2000, status: "confirmed", at: ago(3 * day) },
  { id: "tx9", type: "debit", label: "Activation · Instagram — Pologne", reference: "act-9e2b5f", amountCents: -31, status: "confirmed", at: ago(2 * day) },
  { id: "tx10", type: "credit", label: "Recharge wallet · USDT (TRC-20)", reference: "topup_2f9h7q", amountCents: 1000, status: "confirmed", at: ago(9 * day) },
  { id: "tx11", type: "credit", label: "Recharge wallet · Carte bancaire", reference: "topup_5c1v8n", amountCents: 500, status: "pending", at: ago(9 * day + 2 * hour) },
  { id: "tx12", type: "adjustment", label: "Ajustement manuel · Support", reference: "adj_00417", amountCents: 100, status: "confirmed", at: ago(20 * day) },
];

/* ------------------------------ Notifications ----------------------------- */

export const demoNotifications: AppNotification[] = [
  { id: "nt1", type: "activation", title: "Numéro attribué", body: "Telegram · 🇬🇧 +44 7700 900123 — en attente du SMS.", at: ago(55_000), read: false },
  { id: "nt2", type: "sms", title: "SMS reçu · Discord", body: "Code détecté : 582 391 — activation prête à finaliser.", at: ago(22 * min), read: false },
  { id: "nt3", type: "activation", title: "Activation terminée", body: "WhatsApp · 🇺🇸 code 438 271 utilisé. Merci !", at: ago(3 * hour - 3 * min), read: true },
  { id: "nt4", type: "wallet", title: "Remboursement crédité", body: "Google · 🇫🇷 — 0,28 $ recrédités (aucun SMS reçu).", at: ago(1 * day + 2 * hour - 19 * min), read: true },
  { id: "nt5", type: "wallet", title: "Recharge confirmée", body: "20,00 $ ajoutés à votre wallet (carte bancaire).", at: ago(3 * day), read: true },
  { id: "nt6", type: "system", title: "Bienvenue sur NUMBER OVER", body: "Votre compte est prêt. Rechargez votre wallet pour démarrer.", at: ago(42 * day), read: true },
];

/* ------------------------------- Catalogue -------------------------------- */

const CATALOG_ROWS: Array<[string, string, string, string, number, number]> = [
  // [name, code, tint, category, priceCents, available]
  ["WhatsApp", "wa", "#25D366", "Messagerie", 65, 87],
  ["Telegram", "tg", "#229ED9", "Messagerie", 42, 132],
  ["Google", "go", "#EA4335", "Productivité", 38, 210],
  ["Instagram", "ig", "#E1306C", "Réseaux sociaux", 45, 64],
  ["Discord", "ds", "#5865F2", "Réseaux sociaux", 35, 98],
  ["TikTok", "lf", "#FE2C55", "Réseaux sociaux", 52, 41],
  ["X / Twitter", "tw", "#E7E9EA", "Réseaux sociaux", 48, 23],
  ["Facebook", "fb", "#1877F2", "Réseaux sociaux", 44, 76],
  ["Microsoft", "mm", "#00A4EF", "Productivité", 33, 154],
  ["Amazon", "am", "#FF9900", "Marketplace", 55, 37],
  ["OpenAI", "oi", "#10A37F", "IA & Outils", 59, 29],
  ["Uber", "ub", "#BFBFBF", "Transport", 46, 52],
  ["PayPal", "pp", "#009CDE", "Paiement", 72, 18],
  ["Binance", "bn", "#F0B90B", "Crypto", 68, 12],
  ["Netflix", "nf", "#E50914", "Streaming", 41, 0],
  ["Snapchat", "sn", "#F7F400", "Réseaux sociaux", 39, 83],
];

export const demoCatalog: CatalogService[] = CATALOG_ROWS.map(
  ([name, code, tint, category, priceCents, available]) => ({
    name,
    code,
    tint,
    category,
    priceCents,
    available,
  })
);

export const CATALOG_CATEGORIES = ["Tous", "Messagerie", "Réseaux sociaux", "Productivité", "IA & Outils", "Marketplace", "Paiement", "Crypto", "Transport", "Streaming"];

export const CATALOG_COUNTRIES = [
  { iso: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
  { iso: "FR", name: "France", flag: "🇫🇷" },
  { iso: "US", name: "États-Unis", flag: "🇺🇸" },
  { iso: "DE", name: "Allemagne", flag: "🇩🇪" },
  { iso: "ES", name: "Espagne", flag: "🇪🇸" },
  { iso: "PL", name: "Pologne", flag: "🇵🇱" },
  { iso: "ID", name: "Indonésie", flag: "🇮🇩" },
  { iso: "BR", name: "Brésil", flag: "🇧🇷" },
  { iso: "IN", name: "Inde", flag: "🇮🇳" },
  { iso: "NL", name: "Pays-Bas", flag: "🇳🇱" },
];

/* --------------------------------- Admin ---------------------------------- */

export const demoAdminUsers: AdminUser[] = [
  { id: "u1", name: "Alex Martin", email: "alex.martin@exemple.com", balanceCents: 1250, activationsCount: 34, status: "active", registeredAt: ago(42 * day) },
  { id: "u2", name: "Sophie Bernard", email: "sophie.b@exemple.com", balanceCents: 430, activationsCount: 12, status: "active", registeredAt: ago(31 * day) },
  { id: "u3", name: "Karim Haddad", email: "k.haddad@exemple.com", balanceCents: 8720, activationsCount: 156, status: "active", registeredAt: ago(28 * day) },
  { id: "u4", name: "Léa Dubois", email: "lea.dubois@exemple.com", balanceCents: 95, activationsCount: 3, status: "active", registeredAt: ago(12 * day) },
  { id: "u5", name: "Marc Dupont", email: "marc.d@exemple.com", balanceCents: 0, activationsCount: 48, status: "blocked", registeredAt: ago(25 * day) },
  { id: "u6", name: "Ines Kaci", email: "ines.kaci@exemple.com", balanceCents: 2110, activationsCount: 67, status: "active", registeredAt: ago(18 * day) },
  { id: "u7", name: "Thomas Roy", email: "t.roy@exemple.com", balanceCents: 340, activationsCount: 9, status: "active", registeredAt: ago(6 * day) },
  { id: "u8", name: "Nadia Petit", email: "nadia.p@exemple.com", balanceCents: 60, activationsCount: 1, status: "blocked", registeredAt: ago(2 * day) },
];

export const demoPricingRules: PricingRule[] = [
  { id: "pr1", scope: "global", target: "Tous les services", type: "percent", value: 30, active: true },
  { id: "pr2", scope: "service", target: "WhatsApp", type: "percent", value: 40, active: true },
  { id: "pr3", scope: "service", target: "PayPal", type: "percent", value: 45, active: true },
  { id: "pr4", scope: "country", target: "🇺🇸 États-Unis", type: "percent", value: 35, active: true },
  { id: "pr5", scope: "service_country", target: "Telegram · 🇬🇧 Royaume-Uni", type: "fixed", value: 42, active: true },
  { id: "pr6", scope: "country", target: "🇮🇳 Inde", type: "percent", value: 25, active: false },
];

export const demoProviderLogs: ProviderLog[] = [
  { id: "lg1", method: "GET", endpoint: "/customer/order/f47ac10b", status: 200, latencyMs: 184, at: ago(30_000) },
  { id: "lg2", method: "POST", endpoint: "/customer/purchase", status: 200, latencyMs: 1240, at: ago(1 * min) },
  { id: "lg3", method: "GET", endpoint: "/customer/services", status: 200, latencyMs: 236, at: ago(5 * min) },
  { id: "lg4", method: "GET", endpoint: "/customer/countries", status: 200, latencyMs: 198, at: ago(5 * min) },
  { id: "lg5", method: "GET", endpoint: "/customer/balance", status: 200, latencyMs: 152, at: ago(10 * min) },
  { id: "lg6", method: "GET", endpoint: "/customer/order/3b241101", status: 200, latencyMs: 171, at: ago(12 * min) },
  { id: "lg7", method: "POST", endpoint: "/customer/cancel/9e2b5f37", status: 200, latencyMs: 890, at: ago(2 * day - 9 * min) },
  { id: "lg8", method: "GET", endpoint: "/price?service=tg&country=GB", status: 200, latencyMs: 96, at: ago(15 * min) },
  { id: "lg9", method: "GET", endpoint: "/customer/order/8f7b3d21", status: 429, latencyMs: 88, at: ago(22 * min) },
];

export const demoAdminStats = {
  users: 1284,
  activationsToday: 217,
  revenueTodayCents: 14830,
  costTodayCents: 10642,
  refundsTodayCents: 1214,
  providerBalanceCents: 138220,
  weekly: [
    { day: "Lun", activations: 142, revenueCents: 9310 },
    { day: "Mar", activations: 168, revenueCents: 11025 },
    { day: "Mer", activations: 151, revenueCents: 9872 },
    { day: "Jeu", activations: 189, revenueCents: 12418 },
    { day: "Ven", activations: 204, revenueCents: 13550 },
    { day: "Sam", activations: 231, revenueCents: 15207 },
    { day: "Dim", activations: 217, revenueCents: 14830 },
  ],
};

export function findDemoActivation(id: string) {
  return demoActivations.find((a) => a.id === id);
}
