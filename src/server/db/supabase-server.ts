import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

/**
 * Client Supabase lié à la session utilisateur (cookies HTTP-only).
 * Servir uniquement dans les Server Components, Server Actions et
 * Route Handlers. Respecte la RLS en tant qu'utilisateur courant
 * (rôle `authenticated`).
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase n'est pas configuré : définir NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Appelé depuis un Server Component (lecture seule) :
          // le rafraîchissement des cookies est assuré par le middleware.
        }
      },
    },
  });
}
