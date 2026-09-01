import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";

import "../../index.css";
import { env } from "@repo/env/web";
import { CookieBanner } from "@/components/cookie-banner";
import Providers from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { UmamiScript } from "@/modules/analytics/components/umami-script";
import { routing } from "@/modules/i18n/routing";
import { getStaticParams } from "@/modules/i18n/static";

const newsreader = Newsreader({
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return getStaticParams();
}

export const metadata: Metadata = {
  description: "welcome to my personal space.",
  metadataBase: new URL(env.NEXT_PUBLIC_SITE_URL),
  title: "Martín Vila",
};

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  setRequestLocale(locale);

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${newsreader.variable} ${ibmPlexMono.variable}`}>
        <UmamiScript
          scriptUrl={env.NEXT_PUBLIC_UMAMI_URL}
          websiteId={env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        />
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
