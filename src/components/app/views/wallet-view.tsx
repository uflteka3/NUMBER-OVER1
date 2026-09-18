"use client";

import { ArrowDownLeft, ArrowUpRight, CreditCard, Landmark, Plus, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { TransactionStatusDot, TransactionTypeBadge } from "@/components/app/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Tabs } from "@/components/ui/tabs";
import { demoTransactions, demoUser } from "@/lib/demo/data";
import type { TransactionType } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

const TOPUP_AMOUNTS = [500, 1000, 2000, 5000, 10000];

const TX_FILTER: Array<{ id: string; label: string; match: (t: TransactionType) => boolean }> = [
  { id: "all", label: "Toutes", match: () => true },
  { id: "credit", label: "Crédits", match: (t) => t === "credit" || t === "adjustment" },
  { id: "debit", label: "Débits", match: (t) => t === "debit" },
  { id: "refund", label: "Remboursements", match: (t) => t === "refund" },
];

export function WalletView() {
  const demoAction = useDemoAction();
  const [topupOpen, setTopupOpen] = useState(false);
  const [amount, setAmount] = useState(2000);
  const [custom, setCustom] = useState("");
  const [tab, setTab] = useState("all");

  const filter = TX_FILTER.find((f) => f.id === tab)!;
  const list = useMemo(
    () => demoTransactions.filter((t) => filter.match(t.type)),
    [filter]
  );

  const effectiveAmount = custom ? Math.round(parseFloat(custom.replace(",", ".")) * 100) || 0 : amount;
  const totalCredited = demoTransactions.filter((t) => t.amountCents > 0).reduce((s, t) => s + t.amountCents, 0);
  const totalSpent = demoTransactions.filter((t) => t.type === "debit").reduce((s, t) => s + Math.abs(t.amountCents), 0);

  return (
    <>
      <PageHeader
        title="Wallet"
        description="Votre solde alimente vos activations. Chaque mouvement est tracé dans un registre inaltérable."
      />

      <div className="grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Solde */}
        <Card className="relative overflow-hidden p-6">
          <div className="absolute -right-10 -top-10 size-44 rounded-full bg-brand-500/15 blur-3xl" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                Solde disponible
              </p>
              <Badge tone="warning" className="text-[0.62rem]">démo</Badge>
            </div>
            <p className="mt-3 font-display text-[2.6rem] font-bold tracking-tight text-white">
              {formatUSD(demoUser.balanceCents)}
            </p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              <Button onClick={() => setTopupOpen(true)}>
                <Plus className="size-4" /> Recharger
              </Button>
              <Button variant="secondary" href="/catalogue">
                Acheter un numéro
              </Button>
            </div>
          </div>
        </Card>

        {/* Résumé */}
        <Card className="p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Résumé</p>
          <dl className="mt-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-lg bg-success-500/12 text-success-400">
                  <ArrowDownLeft className="size-3.5" />
                </span>
                Total crédité
              </dt>
              <dd className="font-mono text-sm font-medium text-success-300">+{formatUSD(totalCredited)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
                  <ArrowUpRight className="size-3.5" />
                </span>
                Total dépensé
              </dt>
              <dd className="font-mono text-sm font-medium text-slate-300">−{formatUSD(totalSpent)}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-2.5 text-sm text-slate-400">
                <span className="flex size-8 items-center justify-center rounded-lg bg-accent-500/12 text-accent-300">
                  <RotateCcw className="size-3.5" />
                </span>
                Remboursements reçus
              </dt>
              <dd className="font-mono text-sm font-medium text-accent-300">
                +{formatUSD(demoTransactions.filter((t) => t.type === "refund").reduce((s, t) => s + t.amountCents, 0))}
              </dd>
            </div>
          </dl>
          <p className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-[0.7rem] leading-relaxed text-slate-500">
            Le solde n'est jamais modifié directement : chaque variation correspond à une ligne du
            registre ci-dessous (crédit, débit, remboursement ou ajustement).
          </p>
        </Card>
      </div>

      {/* Transactions */}
      <Card className="mt-6 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display font-semibold text-white">Registre des transactions</h2>
          <Tabs
            active={tab}
            onChange={setTab}
            tabs={TX_FILTER.map((f) => ({ id: f.id, label: f.label }))}
          />
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {list.map((tx) => {
            const positive = tx.amountCents > 0;
            return (
              <li key={tx.id} className="flex items-center gap-3.5 py-3.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    positive ? "bg-success-500/12 text-success-400" : "bg-white/[0.06] text-slate-400"
                  )}
                >
                  {positive ? <ArrowDownLeft className="size-4" /> : <ArrowUpRight className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-slate-200">{tx.label}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <TransactionTypeBadge type={tx.type} />
                    <span className="font-mono text-[0.65rem] text-slate-600">{tx.reference}</span>
                    <ClientTime iso={tx.at} className="text-[0.65rem] text-slate-600" />
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn("font-mono text-sm font-semibold", positive ? "text-success-300" : "text-slate-200")}>
                    {formatUSD(tx.amountCents, { sign: true })}
                  </p>
                  <TransactionStatusDot status={tx.status} />
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Modale de recharge (aperçu — paiements en Phase 6) */}
      <Modal
        open={topupOpen}
        onClose={() => setTopupOpen(false)}
        title="Recharger le wallet"
        description="Choisissez un montant. La confirmation de paiement est vérifiée côté serveur avant tout crédit (Phase 6)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setTopupOpen(false)}>Fermer</Button>
            <Button onClick={() => demoAction("Le paiement (carte / crypto)", "Phase 6")}>
              Procéder au paiement · {formatUSD(effectiveAmount)}
            </Button>
          </>
        }
      >
        <div className="grid grid-cols-3 gap-2">
          {TOPUP_AMOUNTS.map((a) => (
            <button
              key={a}
              onClick={() => { setAmount(a); setCustom(""); }}
              aria-pressed={!custom && amount === a}
              className={cn(
                "rounded-xl border px-2 py-3 font-mono text-sm font-medium transition-all",
                !custom && amount === a
                  ? "border-brand-400/60 bg-brand-500/15 text-white"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-300 hover:border-white/[0.18]"
              )}
            >
              {formatUSD(a)}
            </button>
          ))}
          <div className="col-span-3">
            <input
              type="text"
              inputMode="decimal"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Montant personnalisé ($)"
              aria-label="Montant personnalisé en dollars"
              className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 font-mono text-sm text-white placeholder:text-slate-500 focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-slate-400">Moyen de paiement</p>
          <div className="grid grid-cols-2 gap-2">
            <span className="glass flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm text-slate-200">
              <CreditCard className="size-4 text-brand-300" /> Carte bancaire
              <Badge tone="neutral" className="ml-auto text-[0.6rem]">Phase 6</Badge>
            </span>
            <span className="glass flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm text-slate-200">
              <Landmark className="size-4 text-warning-300" /> Crypto (USDT…)
              <Badge tone="neutral" className="ml-auto text-[0.6rem]">Phase 6</Badge>
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
}
