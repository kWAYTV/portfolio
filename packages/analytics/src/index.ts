export type EventData = Record<string, string | number | boolean>;

/** localStorage key for analytics consent */
export const ANALYTICS_CONSENT_KEY = "analytics-consent";

/** Custom event dispatched when consent changes */
export const ANALYTICS_CONSENT_EVENT = "analytics-consent-changed";

/** Custom event to reset consent and re-show the cookie banner */
export const ANALYTICS_CONSENT_RESET = "analytics-consent-reset";

export type ConsentStatus = "accepted" | "declined" | null;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: EventData) => void;
    };
  }
}

/** Check if the user has accepted analytics cookies (client-only) */
export function hasConsent(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "accepted";
}

/**
 * Track a custom event with Umami.
 * No-ops if consent not granted or Umami not loaded.
 */
export function trackEvent(event: string, data?: EventData): void {
  if (typeof window === "undefined" || !hasConsent() || !window.umami) {
    return;
  }
  window.umami.track(event, data);
}

export const analytics = {
  /** Social nav link (github, twitter, linkedin, resume) */
  socialClick: (platform: string) => trackEvent("social-click", { platform }),
  /** Project card / featured project click */
  projectClick: (name: string) => trackEvent("project-click", { name }),
  /** Blog post view (page or card click) */
  blogPostView: (slug: string) => trackEvent("blog-post-view", { slug }),
  /** Theme light/dark toggle */
  themeToggle: (theme: "light" | "dark") =>
    trackEvent("theme-toggle", { theme }),
  /** Resume/download link */
  resumeDownload: () => trackEvent("resume-download"),
  /** Generic external link (url) */
  externalLink: (url: string) => trackEvent("external-link", { url }),

  // IDE / UX
  localeSwitch: (from: string, to: string) =>
    trackEvent("locale-switch", { from, to }),
  commandPaletteOpen: () => trackEvent("command-palette-open"),
  sidebarToggle: (open: boolean) => trackEvent("sidebar-toggle", { open }),
  terminalToggle: (open: boolean) => trackEvent("terminal-toggle", { open }),
  viewModeChange: (mode: "preview" | "code") =>
    trackEvent("view-mode-change", { mode }),
  copyContent: () => trackEvent("copy-content"),
  tabClose: (href: string) => trackEvent("tab-close", { href }),

  // Navigation
  paginationClick: (page: number, section: string) =>
    trackEvent("pagination-click", { page, section }),
  searchProjects: (query: string, results: number) =>
    trackEvent("search-projects", { query, results }),
  sortProjects: (sort: string) => trackEvent("sort-projects", { sort }),
  previewWindowOpen: () => trackEvent("preview-window-open"),
  viewOnGitHub: (target: string) => trackEvent("view-on-github", { target }),
} as const;
