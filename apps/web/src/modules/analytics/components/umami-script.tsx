"use client";

import { ANALYTICS_CONSENT_EVENT, hasConsent } from "@repo/analytics";
import Script from "next/script";
import { useEffect, useState } from "react";

/**
 * Loads Umami analytics script only when user accepts cookies.
 * Pageviews are tracked automatically; use @repo/analytics for custom events.
 */
export function UmamiScript({
  scriptUrl,
  websiteId,
}: {
  scriptUrl?: string;
  websiteId?: string;
}) {
  const [loadScript, setLoadScript] = useState(false);

  useEffect(() => {
    if (hasConsent()) {
      setLoadScript(true);
      return;
    }
    const handler = () => {
      if (hasConsent()) {
        setLoadScript(true);
      }
    };
    window.addEventListener(ANALYTICS_CONSENT_EVENT, handler);
    return () => window.removeEventListener(ANALYTICS_CONSENT_EVENT, handler);
  }, []);

  if (!(scriptUrl && websiteId && loadScript)) {
    return null;
  }

  return (
    <Script
      data-website-id={websiteId}
      defer
      src={scriptUrl}
      strategy="afterInteractive"
    />
  );
}
