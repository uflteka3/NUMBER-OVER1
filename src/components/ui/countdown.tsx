"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

function remaining(target: number) {
  return Math.max(0, target - Date.now());
}

/**
 * Compte à rebours mm:ss vers une date cible (ISO).
 * Rendu côté client uniquement (pas de mismatch d'hydratation).
 */
export function Countdown({
  to,
  onEnd,
  className,
  warnBelowMs = 60_000,
  prefix,
}: {
  to: string;
  onEnd?: () => void;
  className?: string;
  warnBelowMs?: number;
  prefix?: string;
}) {
  const [target] = useState(() => new Date(to).getTime());
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    let ended = false;
    const tick = () => {
      const r = remaining(target);
      setMs(r);
      if (r === 0 && !ended) {
        ended = true;
        clearInterval(id);
        onEnd?.();
      }
    };
    const id = setInterval(tick, 1000);
    const first = setTimeout(tick, 0); // première valeur au premier tick (asynchrone, hors cycle de rendu)
    return () => {
      clearInterval(id);
      clearTimeout(first);
    };
  }, [target, onEnd]);

  if (ms === null) return <span className={cn("font-mono", className)}>--:--</span>;

  const totalSec = Math.floor(ms / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  return (
    <span
      className={cn(
        "font-mono tabular-nums",
        ms > 0 && ms < warnBelowMs ? "text-danger-300" : "text-slate-200",
        className
      )}
    >
      {prefix}
      {mm}:{ss}
    </span>
  );
}
