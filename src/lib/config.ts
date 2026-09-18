/**
 * Configuration runtime de l'application.
 *
 * Tant que les variables Supabase ne sont pas définies, l'app tourne en
 * mode démonstration (données d'aperçu étiquetées). Dès qu'elles sont
 * présentes, l'authentification réelle et la protection des routes
 * s'activent automatiquement — aucun changement de code requis.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** Supabase est-il configuré ? (variables publiques présentes des deux côtés) */
export const isSupabaseConfigured: boolean = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Mode de données de l'interface. */
export const DATA_MODE: "live" | "demo" = isSupabaseConfigured ? "live" : "demo";
