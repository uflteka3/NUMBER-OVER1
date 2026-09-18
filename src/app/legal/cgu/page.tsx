import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/landing/placeholder-page";

export const metadata: Metadata = { title: "Conditions d'utilisation" };

export default function CguPage() {
  return (
    <PlaceholderPage
      phase="Avant mise en production"
      title="Conditions Générales d'Utilisation"
      description="Le texte juridique définitif (conditions d'usage, règles anti-abus, remboursements, conformité avec les CGU des services tiers) sera rédigé et relu avant le déploiement en production."
    />
  );
}
