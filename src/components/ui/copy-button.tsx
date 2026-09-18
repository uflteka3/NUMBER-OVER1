"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useToast } from "./toast";

/** Bouton de copie presse-papier avec confirmation visuelle (phase d'après-copie). */
export function CopyButton({
  value,
  label,
  toastMessage,
  className,
  children,
}: {
  value: string;
  label?: string;
  toastMessage?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Fallback navigateurs anciens / contextes non sécurisés
      const area = document.createElement("textarea");
      area.value = value;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    if (toastMessage) toast.push({ tone: "success", title: toastMessage });
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      onClick={copy}
      aria-label={label ?? `Copier ${value}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all duration-200",
        copied
          ? "bg-success-500/15 text-success-300"
          : "bg-white/[0.05] text-slate-400 hover:bg-white/[0.1] hover:text-white",
        className
      )}
    >
      {copied ? <Check className="size-3.5" strokeWidth={3} /> : <Copy className="size-3.5" />}
      {children ?? (copied ? "Copié !" : null)}
    </button>
  );
}
