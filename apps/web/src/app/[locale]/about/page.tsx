import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { SocialLinks } from "@/components/social-links";
import { experience } from "@/modules/about/consts/experience";
import { PageTransition } from "@/modules/motion/page-transition";
import { getPageImageUrl } from "@/modules/og/lib/og";

export async function generateMetadata(): Promise<Metadata> {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("about"),
  ]);
  return {
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "about"]) }],
    },
    title: `${t("title")} · Martin Vila`,
  };
}

export default async function AboutPage() {
  const t = await getTranslations();

  return (
    <PageTransition>
      <article className="document">
        <header className="page-head">
          <h1 className="page-title" data-testid="about-shell">
            {t("about.title")}
          </h1>
          <p className="lede">{t("about.bio")}</p>
          <SocialLinks />
        </header>
        <section aria-labelledby="experience" className="section">
          <div className="section-head">
            <h2 id="experience">{t("about.experience")}</h2>
          </div>
          <ol className="timeline">
            {experience.map((item, index) => (
              <li
                className="timeline-item"
                key={item.id}
                style={{ "--i": index } as CSSProperties}
              >
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
    </PageTransition>
  );
}
