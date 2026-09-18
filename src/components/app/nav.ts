import {
  Bell,
  History,
  LayoutDashboard,
  ListPlus,
  Radio,
  Settings2,
  Shield,
  Smartphone,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
      { href: "/catalogue", label: "Catalogue", icon: ListPlus },
      { href: "/activations", label: "Mes activations", icon: Smartphone },
    ],
  },
  {
    title: "Compte",
    items: [
      { href: "/wallet", label: "Wallet", icon: Wallet },
      { href: "/historique", label: "Historique", icon: History },
      { href: "/notifications", label: "Notifications", icon: Bell },
    ],
  },
];

export const ADMIN_SECTION: NavSection = {
  title: "Administration",
  items: [
    { href: "/admin", label: "Vue d'ensemble", icon: Shield },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icon: Users },
    { href: "/admin/activations", label: "Activations", icon: Smartphone },
    { href: "/admin/tarification", label: "Tarification", icon: Settings2 },
    { href: "/admin/fournisseur", label: "Fournisseur", icon: Radio },
  ],
};

export const MOBILE_NAV: NavItem[] = [
  { href: "/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/activations", label: "Activations", icon: Smartphone },
  { href: "/catalogue", label: "Acheter", icon: ListPlus },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/notifications", label: "Alertes", icon: Bell },
];
