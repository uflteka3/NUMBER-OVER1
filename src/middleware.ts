import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware : rafraîchit la session (cookies) et protège les routes.
 *
 * En mode démo (Supabase non configuré) : laisse tout passer.
 * En mode live : /dashboard, /catalogue, /activations, /wallet,
 * /historique, /notifications, /profil exigent une session ; /admin/*
 * exige en plus le rôle admin (profil).
 */

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/catalogue",
  "/activations",
  "/wallet",
  "/historique",
  "/notifications",
  "/profil",
];
const ADMIN_PREFIX = "/admin";
const AUTH_PAGES = ["/auth/login", "/auth/register"];

export async function middleware(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Mode démo : aucune garde (intégration pas encore branchée)
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT : getUser() interroge le serveur Auth (pas de décodage local)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isAdminPath = pathname === ADMIN_PREFIX || pathname.startsWith(ADMIN_PREFIX + "/");

  // Route protégée sans session → redirection vers login (avec retour)
  if ((isProtected || isAdminPath) && !user) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Déjà connecté sur une page de connexion/inscription → dashboard
  if (user && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Garde admin : vérifie le rôle dans le profil
  if (user && isAdminPath) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role_id")
      .eq("id", user.id)
      .single();
    if (profile?.role_id !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/catalogue/:path*",
    "/activations/:path*",
    "/wallet/:path*",
    "/historique/:path*",
    "/notifications/:path*",
    "/profil/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
