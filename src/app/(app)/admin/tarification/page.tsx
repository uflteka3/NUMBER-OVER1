import type { Metadata } from "next";
import { AdminTarificationView } from "@/components/app/views/admin-tarification-view";

export const metadata: Metadata = { title: "Admin — Tarification" };

export default function AdminTarificationPage() {
  return <AdminTarificationView />;
}
