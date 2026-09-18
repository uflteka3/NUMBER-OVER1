/**
 * Types de la couche données d'aperçu (mode démo).
 * Ces formes reflètent les futures réponses API NUMBER OVER (Phases 4-5) :
 * les composants UI consomment ces types aujourd'hui et seront alimentés
 * par Supabase sans modification d'interface.
 */

export type ActivationStatus =
  | "waiting" // numéro attribué, en attente du SMS
  | "sms_received" // SMS reçu, code disponible
  | "completed" // activation terminée
  | "expired" // fenêtre écoulée sans SMS
  | "cancelled" // annulée par l'utilisateur
  | "refunded"; // remboursée

export interface SmsMessage {
  id: string;
  sender: string;
  content: string;
  code: string | null;
  receivedAt: string; // ISO
}

export interface ActivationEvent {
  id: string;
  type: "created" | "number_assigned" | "sms_received" | "completed" | "cancelled" | "expired" | "refunded" | "swapped";
  label: string;
  at: string; // ISO
}

export interface Activation {
  id: string;
  serviceName: string;
  serviceCode: string;
  serviceTint: string;
  countryIso: string;
  countryName: string;
  flag: string;
  phoneNumber: string | null;
  status: ActivationStatus;
  priceCents: number; // prix client (démo)
  costCents: number; // coût fournisseur (démo)
  orderId: string | null;
  createdAt: string;
  expiresAt: string;
  cancelAvailableAt: string; // fin du hold de 2 minutes
  sms: SmsMessage[];
  events: ActivationEvent[];
}

export type TransactionType = "credit" | "debit" | "refund" | "adjustment";
export type TransactionStatus = "confirmed" | "pending" | "failed";

export interface WalletTransaction {
  id: string;
  type: TransactionType;
  label: string;
  reference: string;
  amountCents: number; // signé selon type chez l'appelant : positif = crédit
  status: TransactionStatus;
  at: string;
}

export type NotificationType = "sms" | "activation" | "wallet" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  at: string;
  read: boolean;
}

export interface CatalogService {
  code: string;
  name: string;
  tint: string;
  category: string;
  priceCents: number; // prix client démo pour le pays sélectionné
  available: number; // stock démo
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  balanceCents: number;
  activationsCount: number;
  status: "active" | "blocked";
  registeredAt: string;
}

export interface PricingRule {
  id: string;
  scope: "global" | "service" | "country" | "service_country";
  target: string; // nom du service/pays ou "Tous"
  type: "percent" | "fixed";
  value: number; // % ou cents
  active: boolean;
}

export interface ProviderLog {
  id: string;
  method: "GET" | "POST";
  endpoint: string;
  status: number;
  latencyMs: number;
  at: string;
}
