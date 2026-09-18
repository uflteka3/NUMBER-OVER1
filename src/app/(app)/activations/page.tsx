import type { Metadata } from "next";
import { ActivationsView } from "@/components/app/views/activations-view";

export const metadata: Metadata = { title: "Mes activations" };

export default function ActivationsPage() {
  return <ActivationsView />;
}
