import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500"],
});

export function generateStaticParams() {
  return getStaticParams();
}

export const metadata: Metadata = {
  description:
    "Software developer. Backend services, web apps, and the tools around them.",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
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
