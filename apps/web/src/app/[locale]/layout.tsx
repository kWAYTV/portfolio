import { Toaster } from "@portfolio/ui";
import Script from "next/script";
import { UmamiScript } from "@/components/analytics/umami-script";
import { IdeLayoutSkeleton } from "@/components/ide/layout/ide-layout-skeleton";
import { IdeLayoutWithCommits } from "@/components/ide/layout/ide-layout-with-commits";
import { ThemeProvider } from "@/components/theming/provider";
import { ThemePresetProvider } from "@/components/theming/theme-preset-context";
import "@/styles/globals.css";
import { routing } from "@i18n/routing";
import { defineI18nUI } from "fumadocs-ui/i18n";
import { RootProvider } from "fumadocs-ui/provider/next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";
import { fumadocsI18n } from "@/lib/i18n";
import { baseUrl, createMetadata, siteName } from "@/lib/metadata";

const { provider } = defineI18nUI(fumadocsI18n, {
  translations: {
    en: { displayName: "English" },
    es: { displayName: "Español" },
  },
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { getTranslations } = await import("next-intl/server");
  const t = await getTranslations({ locale, namespace: "common" });

  return {
    ...createMetadata({
      title: siteName,
      description: t("siteDescription"),
    }),
    alternates: {
      types: {
        "application/rss+xml": [
          { title: `Blog | ${siteName}`, url: `${baseUrl.origin}/rss` },
        ],
      },
    },
  };
}

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
      <Script id="theme-preset-init" strategy="beforeInteractive">
        {`(function(){var p=localStorage.getItem("ide-theme-preset")||"default";if(p!=="default")document.documentElement.dataset.theme=p})();`}
      </Script>
      <UmamiScript />
      <NextIntlClientProvider messages={messages}>
        <RootProvider i18n={provider(locale)} search={{ enabled: false }}>
          <NuqsAdapter>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              disableTransitionOnChange
              enableSystem
            >
              <ThemePresetProvider>
                <Suspense
                  fallback={<IdeLayoutSkeleton>{children}</IdeLayoutSkeleton>}
                >
                  <IdeLayoutWithCommits>{children}</IdeLayoutWithCommits>
                </Suspense>
                <Toaster richColors />
              </ThemePresetProvider>
            </ThemeProvider>
          </NuqsAdapter>
        </RootProvider>
      </NextIntlClientProvider>
    </>
  );
}
