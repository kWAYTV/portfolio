import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
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
      </header>
      <section>
        <h2>{t("about.experience")}</h2>
        <ul className="hairline-list">
          {experience.map((item) => (
            <li className="hairline-row" key={item.id}>
              <div className="min-w-0">
                <strong>{t(`experience.${item.key}.role`)}</strong>
                <p>{t(`experience.${item.key}.company`)}</p>
              </div>
              <span>{t(`experience.${item.key}.period`)}</span>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
