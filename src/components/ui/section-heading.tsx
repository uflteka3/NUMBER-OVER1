import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "./badge";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      <Reveal>
        <Badge tone="brand" className="font-mono uppercase tracking-[0.18em]">
          {eyebrow}
        </Badge>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.16}>
          <p className="mt-4 text-base leading-relaxed text-slate-400">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
