"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { ActivationStatusBadge } from "@/components/app/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Table, TBody, Td, Th, THead } from "@/components/ui/table";
import { Tabs } from "@/components/ui/tabs";
import { demoActivations } from "@/lib/demo/data";
import type { Activation } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";

export function AdminActivationsView() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState<Activation | null>(null);

  const list = useMemo(
    () =>
      demoActivations.filter((a) => {
        if (tab === "live" && !(a.status === "waiting" || a.status === "sms_received")) return false;
        if (tab === "refunded" && !(a.status === "refunded" || a.status === "cancelled")) return false;
        if (
          search &&
          !a.serviceName.toLowerCase().includes(search.toLowerCase()) &&
          !(a.phoneNumber ?? "").includes(search) &&
          !(a.orderId ?? "").includes(search)
        )
          return false;
        return true;
      }),
    [search, tab]
  );

  return (
    <>
      <PageHeader
        title="Activations"
        description="Supervision complète : prix client, coût fournisseur, marge, statut et preuves de réception."
      />

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { id: "all", label: "Toutes", count: demoActivations.length },
            { id: "live", label: "En cours" },
            { id: "refunded", label: "Annulées / remboursées" },
          ]}
        />
        <div className="relative sm:ml-auto sm:w-80">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Service, numéro, order ID…"
            aria-label="Rechercher une activation"
            className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition-all hover:border-white/[0.16] focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]"
          />
        </div>
      </div>

      <Card className="p-2 sm:p-4">
        <Table className="min-w-[56rem]">
          <THead>
            <tr>
              <Th>Activation</Th>
              <Th>Utilisateur</Th>
              <Th>Numéro</Th>
              <Th className="text-right">Prix client</Th>
              <Th className="text-right">Coût</Th>
              <Th className="text-right">Marge</Th>
              <Th>Statut</Th>
              <Th></Th>
            </tr>
          </THead>
          <TBody>
            {list.map((a) => {
              const margin = a.priceCents - a.costCents;
              return (
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
                  <Td className="text-xs">alex.martin@…</Td>
                  <Td className="font-mono text-xs">{a.phoneNumber ?? "—"}</Td>
                  <Td className="text-right font-mono text-xs">{formatUSD(a.priceCents)}</Td>
                  <Td className="text-right font-mono text-xs text-slate-500">{formatUSD(a.costCents)}</Td>
                  <Td className="text-right font-mono text-xs font-semibold text-success-300">
                    +{formatUSD(margin)}
                  </Td>
                  <Td><ActivationStatusBadge status={a.status} /></Td>
                  <Td className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(a)}>
                      Détails
                    </Button>
                  </Td>
                </tr>
              );
            })}
          </TBody>
        </Table>
      </Card>

      {/* Détail activation admin */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.serviceName} · ${selected.countryName}` : undefined}
        size="lg"
        footer={<Button variant="ghost" onClick={() => setSelected(null)}>Fermer</Button>}
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ["Order ID fournisseur", selected.orderId ?? "—"],
                ["Numéro", selected.phoneNumber ?? "—"],
                ["Prix client", formatUSD(selected.priceCents)],
                ["Coût fournisseur", formatUSD(selected.costCents)],
                ["Marge", `+${formatUSD(selected.priceCents - selected.costCents)}`],
                ["Créée le", ""],
              ].map(([k, v], i) => (
                <div key={k} className="glass rounded-xl p-3">
                  <p className="text-[0.65rem] uppercase tracking-wider text-slate-500">{k}</p>
                  <p className="mt-1 truncate font-mono text-xs text-slate-200">
                    {i === 5 ? <ClientTime iso={selected.createdAt} mode="full" /> : v}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Chronologie complète
              </p>
              <ul className="space-y-2">
                {selected.events.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.03] px-3 py-2.5 text-sm">
                    <span className="text-slate-300">{e.label}</span>
                    <ClientTime iso={e.at} className="shrink-0 text-[0.65rem] text-slate-600" />
                  </li>
                ))}
              </ul>
            </div>

            {selected.sms.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                  SMS reçus (preuve)
                </p>
                {selected.sms.map((s) => (
                  <div key={s.id} className="rounded-xl border border-brand-500/20 bg-brand-500/[0.06] p-3.5">
                    <p className="text-xs text-slate-400">{s.sender}</p>
                    <p className="mt-1 text-sm text-slate-200">{s.content}</p>
                    {s.code && <Badge tone="brand" className="mt-2 font-mono">code {s.code}</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
