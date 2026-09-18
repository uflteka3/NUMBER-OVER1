"use client";

import { Calculator, Percent, Pin, Plus, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TBody, Td, Th, THead } from "@/components/ui/table";
import { demoPricingRules } from "@/lib/demo/data";
import type { PricingRule } from "@/lib/demo/types";
import { formatUSD } from "@/lib/format";

const SCOPE_LABELS: Record<PricingRule["scope"], { label: string; tone: "brand" | "accent" | "warning" | "success" }> = {
  global: { label: "Globale", tone: "brand" },
  service: { label: "Par service", tone: "accent" },
  country: { label: "Par pays", tone: "warning" },
  service_country: { label: "Service × pays", tone: "success" },
};

export function AdminTarificationView() {
  const demoAction = useDemoAction();
  const [rules, setRules] = useState(demoPricingRules);
  const [globalMargin, setGlobalMargin] = useState("30");
  const [createOpen, setCreateOpen] = useState(false);
  const [newScope, setNewScope] = useState("service");

  // Exemple de calcul transparent (aperçu pédagogique)
  const cost = 50;
  const margin = Number(globalMargin) || 0;
  const computed = Math.ceil(cost * (1 + margin / 100));

  function toggleRule(id: string, active: boolean) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, active } : r)));
  }

  return (
    <>
      <PageHeader
        title="Tarification"
        description="Marges appliquées au coût fournisseur. Le prix final est toujours recalculé côté serveur à l'achat — jamais pris du navigateur."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" /> Nouvelle règle
          </Button>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.5fr]">
        {/* Marge globale + simulateur */}
        <div className="space-y-5">
          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-display font-semibold text-white">
              <Percent className="size-4 text-brand-300" /> Marge globale
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">
              Appliquée quand aucune règle plus spécifique (service, pays, prix fixe) ne correspond.
            </p>
            <div className="mt-5">
              <Field label="Taux de marge (%)" htmlFor="global-margin">
                <Input
                  id="global-margin"
                  inputMode="numeric"
                  value={globalMargin}
                  onChange={(e) => setGlobalMargin(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </Field>
            </div>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => demoAction("L'enregistrement de la marge globale", "Phase 8")}
            >
              Enregistrer
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="flex items-center gap-2 font-display font-semibold text-white">
              <Calculator className="size-4 text-accent-300" /> Simulateur de prix
            </h2>
            <p className="mt-1.5 text-xs text-slate-500">Exemple avec un coût fournisseur de {formatUSD(cost)} :</p>
            <div className="mt-4 space-y-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 font-mono text-sm">
              <div className="flex justify-between text-slate-400">
                <span>coût fournisseur</span>
                <span>{formatUSD(cost)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>marge {margin || 0}%</span>
                <span>+{formatUSD(computed - cost)}</span>
              </div>
              <div className="flex justify-between border-t border-white/[0.08] pt-2.5 font-semibold text-white">
                <span>prix client</span>
                <span className="text-gradient">{formatUSD(computed)}</span>
              </div>
            </div>
            <p className="mt-3 text-[0.65rem] leading-relaxed text-slate-600">
              Priorité réelle : prix fixe (service × pays) → marge service × pays → marge service →
              marge pays → marge globale.
            </p>
          </Card>
        </div>

        {/* Règles */}
        <Card className="p-4 sm:p-5">
          <h2 className="mb-4 flex items-center gap-2 px-1 font-display font-semibold text-white">
            <Settings2 className="size-4 text-warning-300" /> Règles actives
          </h2>
          <Table>
            <THead>
              <tr>
                <Th>Portée</Th>
                <Th>Cible</Th>
                <Th className="text-right">Valeur</Th>
                <Th className="text-right">Active</Th>
                <Th></Th>
              </tr>
            </THead>
            <TBody>
              {rules.map((rule) => {
                const scope = SCOPE_LABELS[rule.scope];
                return (
                  <tr key={rule.id}>
                    <Td><Badge tone={scope.tone}>{scope.label}</Badge></Td>
                    <Td className="font-medium text-slate-200">{rule.target}</Td>
                    <Td className="text-right font-mono text-xs">
                      {rule.type === "percent" ? (
                        <span className="text-accent-300">+{rule.value}%</span>
                      ) : (
                        <span className="text-success-300">{formatUSD(rule.value)} fixe</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <span className="inline-flex justify-end" onClick={(e) => e.stopPropagation()}>
                        <Switch checked={rule.active} onChange={(v) => toggleRule(rule.id, v)} />
                      </span>
                    </Td>
                    <Td className="text-right">
                      <button
                        aria-label={`Supprimer la règle ${rule.target}`}
                        onClick={() => demoAction("La suppression d'une règle tarifaire", "Phase 8")}
                        className="rounded-lg p-1.5 text-slate-600 transition-colors hover:bg-danger-500/10 hover:text-danger-300"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </TBody>
          </Table>
        </Card>
      </div>

      {/* Création de règle */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Nouvelle règle tarifaire"
        description="La règle s'applique à tous les prix futurs après enregistrement (avec recalcul serveur)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>Annuler</Button>
            <Button
              onClick={() => {
                setCreateOpen(false);
                demoAction("La création de règles tarifaires (persistée en base)", "Phase 8");
              }}
            >
              <Pin className="size-4" /> Créer la règle
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Portée"
            value={newScope}
            onChange={setNewScope}
            options={[
              { value: "service", label: "Par service", hint: "ex. WhatsApp" },
              { value: "country", label: "Par pays", hint: "ex. 🇫🇷 France" },
              { value: "service_country", label: "Service × pays", hint: "prix dédié" },
              { value: "fixed", label: "Prix fixe", hint: "montant imposé" },
            ]}
          />
          <Field label="Cible" htmlFor="rule-target" hint="Service et/ou pays concernés">
            <Input id="rule-target" placeholder="ex. Telegram · 🇬🇧 Royaume-Uni" />
          </Field>
          <Field label="Valeur" htmlFor="rule-value" hint="% de marge, ou prix fixe en dollars">
            <Input id="rule-value" inputMode="decimal" placeholder={newScope === "fixed" ? "0.42" : "40"} />
          </Field>
        </div>
      </Modal>
    </>
  );
}
