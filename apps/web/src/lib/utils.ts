import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format ISO date string as relative time (e.g. "2 hours ago") */
export function formatRelativeDate(isoDate: string, locale = "en"): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (diffDay >= 1) {
    return rtf.format(-diffDay, "day");
  }
  if (diffHr >= 1) {
    return rtf.format(-diffHr, "hour");
  }
  if (diffMin >= 1) {
    return rtf.format(-diffMin, "minute");
  }
  return rtf.format(-diffSec, "second");
}
