"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export interface AuthResult {
  error?: string;
  confirmationRequired?: boolean;
  url?: string;
}

async function getOrigin(): Promise<string> {
  const h = await headers();
  return h.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export async function signInWithPassword(input: {
  email: string;
  password: string;
  next?: string;
}): Promise<AuthResult | undefined> {
  if (!isSupabaseConfigured) return { error: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error) return { error: "invalid_credentials" };

  const dest = input.next?.startsWith("/") ? input.next : "/dashboard";
  redirect(dest);
}

export async function signUp(input: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResult | undefined> {
  if (!isSupabaseConfigured) return { error: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { display_name: input.name },
      emailRedirectTo: `${await getOrigin()}/auth/callback`,
    },
  });

  if (error) return { error: "signup_failed" };
  // Session immédiate si la confirmation d'email est désactivée côté projet
  if (data.session) redirect("/dashboard");
  return { confirmationRequired: true };
}

export async function signInWithOAuth(
  provider: "google"
): Promise<AuthResult | undefined> {
  if (!isSupabaseConfigured) return { error: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo: `${await getOrigin()}/auth/callback` },
  });

  if (error || !data.url) return { error: "oauth_failed" };
  return { url: data.url };
}

export async function requestPasswordReset(input: {
  email: string;
}): Promise<AuthResult> {
  if (!isSupabaseConfigured) return { error: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.resetPasswordForEmail(input.email, {
    redirectTo: `${await getOrigin()}/auth/callback?type=recovery`,
  });

  // Ne jamais révéler si le compte existe : succès silencieux de toute façon.
  if (error) return {};
  return {};
}

export async function updatePassword(input: {
  password: string;
}): Promise<AuthResult | undefined> {
  if (!isSupabaseConfigured) return { error: "not_configured" };

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: input.password });
  if (error) return { error: "update_failed" };
  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  if (isSupabaseConfigured) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}
