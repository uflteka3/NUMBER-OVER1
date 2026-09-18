"use client";

import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { useDemoAction } from "@/components/app/demo-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/config";
import { updatePassword } from "@/server/auth/actions";

export function UpdatePasswordForm() {
  const demoAction = useDemoAction();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("8 caractères minimum.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setError(undefined);

    if (!isSupabaseConfigured) {
      demoAction("La définition du nouveau mot de passe", "Phase 4");
      return;
    }

    setLoading(true);
    const result = await updatePassword({ password });
    setLoading(false);
    if (result?.error) {
      setError("Impossible de modifier le mot de passe. Le lien a peut-être expiré — redemandez-en un.");
    }
    // succès → redirection gérée par l'action
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-white">
        Nouveau mot de passe
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Choisissez un mot de passe robuste — il protège votre wallet et vos activations.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Nouveau mot de passe" htmlFor="new-password" error={error}>
          <PasswordInput
            id="new-password"
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
          />
          <div className="pt-2">
            <PasswordStrength password={password} />
          </div>
        </Field>
        <Field label="Confirmation" htmlFor="confirm-password">
          <PasswordInput
            id="confirm-password"
            placeholder="Répétez le mot de passe"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Enregistrer le mot de passe
        </Button>
      </form>
    </Card>
  );
}
