"use client";

import { Download, RotateCcw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { ActivationStatusBadge, TransactionStatusDot, TransactionTypeBadge } from "@/components/app/status-badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TBody, Td, Th, THead } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { demoActivations, demoTransactions } from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";

const TABS = [
  { id: "activations", label: "Activations" },
  { id: "transactions", label: "Transactions" },
  { id: "refunds", label: "Remboursements" },
];

export function HistoriqueView() {
  const demoAction = useDemoAction();
  const [tab, setTab] = useState("activations");
  const [search, setSearch] = useState("");

  const activations = useMemo(
    () =>
      demoActivations.filter(
        (a) =>
          !search ||
          a.serviceName.toLowerCase().includes(search.toLowerCase()) ||
          a.countryName.toLowerCase().includes(search.toLowerCase()) ||
          (a.phoneNumber ?? "").includes(search)
      ),
    [search]
  );

  const transactions = useMemo(
    () =>
      demoTransactions.filter(
        (t) =>
          !search ||
          t.label.toLowerCase().includes(search.toLowerCase()) ||
          t.reference.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const refunds = transactions.filter((t) => t.type === "refund");

  return (
    <>
      <PageHeader
        title="Historique"
        description="Toutes vos opérations, exportables. Rien n'est modifiable a posteriori."
        actions={
          <Button
            variant="secondary"
            onClick={() => demoAction("L'export CSV/JSON de vos données", "Phase 8")}
          >
            <Download className="size-4" /> Exporter
          </Button>
        }
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs active={tab} onChange={setTab} tabs={TABS} />
        <div className="relative sm:ml-auto sm:w-72">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            aria-label="Rechercher dans l'historique"
            className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition-all hover:border-white/[0.16] focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]"
          />
        </div>
      </div>

      <Card className="p-2 sm:p-4">
        {tab === "activations" &&
          (activations.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Aucun résultat"
              description="Aucune activation ne correspond à cette recherche."
              className="border-0"
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Service</Th>
                  <Th>Numéro</Th>
                  <Th>Statut</Th>
                  <Th className="text-right">Prix</Th>
                  <Th className="text-right">Date</Th>
                </tr>
              </THead>
              <TBody>
                {activations.map((a) => (
                  <tr key={a.id}>
                    <Td>
                      <span className="flex items-center gap-2.5">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg font-display text-[0.65rem] font-bold"
                          style={{ backgroundColor: a.serviceTint + "26", color: a.serviceTint }}
                        >
                          {a.serviceName.slice(0, 2).toUpperCase()}
                        </span>
                        <span>
                          <span className="block font-medium text-white">{a.serviceName}</span>
                          <span className="text-xs text-slate-500">{a.flag} {a.countryName}</span>
                        </span>
                      </span>
                    </Td>
                    <Td className="font-mono text-xs">{a.phoneNumber ?? "—"}</Td>
                    <Td><ActivationStatusBadge status={a.status} /></Td>
                    <Td className="text-right font-mono text-xs">{formatUSD(a.priceCents)}</Td>
                    <Td className="text-right text-xs text-slate-500">
                      <ClientTime iso={a.createdAt} mode="datetime" />
                    </Td>
                  </tr>
                ))}
              </TBody>
            </Table>
          ))}

        {tab === "transactions" &&
          (transactions.length === 0 ? (
            <EmptyState
              icon={Search}
              title="Aucun résultat"
              description="Aucune transaction ne correspond à cette recherche."
              className="border-0"
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Libellé</Th>
                  <Th>Type</Th>
                  <Th>Référence</Th>
                  <Th>Statut</Th>
                  <Th className="text-right">Montant</Th>
                </tr>
              </THead>
              <TBody>
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <Td>
                      <span className="block max-w-64 truncate font-medium text-slate-200">{t.label}</span>
                      <ClientTime iso={t.at} className="text-[0.65rem] text-slate-600" />
                    </Td>
                    <Td><TransactionTypeBadge type={t.type} /></Td>
                    <Td className="font-mono text-xs text-slate-500">{t.reference}</Td>
                    <Td><TransactionStatusDot status={t.status} /></Td>
                    <Td className={`text-right font-mono text-xs font-semibold ${t.amountCents > 0 ? "text-success-300" : "text-slate-300"}`}>
                      {formatUSD(t.amountCents, { sign: true })}
                    </Td>
                  </tr>
                ))}
              </TBody>
            </Table>
          ))}

        {tab === "refunds" &&
          (refunds.length === 0 ? (
            <EmptyState
              icon={RotateCcw}
              title="Aucun remboursement"
              description="Les remboursements (activation expirée sans SMS, annulation) apparaîtront ici."
              className="border-0"
            />
          ) : (
            <Table>
              <THead>
                <tr>
                  <Th>Activation</Th>
                  <Th>Référence</Th>
                  <Th>Statut</Th>
                  <Th className="text-right">Recrédité</Th>
                </tr>
              </THead>
              <TBody>
                {refunds.map((t) => (
                  <tr key={t.id}>
                    <Td>
                      <span className="block max-w-64 truncate font-medium text-slate-200">{t.label}</span>
                      <ClientTime iso={t.at} className="text-[0.65rem] text-slate-600" />
                    </Td>
                    <Td className="font-mono text-xs text-slate-500">{t.reference}</Td>
                    <Td><TransactionStatusDot status={t.status} /></Td>
                    <Td className="text-right font-mono text-xs font-semibold text-accent-300">
                      {formatUSD(t.amountCents, { sign: true })}
                    </Td>
                  </tr>
                ))}
              </TBody>
            </Table>
          ))}
      </Card>
    </>
  );
}
