import "server-only";

import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseServerClient } from "@/server/db/supabase-server";

export interface CurrentUserDisplay {
  name: string;
  email: string;
  balanceCents: number;
  role: string;
}

/**
 * Lit l'utilisateur courant + profil + solde wallet (lectures RLS, rôle
 * utilisateur). Retourne null si non connecté ou mode démo.
 */
export async function getCurrentUserDisplay(): Promise<CurrentUserDisplay | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const [{ data: profile }, { data: wallet }] = await Promise.all([
      supabase
        .from("profiles")
        .select("display_name, role_id, status")
        .eq("id", user.id)
        .single(),
      supabase
        .from("wallet_accounts")
        .select("balance_cents")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    const fallbackName = user.email?.split("@")[0] ?? "Utilisateur";
    return {
      name: profile?.display_name?.trim() || fallbackName,
      email: user.email ?? "",
      balanceCents: wallet?.balance_cents ?? 0,
      role: profile?.role_id ?? "user",
    };
  } catch {
    // Un service indisponible ne doit jamais casser le rendu : fallback démo.
    return null;
  }
}
