"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  tone: ToastTone;
  title: string;
  description?: string;
}

interface ToastContextValue {
  push: (toast: Omit<Toast, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans <ToastProvider>");
  return ctx;
}

const toneStyles: Record<ToastTone, { icon: ReactNode; bar: string; ring: string }> = {
  success: {
    icon: <CheckCircle2 className="size-4 text-success-400" />,
    bar: "bg-success-400",
    ring: "border-success-500/25",
  },
  error: {
    icon: <XCircle className="size-4 text-danger-400" />,
    bar: "bg-danger-400",
    ring: "border-danger-500/25",
  },
  info: {
    icon: <Info className="size-4 text-accent-400" />,
    bar: "bg-accent-400",
    ring: "border-accent-500/25",
  },
  warning: {
    icon: <AlertTriangle className="size-4 text-warning-400" />,
    bar: "bg-warning-400",
    ring: "border-warning-500/25",
  },
};

const DURATION = 4200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (toast: Omit<Toast, "id">) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss]
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <div
            aria-live="polite"
            className="pointer-events-none fixed inset-x-0 top-4 z-[110] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
          >
            <AnimatePresence>
              {toasts.map((toast) => {
                const style = toneStyles[toast.tone];
                return (
                  <motion.div
                    key={toast.id}
                    layout
                    initial={{ opacity: 0, y: -16, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className={cn(
                      "glass-strong pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-xl border p-4 pr-10 shadow-glow",
                      style.ring
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 shrink-0">{style.icon}</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{toast.title}</p>
                        {toast.description && (
                          <p className="mt-0.5 text-xs leading-relaxed text-slate-400">
                            {toast.description}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => dismiss(toast.id)}
                      aria-label="Fermer la notification"
                      className="absolute right-2.5 top-2.5 rounded-full p-1 text-slate-500 transition-colors hover:bg-white/[0.08] hover:text-white"
                    >
                      <X className="size-3.5" />
                    </button>
                    <motion.span
                      className={cn("absolute bottom-0 left-0 h-0.5", style.bar)}
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: DURATION / 1000, ease: "linear" }}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastContext.Provider>
  );
}
