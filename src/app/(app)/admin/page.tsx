import type { Metadata } from "next";
import { AdminOverviewView } from "@/components/app/views/admin-overview-view";

export const metadata: Metadata = { title: "Admin — Vue d'ensemble" };

export default function AdminPage() {
  return <AdminOverviewView />;
}
