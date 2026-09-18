"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MOBILE_NAV } from "./nav";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navigation principale mobile"
      className="glass-strong fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.07] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {MOBILE_NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const isCta = item.href === "/catalogue";
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 py-2.5"
              >
                {isCta ? (
                  <span className="-mt-5 flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--color-brand-500),var(--color-accent-500))] text-white shadow-glow transition-transform active:scale-95">
                    <item.icon className="size-5" />
                  </span>
                ) : (
                  <item.icon
                    className={cn(
                      "size-5 transition-colors",
                      active ? "text-brand-300" : "text-slate-500"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-[0.6rem] font-medium transition-colors",
                    isCta ? "text-accent-300" : active ? "text-white" : "text-slate-500"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
