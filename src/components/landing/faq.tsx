"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MessageCircleQuestion } from "lucide-react";
import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/data/landing";
import { EASE, Reveal, staggerContainer, staggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function FaqItem({
  question,
  answer,
  open,
  onToggle,
  id,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
  id: string;
}) {
  return (
    <div
      className={cn(
        "glass overflow-hidden rounded-2xl transition-colors duration-300",
        open && "border-white/[0.16]"
      )}
    >
      <button
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        id={`${id}-button`}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-[0.95rem] font-medium tracking-tight text-white sm:text-base">
          {question}
        </span>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-transform duration-300",
            open && "rotate-180 border-brand-400/40 text-brand-300"
          )}
        >
          <ChevronDown className="size-4" />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-panel`}
            role="region"
            aria-labelledby={`${id}-button`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Les questions <span className="text-gradient">qu'on nous pose.</span>
                </>
              }
              lead="Tout ce qu'il faut savoir avant votre première activation. Réponses directes, sans jargon marketing."
            />
            <Reveal delay={0.2}>
              <div className="glass mt-10 rounded-2xl p-6">
                <span className="flex size-11 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300">
                  <MessageCircleQuestion className="size-5" />
                </span>
                <h3 className="mt-4 font-display font-semibold text-white">Une autre question ?</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">
                  Après création de votre compte, le support est accessible directement depuis votre
                  espace — avec l'historique de vos activations sous les yeux.
                </p>
                <Button href="/auth/register" variant="outline" size="sm" className="mt-4">
                  Créer un compte gratuitement
                </Button>
              </div>
            </Reveal>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-72px" }}
            className="space-y-3"
          >
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={item.question} variants={staggerItem}>
                <FaqItem
                  id={`faq-${i}`}
                  question={item.question}
                  answer={item.answer}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
