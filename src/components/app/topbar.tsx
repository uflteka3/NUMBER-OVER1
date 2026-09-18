"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, LogOut, Plus, User, Wallet } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";
import { EASE } from "@/components/motion/reveal";
import { Avatar } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/toast";
import { demoNotifications, demoUser } from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";
import { ClientTime } from "./client-time";
import { cn } from "@/lib/utils";

const TITLES: Array<[string, string]> = [
  ["/dashboard", "Tableau de bord"],
  ["/catalogue", "Catalogue"],
  ["/activations", "Activations"],
  ["/wallet", "Wallet"],
  ["/historique", "Historique"],
  ["/notifications", "Notifications"],
  ["/profil", "Profil"],
  ["/admin", "Administration"],
];

function useDropdown() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  return { open, setOpen, containerRef };
}

export function Topbar() {
  const pathname = usePathname();
  const toast = useToast();
  const {
    open: notifOpen,
    setOpen: setNotifOpen,
    containerRef: notifContainerRef,
  } = useDropdown();
  const {
    open: userOpen,
    setOpen: setUserOpen,
    containerRef: userContainerRef,
  } = useDropdown();
  const unread = demoNotifications.filter((n) => !n.read).length;
  const title = TITLES.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? "";

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-night-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 lg:hidden">
          <Link href="/dashboard" aria-label="NUMBER OVER">
            <Logo compact />
          </Link>
        </div>
        <p className="hidden font-display text-sm font-semibold tracking-tight text-slate-200 lg:block">
          {title}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href="/wallet"
            className="glass hidden items-center gap-2 rounded-full px-3.5 py-2 font-mono text-xs text-accent-200 transition-colors hover:border-white/[0.18] sm:flex"
            title="Solde du wallet (démo)"
          >
            <Wallet className="size-3.5 text-accent-400" />
            {formatUSD(demoUser.balanceCents)}
          </Link>

          <Link
            href="/catalogue"
            className="hidden h-9 items-center gap-1.5 rounded-full bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))] px-4 text-sm font-medium text-white shadow-glow transition-all hover:brightness-110 md:flex"
          >
            <Plus className="size-4" />
            Nouvelle activation
          </Link>

          {/* Notifications */}
          <div ref={notifContainerRef} className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              aria-label={`Notifications${unread > 0 ? `, ${unread} non lues` : ""}`}
              aria-expanded={notifOpen}
              className="relative rounded-full p-2.5 text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              <Bell className="size-[1.1rem]" />
              {unread > 0 && (
                <span className="absolute right-1.5 top-1.5 flex size-2">
                  <span className="absolute size-full animate-ping rounded-full bg-accent-400 opacity-60" />
                  <span className="size-full rounded-full bg-accent-400" />
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="glass-strong absolute right-0 z-50 mt-2 w-[21rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl shadow-glow"
                >
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
                    <p className="text-sm font-semibold text-white">Notifications</p>
                    <span className="font-mono text-[0.65rem] text-slate-500">{unread} non lues</span>
                  </div>
                  <ul className="max-h-80 overflow-y-auto p-1.5">
                    {demoNotifications.slice(0, 5).map((n) => (
                      <li key={n.id}>
                        <Link
                          href="/notifications"
                          onClick={() => setNotifOpen(false)}
                          className={cn(
                            "block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/[0.05]",
                            !n.read && "bg-brand-500/[0.06]"
                          )}
                        >
                          <p className="flex items-center gap-2 text-sm font-medium text-slate-100">
                            {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-brand-400" />}
                            {n.title}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.body}</p>
                          <ClientTime iso={n.at} className="mt-1 block text-[0.65rem] text-slate-600" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="block border-t border-white/[0.06] px-4 py-2.5 text-center text-xs font-medium text-brand-300 transition-colors hover:bg-white/[0.04]"
                  >
                    Tout voir
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Menu utilisateur */}
          <div ref={userContainerRef} className="relative">
            <button
              onClick={() => setUserOpen(!userOpen)}
              aria-label="Menu du compte"
              aria-expanded={userOpen}
              className="rounded-full transition-transform hover:scale-105"
            >
              <Avatar name={demoUser.name} />
            </button>
            <AnimatePresence>
              {userOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: EASE }}
                  className="glass-strong absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl p-1.5 shadow-glow"
                >
                  <div className="border-b border-white/[0.06] px-3 py-3">
                    <p className="text-sm font-semibold text-white">{demoUser.name}</p>
                    <p className="truncate text-xs text-slate-500">{demoUser.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      href="/profil"
                      onClick={() => setUserOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <User className="size-4 text-slate-500" /> Mon profil
                    </Link>
                    <button
                      onClick={() => {
                        setUserOpen(false);
                        toast.push({
                          tone: "info",
                          title: "Mode démonstration",
                          description: "La déconnexion réelle sera active avec Supabase Auth (Phase 4).",
                        });
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-slate-300 transition-colors hover:bg-white/[0.05] hover:text-white"
                    >
                      <LogOut className="size-4 text-slate-500" /> Se déconnecter
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
