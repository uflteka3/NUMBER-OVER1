"use client";

import { ArrowRight, RotateCcw, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ActivationVisual } from "./activation-visual";
import { fadeUp } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TRUST = [
  { icon: ShieldCheck, label: "SIM réelles — pas de VoIP" },
  { icon: Zap, label: "Réception en temps réel" },
  { icon: RotateCcw, label: "Remboursement automatique" },
  { icon: Sparkles, label: "Dès 0,05 $ par activation" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 sm:pt-40 lg:pb-28">
      {/* Fond : grille + halos */}
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-12rem] h-[28rem] w-[52rem] -translate-x-1/2 rounded-full bg-brand-600/[0.16] blur-[120px]" />
        <div className="absolute right-[-8rem] top-1/3 h-80 w-80 rounded-full bg-accent-500/[0.1] blur-[100px]" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.09 } } }}
        >
          <motion.div variants={fadeUp}>
            <Badge tone="brand" dot pulse className="px-3.5 py-1.5">
              Plateforme d'activations SMS · SIM réelles
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mt-6 font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight text-white sm:text-6xl"
          >
            Vos codes de vérification,
            <br />
            reçus <span className="text-gradient">en quelques secondes.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg"
          >
            NUMBER OVER vous fournit un numéro temporaire réel dans plus de 145 pays,
            pour plus de 2 500 services. Choisissez, activez, recevez votre code —
            en temps réel, sans abonnement.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/auth/register" size="lg">
              Créer un compte
              <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
            </Button>
            <Button href="#fonctionnement" variant="secondary" size="lg">
              Comment ça marche
            </Button>
          </motion.div>

          <motion.ul variants={fadeUp} className="mt-10 flex flex-wrap gap-x-5 gap-y-2.5">
            {TRUST.map((item) => (
              <li key={item.label} className="flex items-center gap-2 text-xs text-slate-400">
                <item.icon className="size-3.5 text-accent-400" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        <ActivationVisual />
      </div>
    </section>
  );
}
