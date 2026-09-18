import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

export function Card({
  hover = false,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean; children: ReactNode }) {
  return (
    <div
      className={cn(
        "glass rounded-2xl shadow-card",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
