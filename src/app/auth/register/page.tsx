import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/landing/placeholder-page";

export const metadata: Metadata = { title: "Créer un compte" };

export default function RegisterPage() {
  return (
    <PlaceholderPage
      phase="Phase 3 — Authentification"
      title="Créer votre compte NUMBER OVER"
      description="L'inscription sécurisée (Supabase Auth, vérification d'email, protection des routes) sera branchée en Phase 3. La structure de cette page et son design sont prêts."
    />
  );
}
