import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/auth/update-password-form";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

export default function UpdatePasswordPage() {
  return <UpdatePasswordForm />;
}
