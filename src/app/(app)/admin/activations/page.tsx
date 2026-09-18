import type { Metadata } from "next";
import { AdminActivationsView } from "@/components/app/views/admin-activations-view";

export const metadata: Metadata = { title: "Admin — Activations" };

export default function AdminActivationsPage() {
  return <AdminActivationsView />;
}
