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
    title: `${t("title")} · Martin Vila`,
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
      <header className="page-head">
        <h1 className="page-title">{t("about.title")}</h1>
        <p className="lede">{t("about.bio")}</p>
        <SocialLinks />
      </header>
      <section aria-labelledby="experience" className="section">
        <div className="section-head">
          <h2 id="experience">{t("about.experience")}</h2>
        </div>
        <ol className="timeline">
          {experience.map((item) => (
            <li className="timeline-item" key={item.id}>
              <span aria-hidden="true" className="timeline-dot" />
              <div className="timeline-body">
                <span className="timeline-title">
                  {t(`experience.${item.key}.role`)}
                </span>
                <span className="timeline-sub">
                  {t(`experience.${item.key}.company`)}
                </span>
              </div>
              <span className="timeline-meta">
                {t(`experience.${item.key}.period`)}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </article>
  );
}
