import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  trend,
  tint = "brand",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  trend?: { value: string; positive: boolean };
  tint?: "brand" | "accent" | "success" | "warning" | "danger";
}) {
  const tints = {
    brand: "bg-brand-500/15 text-brand-300",
    accent: "bg-accent-500/15 text-accent-300",
    success: "bg-success-500/15 text-success-300",
    warning: "bg-warning-500/15 text-warning-300",
    danger: "bg-danger-500/15 text-danger-300",
  };

  return (
    <Card hover className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</p>
          <p className="mt-2 truncate font-display text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
          {(sub || trend) && (
            <p className="mt-1.5 flex items-center gap-2 text-xs text-slate-500">
              {trend && (
                <span className={cn("font-mono font-medium", trend.positive ? "text-success-400" : "text-danger-400")}>
                  {trend.positive ? "▲" : "▼"} {trend.value}
                </span>
              )}
              {sub}
            </p>
          )}
        </div>
        <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-xl", tints[tint])}>
          <Icon className="size-4.5" />
        </span>
      </div>
    </Card>
  );
}
