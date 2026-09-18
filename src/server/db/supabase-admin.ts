import "server-only";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

/**
 * Client Supabase avec la clé SERVICE ROLE.
 *
 * ⚠️ RÉSERVÉ AU SERVEUR (BFF Next.js) : contourne la RLS.
 *  - n'importer que dans des modules `server-only` (API routes,
 *    Server Actions, jobs) ;
 *  - ne jamais exposer ce client (ni la clé) au navigateur ;
 *  - toute entrée utilisateur doit être validée AVANT d'appeler ce client.
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !serviceRoleKey) {
    throw new Error(
      "Configuration incomplète : SUPABASE_SERVICE_ROLE_KEY (et NEXT_PUBLIC_SUPABASE_URL) requis."
    );
  }

  return createClient(SUPABASE_URL, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
