import Link from "next/link";
import { RotateCcw, ShieldCheck, Zap } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";

const POINTS = [
  { icon: ShieldCheck, text: "SIM réelles sur les grands opérateurs — pas de VoIP" },
  { icon: Zap, text: "Codes reçus en temps réel, sans rafraîchir la page" },
  { icon: RotateCcw, text: "Remboursement automatique si aucun SMS n'arrive" },
];

/** Layout des pages d'authentification : panneau de marque + formulaire. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Panneau de marque (desktop) */}
      <div className="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]" />
          <div className="absolute left-[-6rem] top-1/4 h-96 w-96 rounded-full bg-brand-600/[0.18] blur-[120px]" />
          <div className="absolute bottom-[-4rem] right-[6rem] h-72 w-72 rounded-full bg-accent-500/[0.12] blur-[100px]" />
        </div>

        <Link href="/" aria-label="NUMBER OVER — accueil">
          <Logo />
        </Link>

        <div>
          <h1 className="max-w-md font-display text-4xl font-bold leading-tight tracking-tight text-white">
            Vos codes de vérification, <span className="text-gradient">en quelques secondes.</span>
          </h1>
          <ul className="mt-10 space-y-4">
            {POINTS.map((p) => (
              <li key={p.text} className="flex items-center gap-3.5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-accent-300 ring-1 ring-white/[0.08]">
                  <p.icon className="size-4.5" />
                </span>
                <span className="text-sm text-slate-300">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-600">
          145+ pays · 2 500+ services · sans abonnement
        </p>
      </div>

      {/* Zone formulaire */}
      <div className="relative flex flex-col items-center justify-center px-4 py-10 sm:px-8">
        <div className="absolute inset-0 -z-10 lg:hidden">
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black,transparent)]" />
        </div>
        <Link href="/" aria-label="NUMBER OVER — accueil" className="mb-8 lg:hidden">
          <Logo />
        </Link>
        <div className="w-full max-w-md">
          <Badge tone="warning" className="mb-5">
            Phase 3 — interface prête, Supabase Auth branché en Phase 4
          </Badge>
          {children}
        </div>
      </div>
    </div>
  );
}
