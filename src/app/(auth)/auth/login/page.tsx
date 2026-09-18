import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Connexion" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; reason?: string }>;
}) {
  const { next, reason } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : undefined;

  return (
    <div className="space-y-4">
      {reason === "lien_expire" && (
        <p
          role="alert"
          className="rounded-xl border border-warning-500/30 bg-warning-500/10 px-4 py-3 text-sm text-warning-500"
        >
          Ce lien a expiré ou a déjà été utilisé. Connectez-vous ou redemandez un lien.
        </p>
      )}
      <LoginForm next={nextPath} />
    </div>
  );
}
