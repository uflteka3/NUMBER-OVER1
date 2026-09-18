import { cn } from "@/lib/utils";
import { useId } from "react";

export function LogoMark({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-9", className)} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-bg`} x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6f6cff" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" fill={`url(#${id}-bg)`} />
      <rect x="1.5" y="1.5" width="37" height="37" rx="11" stroke="white" strokeOpacity="0.22" />
      {/* N */}
      <path
        d="M11 29.5V13.2c0-.5.62-.75.95-.35l13.1 16.6c.33.42.95.17.95-.35V12.5"
        stroke="white"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* signal bars */}
      <rect x="29" y="24.5" width="2.6" height="5" rx="1.3" fill="white" fillOpacity="0.9" />
      <rect x="32.6" y="21.5" width="2.6" height="8" rx="1.3" fill="white" fillOpacity="0.55" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="font-display text-[1.05rem] font-bold tracking-tight text-white">
          NUMBER<span className="text-gradient">OVER</span>
        </span>
      )}
    </span>
  );
}
