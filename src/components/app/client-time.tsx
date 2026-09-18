"use client";

import { useMounted } from "@/lib/use-mounted";
import { formatDateFull, formatDateTime, formatRelative } from "@/lib/format";

/**
 * Horodatage rendu uniquement après hydratation : le serveur et le client
 * produisent exactement le même HTML initial (pas de mismatch de fuseau).
 */
export function ClientTime({
  iso,
  mode = "relative",
  className,
}: {
  iso: string;
  mode?: "relative" | "datetime" | "full";
  className?: string;
}) {
  const mounted = useMounted();

  if (!mounted) {
    return <span className={className}>…</span>;
  }

  const text =
    mode === "relative" ? formatRelative(iso) : mode === "datetime" ? formatDateTime(iso) : formatDateFull(iso);

  return (
    <time dateTime={iso} className={className} title={formatDateFull(iso)}>
      {text}
    </time>
  );
}
