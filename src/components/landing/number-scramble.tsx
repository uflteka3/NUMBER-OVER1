"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const DIGITS = "0123456789";

/**
 * Révélation d'un numéro chiffre par chiffre (effet "décodage").
 * Les caractères non numériques (+, espaces) restent fixes.
 */
export function NumberScramble({
  value,
  duration = 0.9,
  className,
}: {
  value: string;
  duration?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduced) return; // rendu statique de `value`, sans animer le state
    const chars = value.split("");
    const controls = animate(0, chars.length, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const settled = Math.floor(latest);
        setDisplay(
          chars
            .map((c, i) => {
              if (!/[0-9]/.test(c)) return c;
              if (i < settled) return c;
              return DIGITS[Math.floor(Math.random() * 10)];
            })
            .join("")
        );
      },
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [value, duration, reduced]);

  return (
    <span className={className} aria-label={value}>
      {reduced ? value : display}
    </span>
  );
}
