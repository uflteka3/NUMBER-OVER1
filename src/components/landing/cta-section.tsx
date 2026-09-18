import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] px-6 py-16 text-center sm:px-12">
            {/* fond dégradé */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_80%_at_50%_-10%,rgba(111,108,255,0.28),transparent),radial-gradient(ellipse_50%_60%_at_80%_110%,rgba(6,182,212,0.18),transparent)]" />
            <div className="bg-grid absolute inset-0 -z-10 opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]" />

            <p className="font-mono text-xs uppercase tracking-[0.22em] text-brand-300">
              Prêt en moins d'une minute
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Votre prochain code de vérification vous attend.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Créez votre compte, rechargez votre wallet, et recevez votre premier SMS
              de vérification en temps réel. Sans abonnement, sans engagement.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button href="/auth/register" size="lg">
                Créer un compte
                <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </Button>
              <Button href="#fonctionnement" variant="ghost" size="lg">
                Revoir le parcours
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
