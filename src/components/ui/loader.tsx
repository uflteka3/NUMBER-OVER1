import { cn } from "@/lib/utils";

export function Spinner({ className, label = "Chargement" }: { className?: string; label?: string }) {
  return (
    <span role="status" aria-label={label} className={cn("inline-flex", className)}>
      <svg
        className="size-full animate-spin"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="12"
          cy="12"
          r="9.5"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2.5"
        />
        <path
          d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

export function Dots({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-blink rounded-full bg-current"
          style={{ animationDelay: `${i * 0.22}s` }}
        />
      ))}
    </span>
  );
}
