import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/landing/placeholder-page";

export const metadata: Metadata = { title: "Politique de confidentialité" };

export default function ConfidentialitePage() {
  return (
    <PlaceholderPage
      phase="Avant mise en production"
      title="Politique de confidentialité"
      description="Le texte définitif (données collectées, finalités, durées de conservation, droits RGPD) sera rédigé et relu avant le déploiement en production."
    />
  );
}
