"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, PackageX, Search, ShieldCheck, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/app/page-header";
import { EASE } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { CATALOG_CATEGORIES, CATALOG_COUNTRIES, demoCatalog, demoUser } from "@/lib/demo/data";
import type { CatalogService } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";

type SortId = "popular" | "price_asc" | "price_desc" | "name";

const SORT_OPTIONS = [
  { value: "popular", label: "Populaires" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
  { value: "name", label: "Nom (A → Z)" },
];

export function CatalogueView() {
  const router = useRouter();
  const toast = useToast();
  const [country, setCountry] = useState("GB");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [sort, setSort] = useState<SortId>("popular");
  const [favorites, setFavorites] = useState<Set<string>>(new Set(["wa", "tg"]));
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [buying, setBuying] = useState<CatalogService | null>(null);
  const [confirming, setConfirming] = useState(false);

  const selectedCountry = CATALOG_COUNTRIES.find((c) => c.iso === country)!;

  const filtered = useMemo(() => {
    let list = demoCatalog.filter((s) => {
      if (favoritesOnly && !favorites.has(s.code)) return false;
      if (category !== "Tous" && s.category !== category) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    switch (sort) {
      case "price_asc":
        list = [...list].sort((a, b) => a.priceCents - b.priceCents);
        break;
      case "price_desc":
        list = [...list].sort((a, b) => b.priceCents - a.priceCents);
        break;
      case "name":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list = [...list].sort((a, b) => b.available - a.available);
    }
    return list;
  }, [search, category, sort, favoritesOnly, favorites]);

  function toggleFavorite(code: string) {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  function confirmPurchase() {
    setConfirming(true);
    // Mode démo : simulation de la séquence d'achat réelle (Phase 5 : appel serveur)
    setTimeout(() => {
      setConfirming(false);
      setBuying(null);
      toast.push({
        tone: "success",
        title: "Achat simulé",
        description: "Découvrez l'écran d'activation temps réel (simulation).",
      });
      router.push("/activations/act-live");
    }, 900);
  }

  const canAfford = buying ? demoUser.balanceCents >= buying.priceCents : false;

  return (
    <>
      <PageHeader
        title="Catalogue"
        description="Choisissez un pays, puis un service. Le prix exact est revérifié côté serveur au moment de l'achat."
      />

      {/* Étape 1 : pays */}
      <section aria-label="Choisir un pays" className="mb-6">
        <p className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-500/20 font-mono text-[0.6rem] text-brand-300">1</span>
          Pays
        </p>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATALOG_COUNTRIES.map((c) => (
            <button
              key={c.iso}
              onClick={() => setCountry(c.iso)}
              aria-pressed={country === c.iso}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all duration-200",
                country === c.iso
                  ? "border-brand-400/60 bg-brand-500/15 text-white shadow-glow"
                  : "border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/[0.18] hover:text-white"
              )}
            >
              <span aria-hidden="true">{c.flag}</span>
              {c.name}
            </button>
          ))}
        </div>
      </section>

      {/* Étape 2 : recherche + filtres */}
      <section aria-label="Filtrer les services" className="mb-6 space-y-3">
        <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
          <span className="flex size-5 items-center justify-center rounded-full bg-brand-500/20 font-mono text-[0.6rem] text-brand-300">2</span>
          Service
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un service… (WhatsApp, Telegram…)"
              aria-label="Rechercher un service"
              className="h-12 w-full rounded-xl border border-white/[0.09] bg-white/[0.04] pl-11 pr-4 text-sm text-white placeholder:text-slate-500 transition-all hover:border-white/[0.16] focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setFavoritesOnly((v) => !v)}
              aria-pressed={favoritesOnly}
              className={cn(
                "flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-all",
                favoritesOnly
                  ? "border-danger-400/50 bg-danger-500/10 text-danger-300"
                  : "border-white/[0.09] bg-white/[0.04] text-slate-400 hover:text-white"
              )}
            >
              <Heart className={cn("size-4", favoritesOnly && "fill-current")} />
              Favoris
            </button>
            <Select
              className="w-44 [&_button]:h-12"
              options={SORT_OPTIONS}
              value={sort}
              onChange={(v) => setSort(v as SortId)}
            />
          </div>
        </div>

        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATALOG_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all",
                category === cat
                  ? "bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))] text-white"
                  : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.09] hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Étape 3 : résultats */}
      <section aria-label="Services disponibles">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            <span className="font-mono text-slate-300">{filtered.length}</span> services ·{" "}
            {selectedCountry.flag} {selectedCountry.name}
          </p>
          <Badge tone="warning" className="text-[0.62rem]">prix & stock d'aperçu</Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/[0.1] px-6 py-14 text-center">
            <PackageX className="size-8 text-slate-600" />
            <p className="mt-3 font-medium text-white">Aucun service trouvé</p>
            <p className="mt-1 text-sm text-slate-500">Modifiez votre recherche ou vos filtres.</p>
          </div>
        ) : (
          <motion.ul layout className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((service) => {
                const out = service.available === 0;
                return (
                  <motion.li
                    key={service.code}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.25, ease: EASE }}
                  >
                    <div
                      className={cn(
                        "glass group relative flex h-full flex-col rounded-2xl p-4 transition-all duration-300",
                        !out && "hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-glow"
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className="flex size-10 items-center justify-center rounded-xl font-display text-xs font-bold"
                          style={{ backgroundColor: service.tint + "26", color: service.tint }}
                        >
                          {service.name.slice(0, 2).toUpperCase()}
                        </span>
                        <button
                          onClick={() => toggleFavorite(service.code)}
                          aria-label={
                            favorites.has(service.code)
                              ? `Retirer ${service.name} des favoris`
                              : `Ajouter ${service.name} aux favoris`
                          }
                          aria-pressed={favorites.has(service.code)}
                          className={cn(
                            "rounded-full p-1.5 transition-colors",
                            favorites.has(service.code)
                              ? "text-danger-400"
                              : "text-slate-600 hover:text-slate-300"
                          )}
                        >
                          <Heart className={cn("size-4", favorites.has(service.code) && "fill-current")} />
                        </button>
                      </div>

                      <div className="mt-3 flex-1">
                        <p className="font-medium text-white">{service.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{service.category}</p>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <div>
                          <p className="font-mono text-lg font-semibold text-white">
                            {formatUSD(service.priceCents)}
                          </p>
                          {out ? (
                            <Badge tone="danger" className="mt-1 text-[0.62rem]">indisponible</Badge>
                          ) : (
                            <Badge
                              tone={service.available < 20 ? "warning" : "success"}
                              dot
                              className="mt-1 text-[0.62rem]"
                            >
                              {service.available} numéros
                            </Badge>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant={out ? "secondary" : "primary"}
                          disabled={out}
                          onClick={() => setBuying(service)}
                        >
                          <ShoppingCart className="size-3.5" />
                          Acheter
                        </Button>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </AnimatePresence>
          </motion.ul>
        )}
      </section>

      {/* Modale d'achat */}
      <Modal
        open={buying !== null}
        onClose={() => !confirming && setBuying(null)}
        title="Confirmer l'achat"
        description="Le numéro vous est réservé immédiatement après le débit."
        footer={
          <>
            <Button variant="ghost" onClick={() => setBuying(null)} disabled={confirming}>
              Annuler
            </Button>
            <Button onClick={confirmPurchase} loading={confirming} disabled={!canAfford}>
              <ShoppingCart className="size-4" />
              {canAfford ? "Confirmer l'achat" : "Solde insuffisant"}
            </Button>
          </>
        }
      >
        {buying && (
          <div className="space-y-4">
            <div className="glass rounded-xl p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Service</span>
                <span className="flex items-center gap-2 font-medium text-white">
                  <span className="size-2 rounded-full" style={{ backgroundColor: buying.tint }} />
                  {buying.name}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between text-sm">
                <span className="text-slate-400">Pays</span>
                <span className="font-medium text-white">
                  {selectedCountry.flag} {selectedCountry.name}
                </span>
              </div>
              <div className="mt-2.5 flex items-center justify-between border-t border-white/[0.07] pt-2.5 text-sm">
                <span className="text-slate-400">Prix</span>
                <span className="font-mono text-lg font-semibold text-white">
                  {formatUSD(buying.priceCents)} <span className="text-[0.6rem] text-warning-400">démo</span>
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-brand-500/20 bg-brand-500/[0.06] p-3.5">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-300" />
              <p className="text-xs leading-relaxed text-slate-400">
                En production, le prix est <span className="text-slate-200">recalculé côté serveur</span> à
                l'instant de l'achat (coût opérateur + marge) — jamais repris du navigateur.
                Aucun SMS reçu ? <span className="text-slate-200">Remboursement automatique.</span>
              </p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Solde actuel (démo)</span>
              <span className={cn("font-mono", canAfford ? "text-success-300" : "text-danger-300")}>
                {formatUSD(demoUser.balanceCents)}
              </span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
