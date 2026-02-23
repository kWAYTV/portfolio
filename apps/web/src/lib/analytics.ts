// biome-ignore lint/performance/noBarrelFile: Re-export for @/lib/analytics consumers
export {
  analytics,
  type EventData,
  trackEvent,
} from "@portfolio/analytics";
