export type EventData = Record<string, string | number | boolean>;

declare global {
  interface Window {
    umami?: {
      track: (event: string, data?: EventData) => void;
    };
  }
}

/**
 * Track a custom event with Umami
 * @param event - Event name (e.g., 'signup-click', 'download')
 * @param data - Optional event data
 */
export function trackEvent(event: string, data?: EventData): void {
  if (typeof window === "undefined" || !window.umami) {
    return;
  }
  window.umami.track(event, data);
}

export const analytics = {
  socialClick: (platform: string) => trackEvent("social-click", { platform }),
  projectClick: (name: string) => trackEvent("project-click", { name }),
  blogPostView: (slug: string) => trackEvent("blog-post-view", { slug }),
  themeToggle: (theme: "light" | "dark") =>
    trackEvent("theme-toggle", { theme }),
  resumeDownload: () => trackEvent("resume-download"),
  externalLink: (url: string) => trackEvent("external-link", { url }),
} as const;
