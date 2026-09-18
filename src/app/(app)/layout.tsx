import { DemoBanner } from "@/components/app/demo-banner";
import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { Topbar } from "@/components/app/topbar";

/**
 * Shell de l'espace applicatif (Phase 3 : sans garde d'authentification
 * — la protection des routes arrive avec Supabase Auth en Phase 4).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="lg:pl-64">
        <Topbar />
        <main id="contenu" className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:pb-14">
          <DemoBanner />
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
