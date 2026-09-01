"use client";

import {
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_CONSENT_RESET,
  invalidateConsentCache,
} from "@repo/analytics";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

export function CookiePreferencesButton() {
  const t = useTranslations("privacy");
  const handleClick = useCallback(() => {
    localStorage.removeItem(ANALYTICS_CONSENT_KEY);
    invalidateConsentCache();
    window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_RESET));
  }, []);

  return (
    <button className="control" onClick={handleClick} type="button">
      {t("changePreferences")}
    </button>
  );
}
