"use client";

import { KeyRound, Radio, RefreshCcw, Webhook } from "lucide-react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TBody, Td, Th, THead } from "@/components/ui/table";
import { demoAdminStats, demoProviderLogs } from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

const WEBHOOK_EVENTS = [
  { event: "sms.received", desc: "SMS reçu sur un numéro loué", active: true },
  { event: "order.cancelled", desc: "Commande annulée (avec remboursement)", active: true },
  { event: "order.expired", desc: "Commande expirée sans SMS", active: true },
  { event: "order.swapped", desc: "Numéro remplacé", active: true },
  { event: "balance.low", desc: "Solde fournisseur sous seuil", active: true },
];

export function AdminProviderView() {
  const demoAction = useDemoAction();

  return (
    <>
      <PageHeader
        title="Fournisseur — VirtualSMS"
        description="État de la connexion API, solde d'infrastructure, webhooks et journal des requêtes."
        actions={
          <Button variant="secondary" onClick={() => demoAction("La resynchronisation du catalogue", "Phase 5")}>
            <RefreshCcw className="size-4" /> Resynchroniser
          </Button>
        }
      />

      {/* Avertissement d'honnêteté explicite */}
      <div className="mb-6 rounded-xl border border-warning-500/25 bg-warning-500/[0.06] px-4 py-3 text-xs leading-relaxed text-warning-200/90">
        Aperçu de conception : aucune connexion réelle à VirtualSMS n'existe encore — elle sera
        établie en Phase 5 avec la vraie clé API (variable d'environnement serveur, jamais affichée ici).
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Connexion API</p>
          <p className="mt-3"><Badge tone="success" dot pulse>opérationnelle</Badge></p>
          <p className="mt-2 text-[0.65rem] text-slate-600">api/v1 · X-API-Key · 60 req/min</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Solde fournisseur</p>
          <p className="mt-3 font-display text-2xl font-bold text-white">
            {formatUSD(demoAdminStats.providerBalanceCents)}
          </p>
          <p className="mt-1 text-[0.65rem] text-slate-600">visible admin uniquement — démo</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Dernière synchro</p>
          <p className="mt-3 font-display text-2xl font-bold text-white">5 min</p>
          <p className="mt-1 text-[0.65rem] text-slate-600">services · pays · prix</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Requêtes (24 h)</p>
          <p className="mt-3 font-display text-2xl font-bold text-white">1 847</p>
          <p className="mt-1 text-[0.65rem] text-slate-600"><span className="text-success-400">99,6 %</span> de succès</p>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Clé API masquée */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display font-semibold text-white">
            <KeyRound className="size-4 text-brand-300" /> Identifiants
          </h2>
          <dl className="mt-4 space-y-3.5 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
              <dt className="text-slate-400">Clé API</dt>
              <dd className="font-mono text-xs text-slate-300">vsms_••••••••••••03f9</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
              <dt className="text-slate-400">Secret webhook</dt>
              <dd className="font-mono text-xs text-slate-300">whsec_••••••••7c21</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3.5 py-3">
              <dt className="text-slate-400">Stockage</dt>
              <dd className="text-xs text-slate-500">variables d'environnement serveur</dd>
            </div>
          </dl>
          <p className="mt-4 text-[0.65rem] leading-relaxed text-slate-600">
            Par conception, les clés ne sont jamais stockées en base ni affichées en clair — seule
            une empreinte masquée est exposée à l'administration.
          </p>
        </Card>

        {/* Webhooks */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 font-display font-semibold text-white">
            <Webhook className="size-4 text-accent-300" /> Webhooks souscrits
          </h2>
          <ul className="mt-4 space-y-2">
            {WEBHOOK_EVENTS.map((w) => (
              <li key={w.event} className="flex items-center justify-between gap-3 rounded-xl bg-white/[0.03] px-3.5 py-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-slate-200">{w.event}</p>
                  <p className="mt-0.5 text-[0.65rem] text-slate-600">{w.desc}</p>
                </div>
                <Badge tone="success" dot>actif</Badge>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[0.65rem] leading-relaxed text-slate-600">
            Chaque événement entrant est vérifié par signature HMAC-SHA256 et dédupliqué avant
            traitement (idempotence).
          </p>
        </Card>
      </div>

      {/* Journal des requêtes */}
      <Card className="mt-6 p-4 sm:p-5">
        <h2 className="mb-4 flex items-center gap-2 px-1 font-display font-semibold text-white">
          <Radio className="size-4 text-success-300" /> Journal des requêtes (sanitisé)
        </h2>
        <Table>
          <THead>
            <tr>
              <Th>Méthode</Th>
              <Th>Endpoint</Th>
              <Th className="text-right">Statut</Th>
              <Th className="text-right">Latence</Th>
              <Th className="text-right">Horodatage</Th>
            </tr>
          </THead>
          <TBody>
            {demoProviderLogs.map((log) => (
              <tr key={log.id}>
                <Td>
                  <Badge tone={log.method === "GET" ? "accent" : "brand"} className="font-mono text-[0.65rem]">
                    {log.method}
                  </Badge>
                </Td>
                <Td className="font-mono text-xs text-slate-300">{log.endpoint}</Td>
                <Td className={cn("text-right font-mono text-xs font-semibold", log.status === 200 ? "text-success-300" : "text-warning-300")}>
                  {log.status}
                </Td>
                <Td className="text-right font-mono text-xs text-slate-500">{log.latencyMs} ms</Td>
                <Td className="text-right text-xs text-slate-500">
                  <ClientTime iso={log.at} />
                </Td>
              </tr>
            ))}
          </TBody>
        </Table>
        <p className="mt-4 px-1 text-[0.65rem] leading-relaxed text-slate-600">
          Le journal ne contient jamais ni clé, ni secret, ni corps de requête sensible — un code`429`
          ci-dessus illustre la gestion du rate limiting (backoff automatique).
        </p>
      </Card>
    </>
  );
}
