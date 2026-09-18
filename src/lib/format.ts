/** Formatage monétaire, dates et numéros — convention NUMBER OVER. */

export function formatUSD(cents: number, { sign = false }: { sign?: boolean } = {}) {
  const abs = Math.abs(cents);
  const body = (abs / 100).toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (sign) return `${cents < 0 ? "−" : "+"}${body} $`;
  return `${cents < 0 ? "−" : ""}${body} $`;
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateFull(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const RELATIVE = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

export function formatRelative(iso: string) {
  const diffMs = new Date(iso).getTime() - Date.now();
  const absSec = Math.abs(Math.round(diffMs / 1000));
  if (absSec < 60) return RELATIVE.format(Math.round(diffMs / 1000), "second");
  if (absSec < 3600) return RELATIVE.format(Math.round(diffMs / 60000), "minute");
  if (absSec < 86400) return RELATIVE.format(Math.round(diffMs / 3600000), "hour");
  return RELATIVE.format(Math.round(diffMs / 86400000), "day");
}

/** +44 7700 900123 → garde tel quel ; 447700900123 → +44 7700 900123 (best effort). */
export function formatPhone(raw: string) {
  if (raw.startsWith("+")) return raw;
  return `+${raw.replace(/(\d{2})(\d{4})(\d+)/, "$1 $2 $3")}`;
}
