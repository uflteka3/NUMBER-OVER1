"use client";

import { Bell, Mail, Search } from "lucide-react";
import { useState } from "react";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Dots, Spinner } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";

/**
 * Vitrine du design system NUMBER OVER.
 * Page de vérification visuelle (Phase 2) — sera retirée/protégée avant la production.
 */

const SWATCHES = [
  { name: "night-950", class: "bg-night-950", hex: "#04060c" },
  { name: "night-900", class: "bg-night-900", hex: "#070b14" },
  { name: "night-800", class: "bg-night-800", hex: "#101728" },
  { name: "night-600", class: "bg-night-600", hex: "#28345c" },
  { name: "brand-500", class: "bg-brand-500", hex: "#6f6cff" },
  { name: "brand-600", class: "bg-brand-600", hex: "#5b4df0" },
  { name: "accent-400", class: "bg-accent-400", hex: "#22d3ee" },
  { name: "accent-500", class: "bg-accent-500", hex: "#06b6d4" },
  { name: "success-400", class: "bg-success-400", hex: "#34d399" },
  { name: "warning-400", class: "bg-warning-400", hex: "#fbbf24" },
  { name: "danger-400", class: "bg-danger-400", hex: "#fb7185" },
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  return (
    <main className="mx-auto max-w-5xl space-y-16 px-4 py-16 sm:px-6">
      <div className="flex items-center justify-between">
        <Logo />
        <Badge tone="warning">page de vérification — Phase 2</Badge>
      </div>

      <SectionHeading
        align="left"
        eyebrow="Design system"
        title={
          <>
            Fondations <span className="text-gradient">NUMBER OVER</span>
          </>
        }
        lead="Couleurs, typographies, composants et états. Tout ce qui suit est réutilisable dans l'application."
      />

      <Section title="Couleurs">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SWATCHES.map((swatch) => (
            <div key={swatch.name} className="glass overflow-hidden rounded-xl">
              <div className={`h-14 ${swatch.class}`} />
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-slate-200">{swatch.name}</p>
                <p className="font-mono text-[0.65rem] text-slate-500">{swatch.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Typographies">
        <Card className="space-y-3 p-6">
          <p className="font-display text-3xl font-semibold tracking-tight text-white">
            Space Grotesk — Titres 0123456789
          </p>
          <p className="text-sm text-slate-300">
            Inter — Corps de texte. La lisibilité avant tout, sur mobile comme sur desktop.
          </p>
          <p className="font-mono text-sm text-accent-300">
            JetBrains Mono — +44 7700 900123 · OTP 847291
          </p>
        </Card>
      </Section>

      <Section title="Boutons">
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Button>Primaire</Button>
          <Button variant="secondary">Secondaire</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button size="sm">Petit</Button>
          <Button size="lg">Grand</Button>
          <Button loading>Chargement</Button>
          <Button disabled>Désactivé</Button>
          <Button size="icon" aria-label="Notifications">
            <Bell className="size-4" />
          </Button>
        </Card>
      </Section>

      <Section title="Badges">
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Badge>Neutre</Badge>
          <Badge tone="brand">Brand</Badge>
          <Badge tone="accent">Accent</Badge>
          <Badge tone="success" dot>
            Terminé
          </Badge>
          <Badge tone="warning" dot pulse>
            En attente
          </Badge>
          <Badge tone="danger" dot>
            Erreur
          </Badge>
        </Card>
      </Section>

      <Section title="Champs">
        <Card className="grid gap-5 p-6 sm:grid-cols-2">
          <Field label="Email" htmlFor="ds-email" hint="Votre email de connexion">
            <Input id="ds-email" type="email" placeholder="vous@exemple.com" icon={<Mail className="size-4" />} />
          </Field>
          <Field label="Recherche" htmlFor="ds-search">
            <Input id="ds-search" placeholder="WhatsApp, Telegram…" icon={<Search className="size-4" />} />
          </Field>
          <Field label="Avec erreur" htmlFor="ds-error" error="Ce format de numéro est invalide">
            <Input id="ds-error" error defaultValue="+33 abc" />
          </Field>
        </Card>
      </Section>

      <Section title="Modale & toasts">
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Button variant="secondary" onClick={() => setModalOpen(true)}>
            Ouvrir la modale
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.push({ tone: "success", title: "SMS reçu", description: "Votre code : 847291" })
            }
          >
            Toast succès
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.push({ tone: "error", title: "Activation impossible", description: "Stock épuisé pour ce service dans ce pays." })
            }
          >
            Toast erreur
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.push({ tone: "info", title: "Remboursement", description: "0,50 $ recrédités sur votre wallet." })}
          >
            Toast info
          </Button>
        </Card>
      </Section>

      <Section title="Chargement & squelettes">
        <Card className="flex flex-wrap items-center gap-8 p-6">
          <Spinner className="size-6 text-brand-400" />
          <Spinner className="size-8 text-accent-400" />
          <Dots className="text-slate-300" />
          <div className="min-w-52 flex-1 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Card>
      </Section>

      <Section title="Logo">
        <Card className="flex flex-wrap items-center gap-8 p-6">
          <Logo />
          <Logo compact />
          <LogoMark className="size-14" />
          <LogoMark className="size-6" />
        </Card>
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirmer l'achat ?"
        description="Exemple de modale du design system (le vrai flux d'achat arrive en Phase 5-6)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setModalOpen(false)}>Confirmer</Button>
          </>
        }
      >
        <div className="glass rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Service</span>
            <span className="font-medium text-white">Telegram · 🇬🇧 Royaume-Uni</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-slate-400">Prix</span>
            <span className="font-mono text-slate-500">vérifié côté serveur à l'achat</span>
          </div>
        </div>
      </Modal>
    </main>
  );
}
