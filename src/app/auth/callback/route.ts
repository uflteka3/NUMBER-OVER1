import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { isSupabaseConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

/**
 * Callback Supabase Auth (confirmation d'email, OAuth, récupération).
 * Échange le `code` contre une session, puis redirige :
 *  - type=recovery → /auth/update-password
 *  - sinon → next (ou /dashboard)
 */
export async function GET(request: NextRequest) {
  if (!isSupabaseConfigured) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      const loginUrl = new URL("/auth/login", origin);
      loginUrl.searchParams.set("reason", "lien_expire");
      return NextResponse.redirect(loginUrl);
    }
  }

  const dest =
    type === "recovery"
      ? "/auth/update-password"
      : next?.startsWith("/")
        ? next
        : "/dashboard";

  return NextResponse.redirect(new URL(dest, origin));
}
