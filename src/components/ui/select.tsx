"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Sélectionner…",
  label,
  className,
}: {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      {label && (
        <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-white/[0.09] bg-white/[0.04] px-4 text-sm transition-all duration-200",
          "hover:border-white/[0.16] focus:border-brand-400/70 focus:outline-none focus:ring-4 focus:ring-brand-500/[0.15]",
          open && "border-brand-400/70 ring-4 ring-brand-500/[0.15]"
        )}
      >
        <span className={cn("flex min-w-0 items-center gap-2.5", !selected && "text-slate-500")}>
          {selected?.icon}
          <span className="truncate">{selected ? selected.label : placeholder}</span>
        </span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-slate-500 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE }}
            className="glass-strong absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-xl p-1.5 shadow-glow"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                      isSelected ? "bg-brand-500/15 text-white" : "text-slate-300 hover:bg-white/[0.05]"
                    )}
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      {option.icon}
                      <span className="truncate">{option.label}</span>
                      {option.hint && (
                        <span className="font-mono text-[0.65rem] text-slate-500">{option.hint}</span>
                      )}
                    </span>
                    {isSelected && <Check className="size-4 shrink-0 text-brand-300" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
