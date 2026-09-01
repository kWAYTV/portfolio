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

type ConsentValue = "accepted" | "declined";

function ConsentButton({
  className,
  label,
  onConsent,
  value,
}: {
  className?: string;
  label: string;
  onConsent: (value: ConsentValue) => void;
  value: ConsentValue;
}) {
  const handleClick = useCallback(() => {
    onConsent(value);
  }, [onConsent, value]);

  return (
    <button className={className} onClick={handleClick} type="button">
      {label}
    </button>
  );
}

export function CookieBanner() {
  const t = useTranslations("cookies");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!localStorage.getItem(ANALYTICS_CONSENT_KEY));
  }, []);

  useEffect(() => {
    const handler = () => {
      setVisible(true);
    };
    window.addEventListener(ANALYTICS_CONSENT_RESET, handler);
    return () => window.removeEventListener(ANALYTICS_CONSENT_RESET, handler);
  }, []);

  const setConsent = useCallback((value: ConsentValue) => {
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
    <aside className="cookie-banner">
      <LocaleLink href="/privacy">{t("bannerText")}</LocaleLink>
      <div className="cookie-actions">
        <ConsentButton
          className="cookie-accept"
          label={t("accept")}
          onConsent={setConsent}
          value="accepted"
        />
        <ConsentButton
          label={t("decline")}
          onConsent={setConsent}
          value="declined"
        />
      </div>
    </aside>
  );
}
