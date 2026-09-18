"use client";

import { Coins, CreditCard, Globe2, ListChecks, MessageSquareText, ScanLine } from "lucide-react";
import { STEPS } from "@/lib/data/landing";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { motion } from "framer-motion";

const ICONS = [CreditCard, Globe2, ListChecks, Coins, MessageSquareText, ScanLine];

export function HowItWorks() {
  return (
    <section id="fonctionnement" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Fonctionnement"
          title={
            <>
              De la recharge au code, <span className="text-gradient">en 6 étapes.</span>
            </>
          }
          lead="Un parcours pensé pour aller vite : moins d'une minute entre votre première connexion et votre premier code reçu."
        />

        <motion.ol
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-72px" }}
          className="relative mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {/* ligne de liaison décorative (desktop) */}
          <div className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px bg-gradient-to-r from-transparent via-brand-500/25 to-transparent lg:block" />

          {STEPS.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <motion.li key={step.title} variants={staggerItem} className="relative">
                <div className="glass group h-full rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-glow">
                  <div className="flex items-center justify-between">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/25 to-accent-500/20 text-accent-300 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="size-5" />
                    </span>
                    <span className="font-mono text-sm font-semibold text-slate-600">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[1.05rem] font-semibold tracking-tight text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{step.description}</p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>

        <Reveal delay={0.15} className="mt-10 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-slate-500">
            Parcours réel, sans étape cachée
          </p>
        </Reveal>
      </div>
    </section>
  );
}
