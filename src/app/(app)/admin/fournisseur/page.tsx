import type { Metadata } from "next";
import { AdminProviderView } from "@/components/app/views/admin-provider-view";

export const metadata: Metadata = { title: "Admin — Fournisseur" };

export default function AdminProviderPage() {
  return <AdminProviderView />;
}
