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
      className="mt-2 rounded-md border border-border bg-muted/30 px-3 py-2 font-medium text-xs transition-colors hover:bg-muted/50"
      onClick={handleClick}
      type="button"
    >
      {t("changePreferences")}
    </button>
  );
}
