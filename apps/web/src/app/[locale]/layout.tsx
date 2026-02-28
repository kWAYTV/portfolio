import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { PropsWithChildren } from "react";

import "../../index.css";
import { config as i18nConfig } from "@repo/i18n/config";
import { IdeLayout } from "@/components/ide/ide-layout";
import Providers from "@/components/providers";
import { getGitHubCommits } from "@/lib/github";

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

  const [messages, commits] = await Promise.all([
    getMessages(),
    getGitHubCommits(),
  ]);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
      >
        <RootProvider search={{ enabled: false }}>
          <Providers>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <IdeLayout commits={commits}>{children}</IdeLayout>
            </NextIntlClientProvider>
          </Providers>
        </RootProvider>
      </body>
    </html>
  );
}
