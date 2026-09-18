import Link from "next/link";
import { ArrowLeft, Construction } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Page placeholder stylée — utilisée pour les routes dont le contenu
 * complet arrive dans une phase ultérieure (auth en Phase 3, etc.).
 * Évite toute 404 pendant la validation de la Phase 2.
 */
export function PlaceholderPage({
  phase,
  title,
  description,
}: {
  phase: string;
  title: string;
  description: string;
}) {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 -z-10">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,black,transparent)]" />
        <div className="absolute left-1/2 top-1/3 h-72 w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/[0.14] blur-[110px]" />
      </div>

      <Link href="/" aria-label="Retour à l'accueil" className="mb-10">
        <Logo />
      </Link>

      <div className="glass-strong w-full max-w-md rounded-3xl p-8 text-center shadow-glow">
        <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-300">
          <Construction className="size-5" />
        </span>
        <Badge tone="brand" className="mt-5">
          {phase}
        </Badge>
        <h1 className="mt-4 font-display text-2xl font-semibold tracking-tight text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">{description}</p>
        <Button href="/" variant="secondary" className="mt-7 w-full">
          <ArrowLeft className="size-4" />
          Retour à l'accueil
        </Button>
      </div>
    </main>
  );
}
