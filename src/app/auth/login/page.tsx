import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/landing/placeholder-page";

export const metadata: Metadata = { title: "Connexion" };

export default function LoginPage() {
  return (
    <PlaceholderPage
      phase="Phase 3 — Authentification"
      title="Connexion à votre espace"
      description="L'authentification sécurisée (Supabase Auth : email, session, récupération de mot de passe) sera branchée en Phase 3. La structure de cette page et son design sont prêts."
    />
  );
}
