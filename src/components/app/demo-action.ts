"use client";

import { useToast } from "@/components/ui/toast";

/**
 * Helper d'actions indisponibles en mode démo : affiche un toast
 * expliquant clairement dans quelle phase la fonctionnalité réelle arrive.
 */
export function useDemoAction() {
  const toast = useToast();
  return (feature: string, phase: string) =>
    toast.push({
      tone: "info",
      title: "Mode démonstration",
      description: `${feature} sera fonctionnel(le) avec l'intégration réelle (${phase}).`,
    });
}
