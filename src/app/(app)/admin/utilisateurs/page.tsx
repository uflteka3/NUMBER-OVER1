import type { Metadata } from "next";
import { AdminUsersView } from "@/components/app/views/admin-users-view";

export const metadata: Metadata = { title: "Admin — Utilisateurs" };

export default function AdminUsersPage() {
  return <AdminUsersView />;
}
