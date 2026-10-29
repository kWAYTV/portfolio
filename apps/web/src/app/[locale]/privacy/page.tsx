import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { PageTransition } from "@/modules/motion/page-transition";
import { CookiePreferencesButton } from "@/modules/privacy/components/cookie-preferences-button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("privacy");
  return {
    description: t("subtitle"),
    title: `${t("title")} · Martin Vila`,
  };
}

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <PageTransition>
      <article className="document">
        <header className="page-head">
          <h1 className="page-title">{t("title")}</h1>
          <p className="lede">{t("subtitle")}</p>
        </header>
        <section className="section">
          <div className="section-head">
            <h2>{t("cookiesTitle")}</h2>
          </div>
          <p className="page-copy">{t("cookiesBody")}</p>
        </section>
        <section className="section">
          <div className="section-head">
            <h2>{t("analyticsTitle")}</h2>
          </div>
          <p className="page-copy">{t("analyticsBody")}</p>
        </section>
        <section className="section">
          <div className="section-head">
            <h2>{t("choicesTitle")}</h2>
          </div>
          <p className="page-copy">{t("choicesBody")}</p>
          <p>
            <CookiePreferencesButton />
          </p>
        </section>
      </article>
    </PageTransition>
  );
}
