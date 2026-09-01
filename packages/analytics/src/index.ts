export type EventData = Record<string, string | number | boolean>;

export const ANALYTICS_CONSENT_KEY = "analytics-consent";
export const ANALYTICS_CONSENT_EVENT = "analytics-consent-changed";
export const ANALYTICS_CONSENT_RESET = "analytics-consent-reset";

export type ConsentStatus = "accepted" | "declined" | null;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: EventData) => void;
    };
  }
}

let consentCache: boolean | null = null;

export function invalidateConsentCache(): void {
  consentCache = null;
}

export function hasConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  if (consentCache !== null) {
    return consentCache;
  }
  consentCache = localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";
  return consentCache;
}

export function trackEvent(event: string, data?: EventData): void {
  if (typeof window === "undefined" || !hasConsent() || !window.umami) {
    return;
  }
  window.umami.track(event, data);
}

export const analytics = {
  blogPostView: (slug: string) => trackEvent("blog-post-view", { slug }),
  localeSwitch: (from: string, to: string) =>
    trackEvent("locale-switch", { from, to }),
  projectClick: (name: string) => trackEvent("project-click", { name }),
  resumeDownload: () => trackEvent("resume-download"),
  socialClick: (platform: string) => trackEvent("social-click", { platform }),
  themeToggle: (theme: "light" | "dark") =>
    trackEvent("theme-toggle", { theme }),
} as const;
