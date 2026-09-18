"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Copy, MessageSquareText, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { EASE } from "@/components/motion/reveal";
import { NumberScramble } from "./number-scramble";
import { Badge } from "@/components/ui/badge";
import { Dots } from "@/components/ui/loader";
import { cn } from "@/lib/utils";

/**
 * Animation signature du hero : le cycle complet d'une activation.
 * Contenu purement illustratif (exemples tirés de la documentation
 * publique VirtualSMS) — ce n'est pas une donnée réelle d'activation.
 */

const STEP_LABELS = ["Numéro attribué", "En attente du SMS", "SMS reçu", "Terminé"] as const;
const STEP_TONES = ["accent", "warning", "brand", "success"] as const;
const STAGE_DURATIONS = [2000, 2800, 3600, 2600];

export function ActivationVisual() {
  const reduced = useReducedMotion();
  const [stage, setStage] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const schedule = (current: number) => {
      timer = setTimeout(() => {
        if (cancelled) return;
        if (current < STAGE_DURATIONS.length - 1) {
          setStage(current + 1);
          schedule(current + 1);
        } else {
          setStage(0);
          setCycle((c) => c + 1);
        }
      }, STAGE_DURATIONS[current]);
    };
    schedule(stage === 0 ? 0 : stage);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle, reduced]);

  const effectiveStage = reduced ? 3 : stage;

  return (
    <div className="relative mx-auto w-full max-w-md select-none" aria-hidden="true">
      {/* Anneaux + halo décoratifs */}
      <div className="absolute -inset-10 -z-10">
        <div className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/20 blur-[90px]" />
        <div className="absolute right-0 top-6 size-40 rounded-full bg-accent-500/15 blur-[70px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 32, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
        className="glass-strong relative overflow-hidden rounded-3xl p-5 shadow-glow sm:p-6"
      >
        {/* ligne d'accent supérieure */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/70 to-transparent" />

        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge tone="accent" dot pulse>
              Activation en direct
            </Badge>
          </div>
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
            demo
          </span>
        </div>

        {/* Sélection service + pays */}
        <div className="mt-5 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-200">
            <span className="size-2 rounded-full bg-[#229ED9]" />
            Telegram
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-medium text-slate-200">
            🇬🇧 Royaume-Uni
          </span>
        </div>

        {/* Numéro */}
        <div className="mt-4 rounded-2xl border border-white/[0.07] bg-night-900/60 p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-slate-500">
              <Smartphone className="size-3.5" /> Votre numéro
            </p>
            <Copy className="size-3.5 text-slate-600" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tracking-wide text-white sm:text-[1.7rem]">
            <NumberScramble key={cycle} value="+44 7700 900123" />
          </p>
        </div>

        {/* Zone d'état */}
        <div className="mt-4 min-h-[7.5rem]">
          <AnimatePresence mode="wait">
            {effectiveStage <= 1 && (
              <motion.div
                key={`wait-${cycle}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-[7.5rem] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]"
              >
                <span className="relative flex size-10 items-center justify-center">
                  <span className="absolute size-10 animate-pulse-ring rounded-full bg-accent-400/40" />
                  <MessageSquareText className="relative size-5 text-accent-300" />
                </span>
                <p className="flex items-center gap-2 font-mono text-xs text-slate-400">
                  En attente du SMS <Dots />
                </p>
              </motion.div>
            )}

            {effectiveStage === 2 && (
              <motion.div
                key={`sms-${cycle}`}
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="rounded-2xl border border-brand-500/25 bg-brand-500/[0.07] p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-slate-400">
                    Telegram <span className="text-slate-600">· à l'instant</span>
                  </p>
                  <span className="size-1.5 rounded-full bg-success-400" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-200">
                  Your Telegram code:{" "}
                  <span className="font-mono font-semibold text-white">847291</span>
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))] px-3 py-1.5 font-mono text-sm font-bold tracking-[0.3em] text-white">
                    847291
                  </span>
                  <span className="glass inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[0.7rem] text-slate-300">
                    <Copy className="size-3" /> copier
                  </span>
                </div>
              </motion.div>
            )}

            {effectiveStage === 3 && (
              <motion.div
                key={`done-${cycle}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex h-[7.5rem] flex-col items-center justify-center gap-2.5 rounded-2xl border border-success-500/25 bg-success-500/[0.06]"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
                  className="flex size-10 items-center justify-center rounded-full bg-success-500/20"
                >
                  <Check className="size-5 text-success-300" strokeWidth={3} />
                </motion.span>
                <p className="text-sm font-medium text-success-300">
                  Activation terminée <span className="text-slate-500">· code copié</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pied : progression */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex flex-1 gap-1">
            {STEP_LABELS.map((label, i) => (
              <span
                key={label}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors duration-500",
                  i <= effectiveStage ? "bg-gradient-to-r from-brand-400 to-accent-400" : "bg-white/[0.08]"
                )}
              />
            ))}
          </div>
          <Badge tone={STEP_TONES[effectiveStage]} className="shrink-0 font-mono text-[0.65rem]">
            {STEP_LABELS[effectiveStage]}
          </Badge>
        </div>
      </motion.div>

      {/* Chips flottantes */}
      {!reduced && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="glass absolute -left-4 top-10 hidden animate-float rounded-xl px-3 py-2 font-mono text-xs text-accent-200 sm:block"
          >
            OTP · 847291
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="glass absolute -right-3 bottom-16 hidden animate-float-delayed rounded-xl px-3 py-2 font-mono text-xs text-brand-200 sm:block"
          >
            +44 SIM ✓
          </motion.div>
        </>
      )}
    </div>
  );
}
