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
