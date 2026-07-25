import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageContent } from "@/components/shared/page-content";
import { CookiePreferencesButton } from "@/modules/privacy/components/cookie-preferences-button";

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
      <header className="space-y-2">
        <h1 className="font-display font-semibold text-2xl tracking-tight sm:text-3xl">
          {t("title")}
        </h1>
        <p className="max-w-[58ch] text-muted-foreground text-sm">
          {t("subtitle")}
        </p>
      </header>

      <div className="space-y-8 text-sm">
        <section className="max-w-[58ch] space-y-2 border-border border-t pt-5">
          <h2 className="font-display font-medium text-base text-foreground tracking-tight">
            {t("cookiesTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("cookiesBody")}
          </p>
        </section>

        <section className="max-w-[58ch] space-y-2 border-border border-t pt-5">
          <h2 className="font-display font-medium text-base text-foreground tracking-tight">
            {t("analyticsTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("analyticsBody")}
          </p>
        </section>

        <section className="max-w-[58ch] space-y-3 border-border border-t pt-5">
          <h2 className="font-display font-medium text-base text-foreground tracking-tight">
            {t("choicesTitle")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t("choicesBody")}
          </p>
          <CookiePreferencesButton />
        </section>
      </div>
    </PageContent>
  );
}
