"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

/**
 * Client Supabase navigateur (session en cookies HTTP-only via @supabase/ssr).
 * Utilisé pour les souscriptions Realtime et les lectures RLS côté client
 * (Phases 5-6). Jamais de service_role ici.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
