"use client";

import { Mail, User } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterForm() {
  const demoAction = useDemoAction();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Entrez votre nom (2 caractères minimum).";
    if (!EMAIL_RE.test(email)) next.email = "Entrez une adresse email valide.";
    if (password.length < 8) next.password = "8 caractères minimum.";
    if (!terms) next.terms = "Vous devez accepter les conditions d'utilisation.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      demoAction("L'inscription (avec vérification d'email)", "Phase 4");
    }, 700);
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-white">
        Créer votre compte
      </h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Gratuit et sans engagement — rechargez uniquement quand vous en avez besoin.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Nom complet" htmlFor="register-name" error={errors.name}>
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Alex Martin"
            icon={<User className="size-4" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!errors.name}
          />
        </Field>

        <Field label="Email" htmlFor="register-email" error={errors.email}>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            icon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
          />
        </Field>

        <Field label="Mot de passe" htmlFor="register-password" error={errors.password}>
          <PasswordInput
            id="register-password"
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
          />
          <div className="pt-2">
            <PasswordStrength password={password} />
          </div>
        </Field>

        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-400">
            <input
              type="checkbox"
              checked={terms}
              onChange={(e) => setTerms(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-white/20 bg-white/10 accent-brand-500"
            />
            <span>
              J'accepte les{" "}
              <Link href="/legal/cgu" className="text-brand-300 underline decoration-dotted underline-offset-2">
                conditions d'utilisation
              </Link>{" "}
              et la{" "}
              <Link href="/legal/confidentialite" className="text-brand-300 underline decoration-dotted underline-offset-2">
                politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-xs text-danger-300">{errors.terms}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Créer mon compte
        </Button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Déjà inscrit ?{" "}
        <Link href="/auth/login" className="font-medium text-accent-300 transition-colors hover:text-accent-200">
          Se connecter
        </Link>
      </p>
    </Card>
  );
}
