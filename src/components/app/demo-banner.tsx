import { FlaskConical, PlugZap } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/config";

/**
 * Bannière visible sur tout l'espace applicatif tant que les données
 * réelles ne sont pas toutes branchées. Garantit qu'aucune donnée
 * d'aperçu n'est prise pour une donnée réelle.
 *
 * - Supabase configuré : identité/wallet réels, données métier encore
 *   d'aperçu jusqu'au branchement VirtualSMS (Phase 5+).
 * - Sinon : mode démonstration complet.
 */
export function DemoBanner() {
  if (isSupabaseConfigured) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-accent-500/25 bg-accent-500/[0.07] px-4 py-2.5">
        <PlugZap className="size-4 shrink-0 text-accent-400" />
        <p className="text-xs leading-relaxed text-accent-200/90">
          <span className="font-semibold">Compte connecté</span>
          <span className="hidden sm:inline"> — </span>
          identité et wallet réels. Les données d'activations restent d'aperçu
          jusqu'au branchement VirtualSMS (Phase 5).
        </p>
      </div>
    );
  }

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
