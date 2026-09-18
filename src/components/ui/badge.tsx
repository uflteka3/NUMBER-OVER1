import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type Tone = "neutral" | "brand" | "accent" | "success" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "border-white/10 bg-white/[0.06] text-slate-300",
  brand: "border-brand-500/30 bg-brand-500/[0.12] text-brand-200",
  accent: "border-accent-500/30 bg-accent-500/[0.12] text-accent-200",
  success: "border-success-500/30 bg-success-500/[0.12] text-success-300",
  warning: "border-warning-500/30 bg-warning-500/[0.12] text-warning-300",
  danger: "border-danger-500/30 bg-danger-500/[0.12] text-danger-300",
};

const dotTones: Record<Tone, string> = {
  neutral: "bg-slate-400",
  brand: "bg-brand-400",
  accent: "bg-accent-400",
  success: "bg-success-400",
  warning: "bg-warning-400",
  danger: "bg-danger-400",
};

export function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  className,
  children,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-tight",
        tones[tone],
        className
      )}
    >
      {dot && (
        <span className={cn("relative flex size-1.5", pulse && "size-2")}>
          {pulse && (
            <span
              className={cn(
                "absolute inline-flex size-full animate-ping rounded-full opacity-60",
                dotTones[tone]
              )}
            />
          )}
          <span className={cn("relative inline-flex size-full rounded-full", dotTones[tone])} />
        </span>
      )}
      {children}
    </span>
  );
}
