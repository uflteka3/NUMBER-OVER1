import { cn } from "@/lib/utils";

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizes = {
    sm: "size-7 text-[0.65rem]",
    md: "size-9 text-xs",
    lg: "size-16 text-xl",
  };

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--color-brand-500),var(--color-accent-600))] font-display font-bold text-white",
        sizes[size],
        className
      )}
    >
      {initials}
    </span>
  );
}
