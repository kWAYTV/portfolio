import { Toaster } from "@portfolio/ui";
import { UmamiScript } from "@/components/analytics/umami-script";
import { ThemeProvider } from "@/components/theming/provider";
import "@/styles/globals.css";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { routing } from "@/i18n/routing";
import { fumadocsI18n } from "@/lib/i18n";
import { baseUrl, createMetadata, siteName } from "@/lib/metadata";

const { provider } = defineI18nUI(fumadocsI18n, {
  translations: {
    en: { displayName: "English" },
    es: { displayName: "Español" },
  },
});

export const metadata = {
  ...createMetadata({
    title: siteName,
    description: "welcome to my personal space.",
  }),
  alternates: {
    types: {
      "application/rss+xml": [
        { title: `Blog | ${siteName}`, url: `${baseUrl.origin}/rss` },
      ],
    },
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <>
      <UmamiScript />
      <NextIntlClientProvider messages={messages}>
        <RootProvider i18n={provider(locale)}>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </NuqsAdapter>
        </RootProvider>
      </NextIntlClientProvider>
    </>
  );
}
