"use client";

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_CONSENT_RESET,
  invalidateConsentCache,
} from "@repo/analytics";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { LocaleLink } from "@/modules/i18n/routing";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(ANALYTICS_CONSENT_KEY));
  }, []);

  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener(ANALYTICS_CONSENT_RESET, handler);
    return () => window.removeEventListener(ANALYTICS_CONSENT_RESET, handler);
  }, []);

  const setConsent = useCallback((value: "accepted" | "declined") => {
    localStorage.setItem(ANALYTICS_CONSENT_KEY, value);
    invalidateConsentCache();
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value })
    );
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed right-4 bottom-4 left-4 z-50 mx-auto flex max-w-md flex-col gap-3 rounded-[var(--radius-panel)] border border-border bg-background px-4 py-3 shadow-sm sm:left-auto sm:w-auto sm:flex-row sm:items-center">
      <LocaleLink
        className="link-accent text-foreground text-sm"
        href="/privacy"
      >
        {t("bannerText")}
      </LocaleLink>
      <div className="flex shrink-0 gap-2">
        <button
          className="rounded-[var(--radius-control)] bg-[var(--color-accent-signal)] px-3 py-1.5 font-medium text-[var(--color-accent-ink)] text-xs transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
          onClick={() => setConsent("accepted")}
          type="button"
        >
          {t("accept")}
        </button>
        <button
          className="rounded-[var(--radius-control)] border border-border px-3 py-1.5 font-medium text-muted-foreground text-xs transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-2"
          onClick={() => setConsent("declined")}
          type="button"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
