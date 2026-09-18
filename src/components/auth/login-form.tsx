"use client";

import { Mail } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { PasswordInput } from "@/components/auth/password-input";
import { useDemoAction } from "@/components/app/demo-action";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const demoAction = useDemoAction();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Entrez une adresse email valide.";
    if (password.length < 8) next.password = "8 caractères minimum.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      demoAction("La connexion (email + mot de passe, session sécurisée)", "Phase 4");
    }, 700);
  }

  return (
    <Card className="p-6 sm:p-8">
      <h1 className="font-display text-2xl font-bold tracking-tight text-white">Connexion</h1>
      <p className="mt-1.5 text-sm text-slate-400">
        Heureux de vous revoir. Accédez à vos activations.
      </p>

      <form onSubmit={submit} noValidate className="mt-7 space-y-5">
        <Field label="Email" htmlFor="login-email" error={errors.email}>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="vous@exemple.com"
            icon={<Mail className="size-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
          />
        </Field>

        <Field label="Mot de passe" htmlFor="login-password" error={errors.password}>
          <PasswordInput
            id="login-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
          />
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-400">
            <input
              type="checkbox"
              defaultChecked
              className="size-4 rounded border-white/20 bg-white/10 accent-brand-500"
            />
            Rester connecté
          </label>
          <Link
            href="/auth/forgot-password"
            className="font-medium text-brand-300 transition-colors hover:text-brand-200"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Se connecter
        </Button>
      </form>

      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-xs text-slate-600">
          <span className="h-px flex-1 bg-white/[0.07]" />
          ou
          <span className="h-px flex-1 bg-white/[0.07]" />
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => demoAction("La connexion OAuth (Google…)", "Phase 4")}
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
            <path fill="#EA4335" d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.25 9.14 5.04 12 5.04z"/>
            <path fill="#4285F4" d="M23.5 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.66 2.84c2.17-2 3.77-4.94 3.77-8.66z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L2.18 7.07C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#34A853" d="M12 23c3.03 0 5.56-1 7.41-2.69l-3.66-2.84c-1 .68-2.28 1.08-3.75 1.08-2.86 0-5.29-2.21-6.16-4.87l-3.66 2.84C3.99 20.53 7.7 23 12 23z"/>
          </svg>
          Continuer avec Google
        </Button>
      </div>

      <p className="mt-7 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/auth/register" className="font-medium text-accent-300 transition-colors hover:text-accent-200">
          Créer un compte
        </Link>
      </p>
      <p className="mt-3 text-center">
        <Link href="/dashboard" className="text-xs text-slate-500 underline decoration-dotted underline-offset-4 transition-colors hover:text-slate-300">
          ou explorer la démo sans compte →
        </Link>
      </p>
    </Card>
  );
}
