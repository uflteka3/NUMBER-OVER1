"use client";

import { Smartphone } from "lucide-react";
import { useMemo, useState } from "react";
import { ActivationCard } from "@/components/app/activation-card";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { demoActivations } from "@/lib/demo/data";
import type { ActivationStatus } from "@/lib/demo/types";

const FILTER_TABS: Array<{ id: string; label: string; match: (s: ActivationStatus) => boolean }> = [
  { id: "all", label: "Toutes", match: () => true },
  { id: "live", label: "En cours", match: (s) => s === "waiting" || s === "sms_received" },
  { id: "completed", label: "Terminées", match: (s) => s === "completed" },
  { id: "closed", label: "Clôturées", match: (s) => s === "expired" || s === "cancelled" || s === "refunded" },
];

export function ActivationsView() {
  const [tab, setTab] = useState("all");

  const counts = useMemo(
    () =>
      Object.fromEntries(
        FILTER_TABS.map((t) => [t.id, demoActivations.filter((a) => t.match(a.status)).length])
      ),
    []
  );

  const active = FILTER_TABS.find((t) => t.id === tab)!;
  const list = demoActivations.filter((a) => active.match(a.status));

  return (
    <>
      <PageHeader
        title="Mes activations"
        description="Chaque activation est suivie en temps réel, de l'attribution du numéro à la réception du code."
        actions={<Button href="/catalogue">Nouvelle activation</Button>}
      />

      <Tabs
        className="mb-6"
        active={tab}
        onChange={setTab}
        tabs={FILTER_TABS.map((t) => ({ id: t.id, label: t.label, count: counts[t.id] }))}
      />

      {list.length === 0 ? (
        <EmptyState
          icon={Smartphone}
          title="Aucune activation ici"
          description="Les activations correspondant à ce filtre apparaîtront ici."
          action={<Button href="/catalogue" size="sm">Acheter un numéro</Button>}
        />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {list.map((a) => (
            <ActivationCard key={a.id} activation={a} />
          ))}
        </div>
      )}
    </>
  );
}
