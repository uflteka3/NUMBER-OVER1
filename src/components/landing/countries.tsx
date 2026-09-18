"use client";

import { motion } from "framer-motion";
import { COUNTRIES, TOTAL_COUNTRIES_LABEL } from "@/lib/data/landing";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, staggerContainer, staggerItem } from "@/components/motion/reveal";
import { Globe2, Signal } from "lucide-react";

export function Countries() {
  return (
    <section id="pays" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="Couverture"
              title={
                <>
                  Des numéros dans <span className="text-gradient">{TOTAL_COUNTRIES_LABEL} pays.</span>
                </>
              }
              lead="Europe, Amériques, Asie, Afrique, Océanie : choisissez le pays le plus pertinent pour votre activation. La disponibilité exacte est vérifiée en temps réel avant chaque achat."
            />
            <Reveal delay={0.2}>
              <ul className="mt-8 space-y-3">
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                    <Globe2 className="size-4" />
                  </span>
                  Sélection par drapeau, recherche instantanée dans l'application
                </li>
                <li className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                    <Signal className="size-4" />
                  </span>
                  Stock et prix synchronisés en continu depuis le réseau d'opérateurs
                </li>
              </ul>
            </Reveal>
          </div>

          <motion.ul
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-72px" }}
            className="grid grid-cols-2 gap-3 sm:grid-cols-3"
          >
            {COUNTRIES.map((country) => (
              <motion.li
                key={country.iso}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                className="glass group flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors duration-200 hover:border-white/[0.18]"
              >
                <span className="text-2xl" aria-hidden="true">
                  {country.flag}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-slate-100">
                    {country.name}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-slate-500">
                    {country.iso}
                  </span>
                </span>
              </motion.li>
            ))}
            <motion.li
              variants={staggerItem}
              className="col-span-2 flex items-center justify-center gap-2 rounded-2xl border border-dashed border-brand-500/30 bg-brand-500/[0.06] px-4 py-3.5 sm:col-span-3"
            >
              <span className="font-display text-sm font-semibold text-brand-200">
                + {TOTAL_COUNTRIES_LABEL} pays au total
              </span>
              <span className="text-xs text-slate-500">— liste complète dans l'application</span>
            </motion.li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
}
