"use client";

import {
  ANALYTICS_CONSENT_EVENT,
  ANALYTICS_CONSENT_KEY,
  ANALYTICS_CONSENT_RESET,
} from "@repo/analytics";
import { Cookie } from "lucide-react";
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
    setVisible(false);
    window.dispatchEvent(
      new CustomEvent(ANALYTICS_CONSENT_EVENT, { detail: value })
    );
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-background px-4 py-2 font-medium text-sm shadow-sm ring-1 ring-border">
      <div className="flex items-center gap-2">
        <Cookie className="size-5 shrink-0 text-muted-foreground" />
        <LocaleLink
          className="relative text-foreground transition-colors after:absolute after:right-0 after:bottom-0.5 after:left-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 hover:text-foreground/90 hover:after:scale-x-100"
          href="/privacy"
        >
          {t("bannerText")}
        </LocaleLink>
      </div>
      <div className="flex shrink-0 gap-1">
        <button
          className="flex size-5 items-center justify-center rounded-full bg-green-600 text-white transition-colors hover:bg-green-700"
          onClick={() => setConsent("accepted")}
          title={t("accept")}
          type="button"
        >
          <span className="font-semibold text-[10px]">✓</span>
        </button>
        <button
          className="flex size-5 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
          onClick={() => setConsent("declined")}
          title={t("decline")}
          type="button"
        >
          <span className="font-semibold text-[10px]">✕</span>
        </button>
      </div>
    </div>
  );
}
