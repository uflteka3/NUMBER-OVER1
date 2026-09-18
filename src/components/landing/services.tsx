"use client";

import { motion } from "framer-motion";
import { SERVICES, TOTAL_SERVICES_LABEL, type ServiceItem } from "@/lib/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";

function ServiceChip({ service, large = false }: { service: ServiceItem; large?: boolean }) {
  return (
    <span
      className={
        large
          ? "glass inline-flex shrink-0 items-center gap-2.5 rounded-full px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/[0.18]"
          : "glass inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm text-slate-300"
      }
    >
      <span
        className={large ? "size-2.5 rounded-full" : "size-2 rounded-full"}
        style={{ backgroundColor: service.tint }}
      />
      <span className={large ? "text-sm font-medium text-slate-100" : undefined}>
        {service.name}
      </span>
      {large && (
        <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate-500">
          {service.code}
        </span>
      )}
    </span>
  );
}

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const items = [...SERVICES, ...SERVICES];
  return (
    <div className="mask-fade-x overflow-hidden">
      <div
        className={`flex w-max gap-3 py-1.5 hover:[animation-play-state:paused] ${
          reverse ? "animate-marquee-reverse" : "animate-marquee"
        }`}
      >
        {items.map((service, i) => (
          <ServiceChip key={`${service.code}-${i}`} service={service} />
        ))}
      </div>
    </div>
  );
}

export function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10rem] top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-600/[0.1] blur-[110px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Catalogue"
          title={
            <>
              {TOTAL_SERVICES_LABEL} services <span className="text-gradient">pris en charge.</span>
            </>
          }
          lead="Messageries, réseaux sociaux, IA, paiements, marketplaces… Le catalogue live — prix et stock en temps réel — sera synchronisé directement depuis notre infrastructure."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-72px" }}
          className="mt-14 flex flex-wrap justify-center gap-2.5"
        >
          {SERVICES.map((service) => (
            <motion.span key={service.code} variants={staggerItem}>
              <ServiceChip service={service} large />
            </motion.span>
          ))}
          <motion.span variants={staggerItem}>
            <Badge tone="brand" className="px-4 py-2.5 text-sm">
              + {TOTAL_SERVICES_LABEL} autres
            </Badge>
          </motion.span>
        </motion.div>
      </div>

      <Reveal delay={0.1} className="mt-14 space-y-3">
        <MarqueeRow />
        <MarqueeRow reverse />
      </Reveal>

      <Reveal delay={0.15}>
        <p className="mx-auto mt-10 max-w-xl px-4 text-center text-xs leading-relaxed text-slate-500">
          Services cités : exemples publiés par notre fournisseur d'infrastructure. Chaque service
          affiché dans l'application montrera sa disponibilité et son prix réels, vérifiés au moment
          de l'achat.
        </p>
      </Reveal>
    </section>
  );
}
