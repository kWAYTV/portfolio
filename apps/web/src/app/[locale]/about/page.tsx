import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SocialLinks } from "@/components/social-links";
import { experience } from "@/modules/about/consts/experience";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "about"]) }],
    },
    title: `${t("title")} | Martin Vila`,
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <article className="document">
      <header>
        <h1 className="page-title">{t("about.title")}</h1>
        <p className="lede">{t("about.bio")}</p>
        <SocialLinks />
      </header>
      <section className="section">
        <div className="section-head">
          <h2>{t("about.experience")}</h2>
        </div>
        <div className="rows">
          {experience.map((item) => (
            <div className="row" key={item.id}>
              <span className="row-title">
                {t(`experience.${item.key}.role`)}
              </span>
              <span className="row-meta">
                {t(`experience.${item.key}.period`)}
              </span>
              <span className="row-sub">
                {t(`experience.${item.key}.company`)}
              </span>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}
