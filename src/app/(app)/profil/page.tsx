import type { Metadata } from "next";
import { ProfilView } from "@/components/app/views/profil-view";

export const metadata: Metadata = { title: "Mon profil" };

export default function ProfilPage() {
  return <ProfilView />;
}
