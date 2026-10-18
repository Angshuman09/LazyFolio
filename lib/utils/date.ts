export function parseOptionalDate(value: string | null | undefined) {
  if (!value?.trim()) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

// Normalizes any date value to a YYYY-MM-DD string (UTC) for date inputs and
// snapshot comparison. Returns "" for empty values, or the raw string when it
// cannot be parsed as a date.
export function toYMD(val: string | Date | null | undefined): string {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
