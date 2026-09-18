"use client";

import {
  ArrowDownLeft,
  ArrowUpRight,
  History,
  ListPlus,
  Plus,
  RotateCcw,
  Smartphone,
  Wallet,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { ActivationCard } from "@/components/app/activation-card";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { TransactionTypeBadge } from "@/components/app/status-badge";
import { useDemoAction } from "@/components/app/demo-action";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  demoActiveActivations,
  demoNotifications,
  demoTransactions,
  demoUser,
} from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";

const SHORTCUTS = [
  { href: "/catalogue", icon: ListPlus, label: "Nouvelle activation", tint: "from-brand-500/25 to-accent-500/15 text-brand-200" },
  { href: "/wallet", icon: Wallet, label: "Recharger", tint: "from-success-500/25 to-success-500/10 text-success-300" },
  { href: "/activations", icon: Smartphone, label: "Mes activations", tint: "from-accent-500/25 to-accent-500/10 text-accent-300" },
  { href: "/historique", icon: History, label: "Historique", tint: "from-warning-500/25 to-warning-500/10 text-warning-300" },
];

export function DashboardView() {
  const demoAction = useDemoAction();
  const unreadCount = demoNotifications.filter((n) => !n.read).length;
  const recentTx = demoTransactions.slice(0, 5);
  const todaySpent = demoTransactions
    .filter((t) => t.type === "debit")
    .slice(0, 4)
    .reduce((sum, t) => sum + Math.abs(t.amountCents), 0);

  return (
    <>
      <PageHeader
        title={`Bonjour, ${demoUser.name.split(" ")[0]} 👋`}
        description="Voici l'état de votre compte en un coup d'œil."
        actions={
          <Button href="/catalogue">
            <Plus className="size-4" /> Nouvelle activation
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Reveal>
          <StatCard
            icon={Wallet}
            label="Solde wallet"
            value={formatUSD(demoUser.balanceCents)}
            sub="disponible immédiatement"
            tint="accent"
          />
        </Reveal>
        <Reveal delay={0.06}>
          <StatCard
            icon={Zap}
            label="Activations en cours"
            value={String(demoActiveActivations.length)}
            sub="numéros en attente de SMS"
            tint="brand"
          />
        </Reveal>
        <Reveal delay={0.12}>
          <StatCard
            icon={Smartphone}
            label="Dépensé récemment"
            value={formatUSD(todaySpent)}
            sub="sur vos 4 dernières activations"
            tint="warning"
          />
        </Reveal>
        <Reveal delay={0.18}>
          <StatCard
            icon={RotateCcw}
            label="Notifications"
            value={String(unreadCount)}
            sub="non lues"
            tint="success"
          />
        </Reveal>
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SHORTCUTS.map((shortcut) => (
            <Link
              key={shortcut.href}
              href={shortcut.href}
              className="glass group flex flex-col items-center gap-2.5 rounded-2xl p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16]"
            >
              <span
                className={`flex size-10 items-center justify-center rounded-xl bg-gradient-to-br ${shortcut.tint}`}
              >
                <shortcut.icon className="size-4.5" />
              </span>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">
                {shortcut.label}
              </span>
            </Link>
          ))}
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveal delay={0.12}>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-semibold text-white">Activations en cours</h2>
              <Link href="/activations" className="text-xs font-medium text-brand-300 hover:text-brand-200">
                Tout voir →
              </Link>
            </div>
            <div className="space-y-3">
              {demoActiveActivations.length === 0 ? (
                <EmptyState
                  icon={Smartphone}
                  title="Aucune activation en cours"
                  description="Achetez un numéro depuis le catalogue pour recevoir votre premier code."
                  action={<Button href="/catalogue" size="sm">Voir le catalogue</Button>}
                />
              ) : (
                demoActiveActivations.map((a) => <ActivationCard key={a.id} activation={a} />)
              )}
            </div>

            <div className="mt-5 border-t border-white/[0.06] pt-4">
              <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Dernières activations terminées
              </h3>
              <div className="space-y-3">
                {demoNotifications
                  .filter((n) => n.type === "activation")
                  .slice(0, 2)
                  .map((n) => (
                    <div key={n.id} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-brand-400" />
                      <div className="min-w-0">
                        <p className="text-slate-300">{n.body}</p>
                        <ClientTime iso={n.at} className="text-[0.7rem] text-slate-600" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </Card>
        </Reveal>

        <Reveal delay={0.18}>
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display font-semibold text-white">Dernières transactions</h2>
              <Badge tone="warning" className="text-[0.62rem]">démo</Badge>
            </div>
            <ul className="divide-y divide-white/[0.05]">
              {recentTx.map((tx) => {
                const positive = tx.amountCents > 0;
                return (
                  <li key={tx.id} className="flex items-center gap-3 py-3">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
                        positive
                          ? "bg-success-500/12 text-success-400"
                          : "bg-white/[0.06] text-slate-400"
                      }`}
                    >
                      {positive ? <ArrowDownLeft className="size-3.5" /> : <ArrowUpRight className="size-3.5" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-slate-200">{tx.label}</p>
                      <div className="mt-0.5 flex items-center gap-2">
                        <TransactionTypeBadge type={tx.type} />
                        <ClientTime iso={tx.at} className="text-[0.65rem] text-slate-600" />
                      </div>
                    </div>
                    <span
                      className={`font-mono text-sm font-medium ${
                        positive ? "text-success-300" : "text-slate-300"
                      }`}
                    >
                      {formatUSD(tx.amountCents, { sign: true })}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => demoAction("Le détail complet du wallet", "Phase 6")}
              className="mt-3 w-full rounded-xl border border-white/[0.07] py-2.5 text-xs font-medium text-slate-400 transition-colors hover:border-white/[0.15] hover:text-white"
            >
              Voir tout l'historique
            </button>
          </Card>
        </Reveal>
      </div>
    </>
  );
}
