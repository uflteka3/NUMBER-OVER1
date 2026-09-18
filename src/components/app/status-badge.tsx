import { Badge } from "@/components/ui/badge";
import type { ActivationStatus, TransactionStatus, TransactionType } from "@/lib/demo/types";

const ACTIVATION_STATUS: Record<
  ActivationStatus,
  { label: string; tone: "warning" | "brand" | "success" | "neutral" | "danger" | "accent"; pulse?: boolean }
> = {
  waiting: { label: "En attente", tone: "warning", pulse: true },
  sms_received: { label: "SMS reçu", tone: "brand", pulse: true },
  completed: { label: "Terminée", tone: "success" },
  expired: { label: "Expirée", tone: "neutral" },
  cancelled: { label: "Annulée", tone: "danger" },
  refunded: { label: "Remboursée", tone: "accent" },
};

export function ActivationStatusBadge({ status }: { status: ActivationStatus }) {
  const s = ACTIVATION_STATUS[status];
  return (
    <Badge tone={s.tone} dot pulse={s.pulse}>
      {s.label}
    </Badge>
  );
}

const TX_TYPE: Record<TransactionType, { label: string; tone: "success" | "neutral" | "accent" | "brand" }> = {
  credit: { label: "Crédit", tone: "success" },
  debit: { label: "Débit", tone: "neutral" },
  refund: { label: "Remboursement", tone: "accent" },
  adjustment: { label: "Ajustement", tone: "brand" },
};

export function TransactionTypeBadge({ type }: { type: TransactionType }) {
  const t = TX_TYPE[type];
  return <Badge tone={t.tone}>{t.label}</Badge>;
}

const TX_STATUS: Record<TransactionStatus, { label: string; tone: "success" | "warning" | "danger" }> = {
  confirmed: { label: "Confirmée", tone: "success" },
  pending: { label: "En cours", tone: "warning" },
  failed: { label: "Échouée", tone: "danger" },
};

export function TransactionStatusDot({ status }: { status: TransactionStatus }) {
  const s = TX_STATUS[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
      <Badge tone={s.tone} dot pulse={status === "pending"}>
        {s.label}
      </Badge>
    </span>
  );
}
