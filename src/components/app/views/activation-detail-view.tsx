"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  Ban,
  Check,
  ChevronRight,
  MessageSquareText,
  RefreshCcw,
  ShieldCheck,
  Smartphone,
  Timer,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ClientTime } from "@/components/app/client-time";
import { ActivationStatusBadge } from "@/components/app/status-badge";
import { EASE } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Countdown } from "@/components/ui/countdown";
import { Modal } from "@/components/ui/modal";
import { useToast } from "@/components/ui/toast";
import type { Activation, ActivationStatus, SmsMessage } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Écran d'activation temps réel.
 * act-live : SIMULATION du cycle complet (aucun numéro réel n'est loué).
 * Les autres : état figé issu des données d'aperçu.
 */

type DemoState = ActivationStatus;

const STATE_HELPERS: Record<DemoState, { title: string; helper: string }> = {
  waiting: { title: "En attente du SMS…", helper: "Envoyez le SMS de vérification à ce numéro. Dès réception, le code s'affiche ici en temps réel." },
  sms_received: { title: "SMS reçu !", helper: "Le code a été détecté automatiquement. Copiez-le dans l'application concernée." },
  completed: { title: "Activation terminée", helper: "Le code a été utilisé avec succès. Cette activation est clôturée." },
  expired: { title: "Activation expirée", helper: "Aucun SMS reçu dans la fenêtre. Le remboursement automatique est déclenché." },
  cancelled: { title: "Activation annulée", helper: "Vous avez annulé cette activation. Le montant a été recrédité sur votre wallet." },
  refunded: { title: "Activation remboursée", helper: "Le montant de cette activation a été intégralement recrédité sur votre wallet." },
};

export function ActivationDetailView({ activation }: { activation: Activation }) {
  const toast = useToast();
  const isSimulatable = activation.id === "act-live";
  const [liveStatus, setLiveStatus] = useState<DemoState | null>(null);
  const [smsList, setSmsList] = useState<SmsMessage[]>(activation.sms);
  const [extraEvents, setExtraEvents] = useState<Array<{ id: string; label: string; at: string }>>([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const [working, setWorking] = useState(false);
  const [uiStateOverride, setUiStateOverride] = useState<DemoState | null>(null);

  // Simulation temps réel (mode démo, act-live uniquement)
  useEffect(() => {
    if (!isSimulatable) return;
    const t1 = setTimeout(() => {
      setLiveStatus("sms_received");
      setSmsList([
        {
          id: "sms-sim",
          sender: "Telegram",
          content: "Your Telegram code: 847291",
          code: "847291",
          receivedAt: new Date().toISOString(),
        },
      ]);
      setExtraEvents((p) => [...p, { id: "ev-sim-1", label: "SMS reçu — code détecté", at: new Date().toISOString() }]);
      toast.push({ tone: "success", title: "SMS reçu (simulation)", description: "Code détecté : 847 291" });
    }, 8000);
    const t2 = setTimeout(() => {
      setLiveStatus("completed");
      setExtraEvents((p) => [...p, { id: "ev-sim-2", label: "Activation terminée", at: new Date().toISOString() }]);
    }, 15000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isSimulatable, toast]);

  const status: DemoState = uiStateOverride ?? liveStatus ?? activation.status;
  const helper = STATE_HELPERS[status];
  const lastSms = smsList[smsList.length - 1];
  const isLive = status === "waiting" || status === "sms_received";

  const timeline = useMemo(
    () =>
      [...activation.events.map((e) => ({ id: e.id, label: e.label, at: e.at })), ...extraEvents].sort(
        (a, b) => new Date(a.at).getTime() - new Date(b.at).getTime()
      ),
    [activation.events, extraEvents]
  );

  function doCancel() {
    setWorking(true);
    setTimeout(() => {
      setWorking(false);
      setCancelModal(false);
      setLiveStatus("cancelled");
      setExtraEvents((p) => [...p, { id: "ev-cancel", label: "Annulée par l'utilisateur — remboursée", at: new Date().toISOString() }]);
      toast.push({ tone: "info", title: "Activation annulée (simulation)", description: `${formatUSD(activation.priceCents)} recrédités — démo.` });
    }, 800);
  }

  function doSwap() {
    setWorking(true);
    setTimeout(() => {
      setWorking(false);
      setSwapModal(false);
      setExtraEvents((p) => [...p, { id: "ev-swap", label: "Numéro remplacé (swap) : +44 7700 900456", at: new Date().toISOString() }]);
      toast.push({ tone: "success", title: "Numéro remplacé (simulation)", description: "Ancien numéro libéré, l'activation continue." });
    }, 800);
  }

  return (
    <>
      {/* Fil d'ariane */}
      <Link
        href="/activations"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" />
        Mes activations
        <ChevronRight className="size-3.5" />
        <span className="text-slate-200">{activation.serviceName} · {activation.flag}</span>
      </Link>

      <div className="grid gap-5 lg:grid-cols-[1.35fr_1fr]">
        {/* Colonne principale */}
        <div className="space-y-5">
          {/* Statut */}
          <motion.section
            layout
            className={cn(
              "glass relative overflow-hidden rounded-3xl p-6",
              status === "completed" && "border-success-500/25",
              status === "sms_received" && "border-brand-500/30 shadow-glow"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/60 to-transparent" />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <span
                  className="flex size-12 items-center justify-center rounded-2xl font-display text-sm font-bold"
                  style={{ backgroundColor: activation.serviceTint + "26", color: activation.serviceTint }}
                >
                  {activation.serviceName.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <h1 className="font-display text-lg font-semibold text-white">
                    {activation.serviceName}
                    <span className="ml-2 text-sm font-normal text-slate-400">
                      {activation.flag} {activation.countryName}
                    </span>
                  </h1>
                  <p className="mt-1"><ActivationStatusBadge status={status} /></p>
                </div>
              </div>
              {isLive && (
                <div className="flex items-center gap-2 rounded-full border border-warning-500/25 bg-warning-500/[0.08] px-3.5 py-2">
                  <Timer className="size-3.5 text-warning-300" />
                  <span className="text-xs text-slate-400">expire dans</span>
                  <Countdown to={activation.expiresAt} className="text-sm text-warning-200" />
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="mt-5"
              >
                {status === "waiting" && (
                  <div className="flex items-center gap-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4">
                    <span className="relative flex size-11 shrink-0 items-center justify-center">
                      <span className="absolute size-11 animate-pulse-ring rounded-full bg-accent-400/40" />
                      <MessageSquareText className="relative size-5 text-accent-300" />
                    </span>
                    <div>
                      <p className="font-medium text-white">{helper.title}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{helper.helper}</p>
                    </div>
                  </div>
                )}

                {status === "sms_received" && lastSms && (
                  <div className="rounded-2xl border border-brand-500/25 bg-brand-500/[0.07] p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-400">
                        {lastSms.sender} <span className="text-slate-600">· <ClientTime iso={lastSms.receivedAt} /></span>
                      </p>
                      <span className="size-1.5 rounded-full bg-success-400" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-200">{lastSms.content}</p>
                    {lastSms.code && (
                      <div className="mt-3.5 flex flex-wrap items-center gap-2.5">
                        <span className="inline-flex items-center rounded-xl bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))] px-4 py-2 font-mono text-lg font-bold tracking-[0.28em] text-white">
                          {lastSms.code}
                        </span>
                        <CopyButton value={lastSms.code} toastMessage="Code copié" className="px-3 py-2">
                          Copier le code
                        </CopyButton>
                      </div>
                    )}
                  </div>
                )}

                {status === "completed" && (
                  <div className="flex items-center gap-4 rounded-2xl border border-success-500/25 bg-success-500/[0.06] p-4">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-success-500/20"
                    >
                      <Check className="size-5 text-success-300" strokeWidth={3} />
                    </motion.span>
                    <div>
                      <p className="font-medium text-success-300">{helper.title}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{helper.helper}</p>
                    </div>
                  </div>
                )}

                {(status === "expired" || status === "cancelled" || status === "refunded") && (
                  <div className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/[0.06]">
                      {status === "expired" ? (
                        <Timer className="size-5 text-slate-400" />
                      ) : status === "cancelled" ? (
                        <Ban className="size-5 text-danger-400" />
                      ) : (
                        <RefreshCcw className="size-5 text-accent-300" />
                      )}
                    </span>
                    <div>
                      <p className="font-medium text-white">{helper.title}</p>
                      <p className="mt-0.5 text-sm text-slate-400">{helper.helper}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.section>

          {/* Numéro */}
          <section className="glass rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                <Smartphone className="size-4" /> Numéro attribué
              </p>
              {activation.orderId && (
                <span className="font-mono text-[0.65rem] text-slate-600">
                  ref {activation.orderId.slice(0, 8)}…
                </span>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <p className="font-mono text-[1.65rem] font-semibold tracking-wide text-white sm:text-3xl">
                {activation.phoneNumber ?? "—"}
              </p>
              {activation.phoneNumber && (
                <CopyButton value={activation.phoneNumber} toastMessage="Numéro copié" />
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              SIM physique · utilisation unique pour {activation.serviceName}. Ne partagez ce numéro
              que dans le champ de vérification du service concerné.
            </p>
          </section>

          {/* SMS reçus */}
          <section className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              <MessageSquareText className="size-4" /> SMS reçus ({smsList.length})
            </h2>
            {smsList.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-white/[0.09] px-4 py-6 text-center text-sm text-slate-500">
                Aucun SMS pour le moment — les messages apparaissent ici en temps réel.
              </p>
            ) : (
              <ul className="mt-4 space-y-3">
                {smsList.map((sms) => (
                  <li key={sms.id} className="rounded-xl border border-white/[0.06] bg-night-900/60 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-slate-400">{sms.sender}</p>
                      <ClientTime iso={sms.receivedAt} className="text-[0.65rem] text-slate-600" />
                    </div>
                    <p className="mt-1.5 text-sm text-slate-200">{sms.content}</p>
                    {sms.code && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <Badge tone="brand" className="font-mono">code {sms.code}</Badge>
                        <CopyButton value={sms.code} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Colonne latérale */}
        <div className="space-y-5">
          {/* Actions */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Actions</h2>
            <div className="mt-4 space-y-2.5">
              <Button
                variant="secondary"
                className="w-full"
                disabled={!isLive}
                onClick={() => setSwapModal(true)}
              >
                <RefreshCcw className="size-4" /> Remplacer le numéro
              </Button>
              <Button
                variant="danger"
                className="w-full"
                disabled={status !== "waiting"}
                onClick={() => setCancelModal(true)}
              >
                <X className="size-4" /> Annuler et être remboursé
              </Button>

              {status === "waiting" && (
                <div className="flex items-start gap-2 rounded-xl bg-white/[0.03] p-3">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-warning-400" />
                  <p className="text-[0.7rem] leading-relaxed text-slate-500">
                    Règle opérateur : annulation/swap possibles dans{" "}
                    <Countdown to={activation.cancelAvailableAt} className="text-[0.7rem] text-warning-300" />{" "}
                    (hold de 2 min). Après cette période, le bouton devient actif.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Prix payé</span>
                <span className="font-mono text-white">{formatUSD(activation.priceCents)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Ouverture</span>
                <ClientTime iso={activation.createdAt} mode="datetime" className="text-slate-300" />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Expiration</span>
                <ClientTime iso={activation.expiresAt} mode="datetime" className="text-slate-300" />
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Événements
            </h2>
            <ol className="mt-4 space-y-0">
              {timeline.map((event, i) => (
                <li key={event.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < timeline.length - 1 && (
                    <span className="absolute left-[5px] top-4 h-full w-px bg-white/[0.08]" />
                  )}
                  <span
                    className={cn(
                      "mt-1.5 size-[11px] shrink-0 rounded-full border-2",
                      i === timeline.length - 1
                        ? "border-accent-400 bg-accent-400/30"
                        : "border-slate-600 bg-night-800"
                    )}
                  />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-200">{event.label}</p>
                    <ClientTime iso={event.at} className="text-[0.65rem] text-slate-600" />
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-success-400" />
              <p className="text-[0.7rem] leading-relaxed text-slate-500">
                Chaque événement est tracé côté serveur (webhooks vérifiés HMAC + réconciliation),
                jamais modifiable par le navigateur.
              </p>
            </div>
          </section>

          {/* Vérification des états UI (outil de dev — Phase 3) */}
          <section className="rounded-2xl border border-dashed border-warning-500/25 bg-warning-500/[0.04] p-4">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-warning-400/90">
              Vérifier tous les états (démo)
            </p>
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {(Object.keys(STATE_HELPERS) as DemoState[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setUiStateOverride(uiStateOverride === s ? null : s)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[0.65rem] font-medium transition-colors",
                    uiStateOverride === s
                      ? "bg-warning-500/25 text-warning-200"
                      : "bg-white/[0.05] text-slate-400 hover:text-white"
                  )}
                >
                  {STATE_HELPERS[s].title.replace("…", "")}
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Modales */}
      <Modal
        open={cancelModal}
        onClose={() => !working && setCancelModal(false)}
        title="Annuler cette activation ?"
        description="Le numéro sera libéré immédiatement et le montant recrédité sur votre wallet."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCancelModal(false)} disabled={working}>Retour</Button>
            <Button variant="danger" onClick={doCancel} loading={working}>Confirmer l'annulation</Button>
          </>
        }
      >
        <div className="glass rounded-xl p-4 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Remboursement</span>
            <span className="font-mono text-success-300">+{formatUSD(activation.priceCents)}</span>
          </div>
        </div>
      </Modal>

      <Modal
        open={swapModal}
        onClose={() => !working && setSwapModal(false)}
        title="Remplacer le numéro ?"
        description="Un nouveau numéro vous est attribué pour le même service. L'ancien est libéré — sans surcoût."
        footer={
          <>
            <Button variant="ghost" onClick={() => setSwapModal(false)} disabled={working}>Retour</Button>
            <Button onClick={doSwap} loading={working}>Remplacer</Button>
          </>
        }
      >
        <p className="text-xs leading-relaxed text-slate-400">
          Utile si le numéro actuel est rejeté par {activation.serviceName} ou ne reçoit rien.
          Le prix et la fenêtre d'activation restent inchangés.
        </p>
      </Modal>
    </>
  );
}
