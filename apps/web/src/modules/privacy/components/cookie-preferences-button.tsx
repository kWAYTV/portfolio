"use client";

import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_CONSENT_RESET,
  invalidateConsentCache,
} from "@repo/analytics";
import { useTranslations } from "next-intl";

export function CookiePreferencesButton() {
  const t = useTranslations("privacy");

  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }
    localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    invalidateConsentCache();
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_RESET));
  };

  return (
    <button
      className="mt-2 rounded-[var(--radius-control)] border border-border bg-background px-3 py-2 font-medium text-xs transition-colors hover:border-[var(--color-accent-signal)] hover:text-[var(--color-accent-signal)] focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
      onClick={handleClick}
      type="button"
    >
      {t("changePreferences")}
    </button>
  );
}
