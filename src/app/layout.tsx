import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "NUMBER OVER — Activations SMS instantanées sur numéros réels",
    template: "%s · NUMBER OVER",
  },
  description:
    "Recevez vos codes de vérification SMS (OTP) sur des numéros réels temporaires, dans plus de 145 pays et pour plus de 2 500 services. Paiement à l'usage, remboursement automatique, réception en temps réel.",
  keywords: [
    "activation SMS",
    "code OTP",
    "numéro temporaire",
    "vérification SMS",
    "numéro virtuel",
    "NUMBER OVER",
  ],
  openGraph: {
    title: "NUMBER OVER — Activations SMS instantanées",
    description:
      "Recevez vos codes de vérification sur des numéros réels, en quelques secondes. 145+ pays, 2 500+ services, sans abonnement.",
    type: "website",
    locale: "fr_FR",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#04060c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-dvh">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[120] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Aller au contenu
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
