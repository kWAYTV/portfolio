import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { PropsWithChildren } from "react";

import "../../index.css";
import { env } from "@repo/env/web";
import { CookieBanner } from "@/components/cookie-banner";
import Providers from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UmamiScript } from "@/modules/analytics/components/umami-script";
import { getStaticParams } from "@/modules/i18n/static";
import { fontVariables } from "@/modules/theming/fonts";
import { ThemeScript } from "@/modules/theming/theme-script";

export function generateStaticParams() {
  return getStaticParams();
}

export const metadata: Metadata = {
  description:
    "Software developer. Backend services, web apps, and the tools around them.",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Martín Vila",
};

export default async function LocaleLayout({ children }: PropsWithChildren) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontVariables}>
        <ThemeScript />
        <UmamiScript
          scriptUrl={env.NEXT_PUBLIC_UMAMI_URL}
          websiteId={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
        <div className="paper-grain" />
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="site-shell">
              <SiteHeader />
              <main className="site-main">{children}</main>
              <SiteFooter />
            </div>
            <CookieBanner />
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
