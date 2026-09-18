import { DemoBanner } from "@/components/app/demo-banner";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";
import { demoUser } from "@/lib/demo/data";
import { getCurrentUserDisplay } from "@/server/auth/get-current-user";

/**
 * Shell de l'espace applicatif. Mode démo : identité d'aperçu.
 * Mode live (Supabase configuré) : identité réelle — profil + solde
 * wallet lus via RLS avec la session de l'utilisateur.
 */
export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const current = await getCurrentUserDisplay();
  const isDemo = !current;

  const userInfo = isDemo
    ? {
        name: demoUser.name,
        email: demoUser.email,
        balanceCents: demoUser.balanceCents,
        isAdmin: demoUser.role === "admin",
        live: false as const,
      }
    : {
        name: current.name,
        email: current.email,
        balanceCents: current.balanceCents,
        isAdmin: current.role === "admin",
        live: true as const,
      };

  return (
    <div className="min-h-dvh">
      <Sidebar user={userInfo} />
      <div className="lg:pl-64">
        <Topbar user={userInfo} />
        <main id="contenu" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-14">
          <DemoBanner />
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
