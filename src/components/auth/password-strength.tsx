"use client";

import { cn } from "@/lib/utils";

function scorePassword(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(4, score) as 0 | 1 | 2 | 3 | 4;
}

const LABELS = ["", "Faible", "Moyen", "Bon", "Excellent"];
const COLORS = ["bg-white/10", "bg-danger-400", "bg-warning-400", "bg-accent-400", "bg-success-400"];

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);
  if (!password) return null;

  return (
    <div aria-live="polite">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= score ? COLORS[score] : "bg-white/10"
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Force : <span className="text-slate-300">{LABELS[score]}</span>
        {score < 2 && " — 8 caractères minimum, majuscules, chiffres et symboles recommandés."}
      </p>
    </div>
  );
}
