"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-4 text-left",
        disabled && "cursor-not-allowed opacity-50"
      )}
    >
      {(label || description) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-slate-100">{label}</span>}
          {description && <span className="mt-0.5 block text-xs text-slate-500">{description}</span>}
        </span>
      )}
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-[linear-gradient(100deg,var(--color-brand-500),var(--color-accent-500))]" : "bg-white/[0.1]"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
          className={cn(
            "absolute top-0.5 size-5 rounded-full bg-white shadow",
            checked ? "right-0.5" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}
