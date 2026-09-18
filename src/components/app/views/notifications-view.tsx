"use client";

import { Bell, CheckCheck, Info, MessageSquareText, Smartphone, Wallet } from "lucide-react";
import { useMemo, useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { demoNotifications } from "@/lib/demo/data";
import type { NotificationType } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const TYPE_META: Record<NotificationType, { icon: typeof Info; label: string; tint: string }> = {
  sms: { icon: MessageSquareText, label: "SMS", tint: "bg-brand-500/15 text-brand-300" },
  activation: { icon: Smartphone, label: "Activation", tint: "bg-accent-500/15 text-accent-300" },
  wallet: { icon: Wallet, label: "Wallet", tint: "bg-success-500/15 text-success-300" },
  system: { icon: Info, label: "Système", tint: "bg-white/[0.08] text-slate-400" },
};

export function NotificationsView() {
  const demoAction = useDemoAction();
  const [filter, setFilter] = useState("all");
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const items = useMemo(
    () =>
      demoNotifications
        .map((n) => ({ ...n, read: n.read || readIds.has(n.id) }))
        .filter((n) => filter === "all" || n.type === filter || (filter === "unread" && !n.read)),
    [filter, readIds]
  );

  const unreadCount = demoNotifications.filter((n) => !n.read && !readIds.has(n.id)).length;

  return (
    <>
      <PageHeader
        title="Notifications"
        description="SMS reçus, changements de statut, mouvements de wallet et informations système."
        actions={
          <Button
            variant="secondary"
            disabled={unreadCount === 0}
            onClick={() => {
              setReadIds(new Set(demoNotifications.map((n) => n.id)));
            }}
          >
            <CheckCheck className="size-4" />
            Tout marquer lu {unreadCount > 0 && `(${unreadCount})`}
          </Button>
        }
      />

      <Tabs
        className="mb-6"
        active={filter}
        onChange={setFilter}
        tabs={[
          { id: "all", label: "Toutes", count: demoNotifications.length },
          { id: "unread", label: "Non lues", count: unreadCount },
          { id: "sms", label: "SMS" },
          { id: "activation", label: "Activations" },
          { id: "wallet", label: "Wallet" },
          { id: "system", label: "Système" },
        ]}
      />

      {items.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Aucune notification"
          description="Les événements importants de votre compte apparaîtront ici, en temps réel."
        />
      ) : (
        <ul className="space-y-2.5">
          {items.map((n) => {
            const meta = TYPE_META[n.type];
            return (
              <li key={n.id}>
                <button
                  onClick={() =>
                    n.read ? demoAction("L'ouverture d'une notification liée", "Phase 4") : setReadIds((p) => new Set(p).add(n.id))
                  }
                  className={cn(
                    "glass group flex w-full items-start gap-4 rounded-2xl p-4 text-left transition-all duration-200 hover:border-white/[0.16]",
                    !n.read && "border-brand-500/20 bg-brand-500/[0.05]"
                  )}
                >
                  <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", meta.tint)}>
                    <meta.icon className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={cn("text-sm font-semibold", n.read ? "text-slate-300" : "text-white")}>
                        {n.title}
                      </p>
                      <Badge tone="neutral" className="text-[0.6rem]">{meta.label}</Badge>
                      {!n.read && <span className="size-1.5 rounded-full bg-brand-400" aria-label="Non lue" />}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{n.body}</p>
                  </div>
                  <ClientTime iso={n.at} className="shrink-0 text-[0.65rem] text-slate-600" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
