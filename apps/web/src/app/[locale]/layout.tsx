import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";

import "../../index.css";
import { config as i18nConfig } from "@repo/i18n/config";
import { LocaleSwitcher } from "@/components/internationalization/locale-switcher";
import Providers from "@/components/providers";
import { ModeToggle } from "@/components/shared/mode-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const locales = Object.keys(i18nConfig.locales);

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: "Martín Vila — Portfolio",
  description: "welcome to my personal space.",
};

export default async function LocaleLayout({
  children,
  params,
}: PropsWithChildren<{ params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  setRequestLocale(locale);

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <div className="relative h-svh">
              <div className="absolute top-2 right-2 flex items-center gap-2">
                <LocaleSwitcher />
                <ModeToggle />
              </div>
              {children}
            </div>
          </NextIntlClientProvider>
        </Providers>
      </body>
    </html>
  );
}
