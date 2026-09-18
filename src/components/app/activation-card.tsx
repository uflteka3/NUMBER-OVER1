"use client";

import { ChevronRight, MessageSquareText } from "lucide-react";
import Link from "next/link";
import { ActivationStatusBadge } from "@/components/app/status-badge";
import { Countdown } from "@/components/ui/countdown";
import type { Activation } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";
import { ClientTime } from "./client-time";

/** Carte d'activation (dashboard / liste). Données transmises en props. */
export function ActivationCard({ activation }: { activation: Activation }) {
  const isLive = activation.status === "waiting" || activation.status === "sms_received";
  const lastSms = activation.sms[activation.sms.length - 1];

  return (
    <Link
      href={`/activations/${activation.id}`}
      className="glass group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.16] hover:shadow-glow"
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold text-white"
        style={{ backgroundColor: activation.serviceTint + "26", color: activation.serviceTint }}
      >
        {activation.serviceName.slice(0, 2).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium text-white">{activation.serviceName}</p>
          <span className="text-xs text-slate-500">
            {activation.flag} {activation.countryName}
          </span>
        </div>
        <p className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          {isLive ? (
            <>
              expire dans{" "}
              <Countdown to={activation.expiresAt} className="text-[0.7rem] text-warning-300" />
            </>
          ) : lastSms?.code ? (
            <span className="inline-flex items-center gap-1.5">
              <MessageSquareText className="size-3 text-brand-300" />
              code <span className="font-mono text-brand-300">{lastSms.code}</span>
            </span>
          ) : (
            <ClientTime iso={activation.createdAt} />
          )}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <ActivationStatusBadge status={activation.status} />
        <span className="font-mono text-xs text-slate-400">{formatUSD(activation.priceCents)}</span>
      </div>

      <ChevronRight className="size-4 shrink-0 text-slate-600 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-slate-300" />
    </Link>
  );
}
