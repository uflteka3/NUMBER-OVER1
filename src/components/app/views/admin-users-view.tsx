"use client";

import { Ban, CircleCheck, Search, Smartphone, UserRound, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Modal } from "@/components/ui/modal";
import { Table, TBody, Td, Th, THead } from "@/components/ui/table";
import { demoAdminUsers, demoTransactions } from "@/lib/demo/data";
import type { AdminUser } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";

export function AdminUsersView() {
  const demoAction = useDemoAction();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [blocked, setBlocked] = useState<Set<string>>(
    new Set(demoAdminUsers.filter((u) => u.status === "blocked").map((u) => u.id))
  );

  const list = useMemo(
    () =>
      demoAdminUsers.filter(
        (u) =>
          !search ||
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  function toggleBlock(user: AdminUser) {
    setBlocked((prev) => {
      const next = new Set(prev);
      if (next.has(user.id)) next.delete(user.id);
      else next.add(user.id);
      return next;
    });
    demoAction(
      `${blocked.has(user.id) ? "Le déblocage" : "Le blocage"} de ${user.name} (avec audit log)`,
      "Phase 8"
    );
  }

  return (
    <>
      <PageHeader
        title="Utilisateurs"
        description="Recherche, consultation détaillée, historique et modération des comptes."
      />

      <div className="mb-5 relative max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher par nom ou email…"
          aria-label="Rechercher un utilisateur"
          className="h-11 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition-all hover:border-white/[0.16] focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]"
        />
      </div>

      <Card className="p-2 sm:p-4">
        {list.length === 0 ? (
          <EmptyState
            icon={UserRound}
            title="Aucun utilisateur trouvé"
            description="Modifiez votre recherche."
            className="border-0"
          />
        ) : (
          <Table>
            <THead>
              <tr>
                <Th>Utilisateur</Th>
                <Th>Solde</Th>
                <Th>Activations</Th>
                <Th>Statut</Th>
                <Th>Inscription</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </THead>
            <TBody>
              {list.map((u) => {
                const isBlocked = blocked.has(u.id);
                return (
                  <tr key={u.id}>
                    <Td>
                      <button
                        onClick={() => setSelected(u)}
                        className="flex items-center gap-3 text-left transition-opacity hover:opacity-80"
                      >
                        <Avatar name={u.name} size="sm" />
                        <span>
                          <span className="block font-medium text-white">{u.name}</span>
                          <span className="text-xs text-slate-500">{u.email}</span>
                        </span>
                      </button>
                    </Td>
                    <Td className="font-mono text-xs">{formatUSD(u.balanceCents)}</Td>
                    <Td className="font-mono text-xs">{u.activationsCount}</Td>
                    <Td>
                      {isBlocked ? (
                        <Badge tone="danger" dot>bloqué</Badge>
                      ) : (
                        <Badge tone="success" dot>actif</Badge>
                      )}
                    </Td>
                    <Td className="text-xs text-slate-500">
                      <ClientTime iso={u.registeredAt} />
                    </Td>
                    <Td className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelected(u)}>
                          Détails
                        </Button>
                        <Button
                          variant={isBlocked ? "outline" : "danger"}
                          size="sm"
                          onClick={() => toggleBlock(u)}
                        >
                          {isBlocked ? (
                            <><CircleCheck className="size-3.5" /> Débloquer</>
                          ) : (
                            <><Ban className="size-3.5" /> Bloquer</>
                          )}
                        </Button>
                      </div>
                    </Td>
                  </tr>
                );
              })}
            </TBody>
          </Table>
        )}
      </Card>

      {/* Fiche utilisateur */}
      <Modal
        open={selected !== null}
        onClose={() => setSelected(null)}
        title={selected?.name}
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setSelected(null)}>Fermer</Button>
            <Button
              variant="secondary"
              onClick={() => demoAction("L'ajustement manuel de solde (avec motif + audit)", "Phase 8")}
            >
              Ajuster le solde
            </Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="glass rounded-xl p-3.5">
                <Wallet className="mx-auto size-4 text-accent-300" />
                <p className="mt-2 font-mono text-sm font-semibold text-white">{formatUSD(selected.balanceCents)}</p>
                <p className="text-[0.65rem] text-slate-500">solde</p>
              </div>
              <div className="glass rounded-xl p-3.5">
                <Smartphone className="mx-auto size-4 text-brand-300" />
                <p className="mt-2 font-mono text-sm font-semibold text-white">{selected.activationsCount}</p>
                <p className="text-[0.65rem] text-slate-500">activations</p>
              </div>
              <div className="glass rounded-xl p-3.5">
                <UserRound className="mx-auto size-4 text-slate-400" />
                <p className="mt-2 font-mono text-sm font-semibold text-white">
                  <ClientTime iso={selected.registeredAt} mode="datetime" />
                </p>
                <p className="text-[0.65rem] text-slate-500">inscription</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
                Dernières transactions (démo partagée)
              </p>
              <ul className="space-y-2">
                {demoTransactions.slice(0, 4).map((t) => (
                  <li key={t.id} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2.5 text-sm">
                    <span className="min-w-0 truncate text-slate-300">{t.label}</span>
                    <span className={`ml-3 shrink-0 font-mono text-xs ${t.amountCents > 0 ? "text-success-300" : "text-slate-400"}`}>
                      {formatUSD(t.amountCents, { sign: true })}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
