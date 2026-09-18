import type { Metadata } from "next";
import { HistoriqueView } from "@/components/app/views/historique-view";

export const metadata: Metadata = { title: "Historique" };

export default function HistoriquePage() {
  return <HistoriqueView />;
}
