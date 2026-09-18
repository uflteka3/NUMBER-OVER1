import { cn } from "@/lib/utils";
import Link from "next/link";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { Spinner } from "./loader";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  primary:
    "bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))] text-white shadow-glow hover:brightness-110 active:brightness-95",
  secondary: "glass text-slate-100 hover:bg-white/[0.08] hover:border-white/[0.16]",
  outline:
    "border border-brand-500/40 bg-brand-500/[0.08] text-brand-200 hover:bg-brand-500/[0.16] hover:border-brand-400/60",
  ghost: "text-slate-300 hover:bg-white/[0.06] hover:text-white",
  danger:
    "border border-danger-500/40 bg-danger-500/[0.1] text-danger-300 hover:bg-danger-500/[0.18]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-[3.25rem] px-7 text-base gap-2.5",
  icon: "size-10",
};

const base =
  "group/btn relative inline-flex select-none items-center justify-center whitespace-nowrap rounded-full font-medium tracking-tight transition-all duration-200 hover:-translate-y-px active:translate-y-0 disabled:pointer-events-none disabled:opacity-50";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, href, className, children, disabled, ...props },
  ref
) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button ref={ref} className={classes} disabled={disabled || loading} {...props}>
      {loading && <Spinner className="-ml-1 size-4" label="Chargement" />}
      {children}
    </button>
  );
});
