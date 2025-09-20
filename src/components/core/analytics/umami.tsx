import Script from 'next/script';

import { env } from '@/env';

export async function AnalyticsScript() {
  'use cache';

  return (
    <Script
      async
      type='text/javascript'
      data-website-id={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
      src='https://metrics.kway.club/script.js'
    />
  );
}
