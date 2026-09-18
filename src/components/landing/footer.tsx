import Link from "next/link";
import { Logo } from "@/components/brand/logo";

const COLUMNS = [
  {
    title: "Produit",
    links: [
      { href: "#fonctionnement", label: "Comment ça marche" },
      { href: "#services", label: "Services" },
      { href: "#pays", label: "Pays couverts" },
      { href: "#faq", label: "FAQ" },
    ],
  },
  {
    title: "Compte",
    links: [
      { href: "/auth/register", label: "Créer un compte" },
      { href: "/auth/login", label: "Connexion" },
    ],
  },
  {
    title: "Légal",
    links: [
      { href: "/legal/cgu", label: "Conditions d'utilisation" },
      { href: "/legal/confidentialite", label: "Politique de confidentialité" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
              Activations SMS temporaires sur numéros réels. Recevez vos codes de vérification
              en temps réel, dans plus de 145 pays.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="font-mono text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
                {column.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-8 sm:flex-row">
          <p className="text-xs text-slate-600">
            © 2026 NUMBER OVER — Tous droits réservés.
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-600">
            Activations SMS temporaires
          </p>
        </div>
      </div>
    </footer>
  );
}
