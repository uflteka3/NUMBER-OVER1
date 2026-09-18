"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { demoUser } from "@/lib/demo/data";
import { formatUSD } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ADMIN_SECTION, NAV_SECTIONS, type NavSection } from "./nav";

function Section({ section, pathname }: { section: NavSection; pathname: string }) {
  return (
    <div>
      {section.title && (
        <p className="mb-2 px-4 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-slate-600">
          {section.title}
        </p>
      )}
      <ul className="space-y-1">
        {section.items.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-brand-500/20 to-accent-500/10 text-white ring-1 ring-brand-500/25"
                    : "text-slate-400 hover:bg-white/[0.05] hover:text-white"
                )}
              >
                <item.icon
                  className={cn(
                    "size-[1.1rem] transition-colors",
                    active ? "text-brand-300" : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                {item.label}
                {active && (
                  <span className="ml-auto size-1.5 rounded-full bg-gradient-to-r from-brand-400 to-accent-400" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export interface SidebarUserInfo {
  name: string;
  email: string;
  balanceCents: number;
  isAdmin: boolean;
  live: boolean;
}

export function Sidebar({ user }: { user?: SidebarUserInfo }) {
  const info = user ?? {
    name: demoUser.name,
    email: demoUser.email,
    balanceCents: demoUser.balanceCents,
    isAdmin: demoUser.role === "admin",
    live: false,
  };
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-white/[0.06] bg-night-900/60 px-3 py-5 backdrop-blur-xl lg:flex">
      <Link href="/" className="px-2" aria-label="NUMBER OVER — retour à l'accueil">
        <Logo />
      </Link>

      <nav className="mt-8 flex-1 space-y-6 overflow-y-auto">
        {NAV_SECTIONS.map((section, i) => (
          <Section key={section.title ?? i} section={section} pathname={pathname} />
        ))}
        {info.isAdmin && <Section section={ADMIN_SECTION} pathname={pathname} />}
      </nav>

      <div className="glass mt-4 rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <Avatar name={info.name} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{info.name}</p>
            <p className="truncate font-mono text-[0.7rem] text-accent-300">
              {formatUSD(info.balanceCents)}
              {!info.live && <span className="text-slate-600"> · démo</span>}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {!info.live && (
            <Badge tone="warning" className="text-[0.62rem]">
              Aperçu
            </Badge>
          )}
          <Link
            href="/profil"
            className="text-xs font-medium text-slate-400 transition-colors hover:text-white"
          >
            Mon profil →
          </Link>
        </div>
      </div>
    </aside>
  );
}
