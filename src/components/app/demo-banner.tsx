import { FlaskConical } from "lucide-react";

/**
 * Bannière visible sur tout l'espace applicatif tant que l'intégration
 * réelle (Supabase/VirtualSMS — Phases 4-5) n'est pas branchée.
 * Garantit qu'aucune donnée d'aperçu n'est prise pour une donnée réelle.
 */
export function DemoBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-warning-500/25 bg-warning-500/[0.07] px-4 py-2.5">
      <FlaskConical className="size-4 shrink-0 text-warning-400" />
      <p className="text-xs leading-relaxed text-warning-200/90">
        <span className="font-semibold">Mode démonstration</span>
        <span className="hidden sm:inline"> — </span>
        données d'aperçu pour valider l'interface. Les vraies données arrivent
        avec l'intégration backend (prochaines phases).
      </p>
    </div>
  );
}
