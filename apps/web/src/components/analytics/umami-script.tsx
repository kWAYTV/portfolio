import Script from "next/script";

/**
 * Loads Umami analytics script when env vars are configured.
 * Pageviews are tracked automatically; use @repo/analytics for custom events.
 */
export function UmamiScript({
  scriptUrl,
  websiteId,
}: {
  scriptUrl?: string;
  websiteId?: string;
}) {
  if (!(scriptUrl && websiteId)) {
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
