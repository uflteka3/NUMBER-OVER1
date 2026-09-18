import { Smartphone } from "lucide-react";
import Link from "next/link";
import { ActivationDetailView } from "@/components/app/views/activation-detail-view";
import { findDemoActivation } from "@/lib/demo/data";

export default async function ActivationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activation = findDemoActivation(id);

  if (!activation) {
    // En Phase 4+, 404 réelle. En démo : état propre + retour.
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-white/[0.1] px-6 py-16 text-center">
        <Smartphone className="size-8 text-slate-600" />
        <h1 className="mt-4 font-display text-lg font-semibold text-white">
          Activation introuvable
        </h1>
        <p className="mt-1.5 max-w-sm text-sm text-slate-500">
          Cette activation n'existe pas (ou n'appartient pas à votre compte).
        </p>
        <Link
          href="/activations"
          className="mt-5 rounded-full bg-white/[0.06] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/[0.1]"
        >
          Voir mes activations
        </Link>
      </div>
    );
  }

  return <ActivationDetailView activation={activation} />;
}
