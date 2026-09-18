"use client";

import { AlertTriangle, KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { useDemoAction } from "@/components/app/demo-action";
import { ClientTime } from "@/components/app/client-time";
import { PageHeader } from "@/components/app/page-header";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { demoUser } from "@/lib/demo/data";

export function ProfilView() {
  const demoAction = useDemoAction();
  const [name, setName] = useState(demoUser.name);
  const [notifSms, setNotifSms] = useState(true);
  const [notifWallet, setNotifWallet] = useState(true);
  const [notifPromo, setNotifPromo] = useState(false);
  const [lang, setLang] = useState("fr");
  const [deleteModal, setDeleteModal] = useState(false);

  return (
    <>
      <PageHeader title="Mon profil" description="Identité, sécurité et préférences de votre compte." />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Carte identité */}
        <Card className="p-6 text-center">
          <Avatar name={demoUser.name} size="lg" className="mx-auto" />
          <h2 className="mt-4 font-display text-lg font-semibold text-white">{demoUser.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{demoUser.email}</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <Badge tone="success" dot>compte actif</Badge>
            <Badge tone="warning">aperçu démo</Badge>
          </div>
          <dl className="mt-6 space-y-3 border-t border-white/[0.06] pt-5 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Membre depuis</dt>
              <dd className="text-slate-200"><ClientTime iso={demoUser.registeredAt} mode="datetime" /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">Rôle</dt>
              <dd className="font-mono text-xs text-brand-300">{demoUser.role}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">ID interne</dt>
              <dd className="font-mono text-xs text-slate-500">usr_demo_0842</dd>
            </div>
          </dl>
        </Card>

        <div className="space-y-5">
          {/* Informations */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display font-semibold text-white">
              <User className="size-4 text-brand-300" /> Informations
            </h3>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Nom affiché" htmlFor="profil-name">
                <Input id="profil-name" value={name} onChange={(e) => setName(e.target.value)} />
              </Field>
              <Field label="Email" htmlFor="profil-email" hint="Modifiable après vérification (Phase 4)">
                <Input id="profil-email" value={demoUser.email} disabled icon={<Mail className="size-4" />} />
              </Field>
            </div>
            <div className="mt-5 flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => demoAction("L'enregistrement du profil", "Phase 4")}
              >
                Enregistrer
              </Button>
            </div>
          </Card>

          {/* Sécurité */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display font-semibold text-white">
              <KeyRound className="size-4 text-warning-300" /> Sécurité
            </h3>
            <div className="mt-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div>
                  <p className="text-sm font-medium text-slate-100">Mot de passe</p>
                  <p className="mt-0.5 text-xs text-slate-500">Défini à l'inscription · ••••••••••</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => demoAction("Le changement de mot de passe", "Phase 4")}
                >
                  Changer
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <div>
                  <p className="text-sm font-medium text-slate-100">Sessions actives</p>
                  <p className="mt-0.5 text-xs text-slate-500">1 appareil · ce navigateur</p>
                </div>
                <Badge tone="success" dot>session unique</Badge>
              </div>
            </div>
          </Card>

          {/* Préférences */}
          <Card className="p-6">
            <h3 className="flex items-center gap-2 font-display font-semibold text-white">
              <ShieldCheck className="size-4 text-accent-300" /> Préférences
            </h3>
            <div className="mt-5 space-y-5">
              <Switch
                checked={notifSms}
                onChange={setNotifSms}
                label="SMS reçus"
                description="Notification dès qu'un code arrive sur un numéro actif."
              />
              <Switch
                checked={notifWallet}
                onChange={setNotifWallet}
                label="Mouvements de wallet"
                description="Recharges, remboursements et ajustements de solde."
              />
              <Switch
                checked={notifPromo}
                onChange={setNotifPromo}
                label="Nouveautés produit"
                description="Nouveaux services, pays et améliorations (occasionnel)."
              />
              <Select
                label="Langue de l'interface"
                value={lang}
                onChange={setLang}
                options={[
                  { value: "fr", label: "Français", hint: "actuel" },
                  { value: "en", label: "English", hint: "à venir" },
                ]}
              />
            </div>
          </Card>

          {/* Zone danger */}
          <Card className="border-danger-500/25 p-6">
            <h3 className="flex items-center gap-2 font-display font-semibold text-danger-300">
              <AlertTriangle className="size-4" /> Zone dangereuse
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              La suppression du compte est définitive. Le solde restant doit être nul.
            </p>
            <Button variant="danger" size="sm" className="mt-4" onClick={() => setDeleteModal(true)}>
              Supprimer mon compte
            </Button>
          </Card>
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Supprimer le compte ?"
        description="Cette action est irréversible : historique, activations et wallet seront effacés."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteModal(false)}>Conserver mon compte</Button>
            <Button
              variant="danger"
              onClick={() => {
                setDeleteModal(false);
                demoAction("La suppression de compte", "Phase 4");
              }}
            >
              Supprimer définitivement
            </Button>
          </>
        }
      />
    </>
  );
}
