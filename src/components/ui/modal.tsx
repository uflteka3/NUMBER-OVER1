"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  const widths = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
          <motion.div
            className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={cn(
              "glass-strong relative z-10 w-full rounded-2xl p-6 shadow-glow",
              widths[size]
            )}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: EASE }}
          >
            <button
              onClick={onClose}
              aria-label="Fermer"
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-500 transition-colors hover:bg-white/[0.08] hover:text-white"
            >
              <X className="size-4" />
            </button>
            {title && (
              <h2 className="font-display text-lg font-semibold tracking-tight text-white">
                {title}
              </h2>
            )}
            {description && <p className="mt-1 text-sm text-slate-400">{description}</p>}
            {children && <div className={cn(title ? "mt-5" : "")}>{children}</div>}
            {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
