"use client";

import { ArrowLeft, Mail, MailCheck } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const demoAction = useDemoAction();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError("Entrez une adresse email valide.");
      return;
    }
    setError(undefined);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      demoAction("L'envoi réel de l'email de réinitialisation", "Phase 4");
    }, 700);
  }

  if (sent) {
    return (
      <Card className="p-6 text-center sm:p-8">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success-500/15 text-success-300">
          <MailCheck className="size-6" />
        </span>
        <h1 className="mt-5 font-display text-xl font-bold tracking-tight text-white">
          Email envoyé
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-400">
          Si un compte existe pour <span className="text-slate-200">{email}</span>, un lien de
          réinitialisation vient d'y être envoyé. Vérifiez aussi vos indésirables.
        </p>
        <Button href="/auth/login" variant="secondary" className="mt-6 w-full">
          <ArrowLeft className="size-4" /> Retour à la connexion
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-white">
        Mot de passe oublié
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Entrez votre email : nous vous envoyons un lien de réinitialisation sécurisé.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Email" htmlFor="forgot-email" error={error}>
          <Input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            icon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error}
          />
        </Field>
        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Envoyer le lien
        </Button>
      </form>

      <p className="mt-6 text-center">
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-300"
        >
          <ArrowLeft className="size-3.5" /> Retour à la connexion
        </Link>
      </p>
    </Card>
  );
}
