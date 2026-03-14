import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CookiePreferencesButton } from "@/components/privacy/cookie-preferences-button";
import { PageContent } from "@/components/shared/page-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    title: `${t("title")} | Martin Vila`,
    description: t("subtitle"),
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");

  return (
    <PageContent>
      <header className="space-y-1.5">
        <h1 className="font-medium text-base tracking-tight sm:text-lg">
          {t("title")}
        </h1>
        <p className="text-muted-foreground/60 text-xs sm:text-sm">
          {t("subtitle")}
        </p>
      </header>

      <div className="space-y-6 text-sm">
        <section>
          <h2 className="font-medium text-foreground text-xs tracking-tight sm:text-sm">
            {t("cookiesTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("cookiesBody")}
          </p>
        </section>

        <section>
          <h2 className="font-medium text-foreground text-xs tracking-tight sm:text-sm">
            {t("analyticsTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("analyticsBody")}
          </p>
        </section>

        <section>
          <h2 className="font-medium text-foreground text-xs tracking-tight sm:text-sm">
            {t("choicesTitle")}
          </h2>
          <p className="mt-2 text-muted-foreground leading-relaxed">
            {t("choicesBody")}
          </p>
          <CookiePreferencesButton />
        </section>
      </div>
    </PageContent>
  );
}
