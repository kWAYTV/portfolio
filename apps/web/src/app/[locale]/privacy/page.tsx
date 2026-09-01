import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CookiePreferencesButton } from "@/modules/privacy/components/cookie-preferences-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return {
    description: t("subtitle"),
    title: `${t("title")} | Martin Vila`,
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
    <article className="document">
      <header>
        <h1 className="page-title">{t("title")}</h1>
        <p className="lede">{t("subtitle")}</p>
      </header>
      <section>
        <h2>{t("cookiesTitle")}</h2>
        <p className="page-copy">{t("cookiesBody")}</p>
      </section>
      <section>
        <h2>{t("analyticsTitle")}</h2>
        <p className="page-copy">{t("analyticsBody")}</p>
      </section>
      <section>
        <h2>{t("choicesTitle")}</h2>
        <p className="page-copy">{t("choicesBody")}</p>
        <CookiePreferencesButton />
      </section>
    </article>
  );
}
