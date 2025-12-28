type EventData = Record<string, string | number | boolean>;

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

// Pre-defined events for type safety
export const analytics = {
  // Social links
  socialClick: (platform: string) => trackEvent("social-click", { platform }),

  // Projects
  projectClick: (name: string) => trackEvent("project-click", { name }),

  // Blog
  blogPostView: (slug: string) => trackEvent("blog-post-view", { slug }),

  // Theme
  themeToggle: (theme: "light" | "dark") =>
    trackEvent("theme-toggle", { theme }),

  // Resume/CV
  resumeDownload: () => trackEvent("resume-download"),

  // External links
  externalLink: (url: string) => trackEvent("external-link", { url }),
} as const;

// Type declaration for umami on window
declare global {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Declaration merging requires interface
  interface Window {
    umami?: {
      track: (event: string, data?: EventData) => void;
    };
  }
}
