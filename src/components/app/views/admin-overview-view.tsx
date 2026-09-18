"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Radio,
  RotateCcw,
  Smartphone,
  TrendingUp,
  Users,
  Wallet,
  Webhook,
} from "lucide-react";
import Link from "next/link";
import { useDemoAction } from "@/components/app/demo-action";
import { PageHeader } from "@/components/app/page-header";
import { StatCard } from "@/components/app/stat-card";
import { MiniBarChart } from "@/components/app/mini-bar-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { demoAdminStats } from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";

export function AdminOverviewView() {
  const demoAction = useDemoAction();
  const marginCents = demoAdminStats.revenueTodayCents - demoAdminStats.costTodayCents;
  const marginPct = Math.round((marginCents / demoAdminStats.revenueTodayCents) * 100);

  return (
    <>
      <PageHeader
        title="Vue d'ensemble"
        description="Santé de la plateforme : activité, revenus, coûts fournisseur et alertes."
        actions={
          <Button variant="secondary" onClick={() => demoAction("Le rapport complet", "Phase 8")}>
            <Activity className="size-4" /> Rapport complet
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Utilisateurs" value={demoAdminStats.users.toLocaleString("fr-FR")} sub="comptes créés" tint="brand" trend={{ value: "+4,2% /sem", positive: true }} />
        <StatCard icon={Smartphone} label="Activations (24 h)" value={String(demoAdminStats.activationsToday)} sub="toutes sources" tint="accent" trend={{ value: "+7,8% /j", positive: true }} />
        <StatCard icon={Wallet} label="Revenus (24 h)" value={formatUSD(demoAdminStats.revenueTodayCents)} sub={`coût fournisseur ${formatUSD(demoAdminStats.costTodayCents)}`} tint="success" />
        <StatCard icon={TrendingUp} label="Marge brute (24 h)" value={formatUSD(marginCents)} sub={`${marginPct}% du CA`} tint="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* Graphique */}
        <Card className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-display font-semibold text-white">Activations — 7 derniers jours</h2>
              <p className="mt-1 text-xs text-slate-500">Volume et revenus quotidiens (démo)</p>
            </div>
            <Badge tone="brand">cette semaine</Badge>
          </div>
          <MiniBarChart
            className="h-44"
            data={demoAdminStats.weekly.map((d) => ({ label: d.day, value: d.activations }))}
            valueLabel={(v) => `${v} act.`}
          />
          <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.06] pt-4 text-center">
            <div>
              <p className="font-mono text-sm font-semibold text-white">
                {demoAdminStats.weekly.reduce((s, d) => s + d.activations, 0)}
              </p>
              <p className="text-[0.65rem] uppercase tracking-wider text-slate-500">activations</p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-white">
                {formatUSD(demoAdminStats.weekly.reduce((s, d) => s + d.revenueCents, 0))}
              </p>
              <p className="text-[0.65rem] uppercase tracking-wider text-slate-500">revenus</p>
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-success-300">
                {formatUSD(demoAdminStats.refundsTodayCents)}
              </p>
              <p className="text-[0.65rem] uppercase tracking-wider text-slate-500">remboursés (24 h)</p>
            </div>
          </div>
        </Card>

        {/* Alertes & état fournisseur */}
        <div className="space-y-4">
          <Card className="border-warning-500/25 p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-warning-500/15 text-warning-300">
                <AlertTriangle className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Solde fournisseur sous seuil</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">
                  Le webhook <code className="font-mono text-[0.65rem] text-warning-300">balance.low</code> se
                  déclenchera sous 1 000,00 $. Solde d'aperçu :{" "}
                  <span className="font-mono text-slate-200">{formatUSD(demoAdminStats.providerBalanceCents)}</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
              <Radio className="size-4 text-accent-300" /> Fournisseur d'infrastructure
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Connexion API</dt>
                <dd><Badge tone="success" dot pulse>opérationnelle</Badge></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Webhooks</dt>
                <dd><Badge tone="success" dot>5 événements actifs</Badge></dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Catalogue synchronisé</dt>
                <dd className="font-mono text-xs text-slate-300">il y a 5 min</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Taux d'erreur (1 h)</dt>
                <dd className="font-mono text-xs text-success-300">0,4 %</dd>
              </div>
            </dl>
            <Link
              href="/admin/fournisseur"
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-brand-300 transition-colors hover:text-brand-200"
            >
              Détails fournisseur <ArrowRight className="size-3.5" />
            </Link>
          </Card>

          <Card className="p-5">
            <h2 className="flex items-center gap-2 font-display text-sm font-semibold text-white">
              <Webhook className="size-4 text-brand-300" /> Derniers événements webhooks
            </h2>
            <ul className="mt-3 space-y-2.5">
              {[
                { ev: "sms.received", time: "il y a 2 min", ok: true },
                { ev: "order.expired", time: "il y a 18 min", ok: true },
                { ev: "order.cancelled", time: "il y a 41 min", ok: true },
                { ev: "balance.low", time: "il y a 6 j", ok: true },
              ].map((w) => (
                <li key={w.ev + w.time} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2">
                  <span className="font-mono text-xs text-slate-300">{w.ev}</span>
                  <span className="flex items-center gap-2 text-[0.65rem] text-slate-500">
                    {w.time}
                    <RotateCcw className="size-3 text-success-400" aria-label="livré" />
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
