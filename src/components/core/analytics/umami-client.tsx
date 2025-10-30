"use client";

// Umami tracking types
declare global {
  // biome-ignore lint/style/useConsistentTypeDefinitions: Window augmentation requires interface
  interface Window {
    umami?: {
      track: (
        eventOrCallback:
          | string
          | ((props: Record<string, unknown>) => {
              name: string;
              data?: Record<string, unknown>;
            }),
        data?: Record<string, unknown>
      ) => void;
    };
  }
}

export function useAnalytics() {
  const trackEvent = (event: string, data?: Record<string, unknown>) => {
    if (typeof window === "undefined" || !window.umami) {
      return;
    }

    if (data) {
      window.umami.track(event, data);
    } else {
      window.umami.track(event);
    }
  };

  return {
    trackEvent,
  };
}
