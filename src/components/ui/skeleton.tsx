import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-shimmer rounded-xl bg-gradient-to-r from-white/[0.04] via-white/[0.09] to-white/[0.04] bg-[length:200%_100%]",
        className
      )}
    />
  );
}
