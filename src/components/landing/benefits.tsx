"use client";

import { motion } from "framer-motion";
import { Globe2, Lock, RotateCcw, ShieldCheck, Wallet, Zap } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { staggerContainer, staggerItem } from "@/components/motion/reveal";

const BENEFITS = [
  {
    icon: ShieldCheck,
    title: "SIM réelles, pas de VoIP",
    description:
      "Par défaut, les numéros proviennent de cartes SIM physiques sur les grands opérateurs — le meilleur taux d'acceptation possible.",
    tint: "from-success-500/20 to-success-500/5 text-success-300",
  },
  {
    icon: Globe2,
    title: "Couverture mondiale",
    description:
      "145+ pays et plus de 2 500 services, synchronisés en continu sur le réseau d'opérateurs partenaires.",
    tint: "from-brand-500/20 to-brand-500/5 text-brand-300",
  },
  {
    icon: Zap,
    title: "Réception temps réel",
    description:
      "Le SMS s'affiche instantanément dès son arrivée — statut, code et notification, sans rafraîchir la page.",
    tint: "from-accent-500/20 to-accent-500/5 text-accent-300",
  },
  {
    icon: RotateCcw,
    title: "Remboursement automatique",
    description:
      "Aucun SMS reçu ? La commande expire et vous êtes recrédité intégralement, sans avoir à rien réclamer.",
    tint: "from-warning-500/20 to-warning-500/5 text-warning-300",
  },
  {
    icon: Wallet,
    title: "Paiement à l'usage",
    description:
      "Pas d'abonnement. Rechargez votre wallet et ne payez que vos activations, dès 0,05 $ pièce.",
    tint: "from-brand-500/20 to-accent-500/10 text-brand-200",
  },
  {
    icon: Lock,
    title: "Sécurité by design",
    description:
      "Prix recalculés côté serveur, clés jamais exposées au navigateur, historique complet de chaque opération.",
    tint: "from-danger-500/20 to-danger-500/5 text-danger-300",
  },
];

export function Benefits() {
  return (
    <section id="avantages" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute right-[-6rem] top-24 h-72 w-72 rounded-full bg-accent-500/[0.08] blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Avantages"
          title={
            <>
              Conçu pour la fiabilité, <span className="text-gradient">pas pour les promesses.</span>
            </>
          }
          lead="Chaque avantage listé ici correspond à un mécanisme réel de la plateforme ou de son infrastructure — rien d'autre."
        />

        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-72px" }}
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {BENEFITS.map((benefit) => (
            <motion.li
              key={benefit.title}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-colors duration-300 hover:border-white/[0.16]"
            >
              <div className="absolute -right-8 -top-8 size-24 rounded-full bg-white/[0.02] transition-transform duration-500 group-hover:scale-[1.8]" />
              <span
                className={`relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.tint}`}
              >
                <benefit.icon className="size-5" />
              </span>
              <h3 className="relative mt-5 font-display text-lg font-semibold tracking-tight text-white">
                {benefit.title}
              </h3>
              <p className="relative mt-2 text-sm leading-relaxed text-slate-400">
                {benefit.description}
              </p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
