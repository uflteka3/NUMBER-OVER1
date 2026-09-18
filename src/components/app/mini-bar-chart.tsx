"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Mini histogramme CSS/SVG (aucune lib de chart — léger et sans tracking). */
export function MiniBarChart({
  data,
  className,
  valueLabel,
}: {
  data: Array<{ label: string; value: number }>;
  className?: string;
  valueLabel?: (v: number) => string;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={cn("flex items-end gap-2", className)} role="img" aria-label="Graphique en barres">
      {data.map((d, i) => {
        const height = Math.max(6, Math.round((d.value / max) * 100));
        return (
          <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
            <span className="font-mono text-[0.6rem] text-slate-500 opacity-0 transition-opacity group-hover:opacity-100">
              {valueLabel ? valueLabel(d.value) : d.value}
            </span>
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${height}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "w-full min-w-4 rounded-t-lg bg-gradient-to-t from-brand-600/50 to-accent-500/70",
                i === data.length - 1 && "from-brand-500 to-accent-400"
              )}
              style={{ height: `${height}%` }}
              title={`${d.label} : ${valueLabel ? valueLabel(d.value) : d.value}`}
            />
            <span className="font-mono text-[0.6rem] uppercase text-slate-600">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}
