import { type PinnedRepo, summarizeContributions } from "@repo/github";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { type CSSProperties, Suspense } from "react";
import { ContributionGraph } from "@/components/contribution-graph";
import { ArrowIcon } from "@/components/icons";
import { RepoList } from "@/components/repo-list";
import { Bone, RowsSkeleton } from "@/components/skeleton";
import { SocialLinks } from "@/components/social-links";
import { experience } from "@/modules/about/consts/experience";
import { LocalClock } from "@/modules/home/components/local-clock";
import { SkillRail } from "@/modules/home/components/skill-rail";
import { LocaleLink } from "@/modules/i18n/routing";
import { PageTransition } from "@/modules/motion/page-transition";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getFeaturedRepos } from "@/modules/projects/lib/featured";
import {
  getGitHubContributionCalendar,
  getGitHubRepos,
} from "@/modules/projects/lib/github";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    description: t("siteDescription"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale]) }],
    },
    title: t("siteTitle"),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "hero" });
  const tRoot = await getTranslations({ locale });
  const tCommon = await getTranslations({ locale, namespace: "common" });
  const tAbout = await getTranslations({ locale, namespace: "about" });

  return (
    <PageTransition>
      <article className="document">
        <header className="ticket">
          <p className="ticket-status">
            <span aria-hidden="true" className="live-dot" />
            {t("open")}
            <span aria-hidden="true">·</span>
            {t("place")}
          </p>
          <h1 className="page-title" data-testid="home-shell">
            {tCommon("siteName")}
          </h1>
          <p className="role">{t("role")}</p>
          <p className="lede">
            <strong>{t("headline")}</strong> {t("bio")}
          </p>
          <div className="ticket-foot">
            <SocialLinks />
            <LocalClock />
          </div>
        </header>
        <SkillRail label={t("stack")} />
        <section aria-labelledby="experience" className="section">
          <div className="section-head">
            <h2 id="experience">{tAbout("experience")}</h2>
            <LocaleLink className="control" href="/about">
              {tAbout("title")}
              <ArrowIcon />
            </LocaleLink>
          </div>
          <ol className="timeline">
            {experience.map((item, index) => (
              <li
                className="timeline-item"
                key={item.id}
                style={{ "--i": index } as CSSProperties}
              >
                <span
                  aria-hidden="true"
                  className="timeline-dot"
                  data-current={index === 0 ? "true" : undefined}
                />
                <div className="timeline-body">
                  <span className="timeline-title">
                    {tRoot(`experience.${item.key}.role`)}
                  </span>
                  <span className="timeline-sub">
                    {tRoot(`experience.${item.key}.company`)}
                  </span>
                </div>
                <span className="timeline-meta">
                  {tRoot(`experience.${item.key}.period`)}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <Suspense fallback={<WorkSkeleton />}>
          <FeaturedWork locale={locale} />
        </Suspense>
        <Suspense fallback={<ActivitySkeleton />}>
          <Activity locale={locale} />
        </Suspense>
      </article>
    </PageTransition>
  );
}

function ActivitySkeleton() {
  return (
    <section aria-busy="true" className="section">
      <div className="section-head">
        <Bone className="bone-head" />
      </div>
      <Bone className="bone-stage" />
    </section>
  );
}

function WorkSkeleton() {
  return (
    <section aria-busy="true" className="section">
      <div className="section-head">
        <Bone className="bone-head" />
      </div>
      <RowsSkeleton count={3} />
    </section>
  );
}

async function Activity({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "graph" });
  const calendar = await getGitHubContributionCalendar();

  if (!calendar || calendar.days.length === 0) {
    return null;
  }

  const stats = summarizeContributions(calendar.days);
  const numbers = new Intl.NumberFormat(locale);

  return (
    <section
      aria-labelledby="activity"
      className="section"
      data-testid="home-activity"
    >
      <div className="section-head">
        <h2 id="activity">{t("title")}</h2>
      </div>
      <ContributionGraph
        days={calendar.days}
        locale={locale}
        total={calendar.total}
      />
      <dl className="facts">
        <div>
          <dd>{numbers.format(stats.activeDays)}</dd>
          <dt>{t("activeDays")}</dt>
        </div>
        <div>
          <dd>{t("days", { count: stats.longestStreak })}</dd>
          <dt>{t("longestStreak")}</dt>
        </div>
        <div>
          <dd>{t("days", { count: stats.currentStreak })}</dd>
          <dt>{t("currentStreak")}</dt>
        </div>
      </dl>
    </section>
  );
}

async function FeaturedWork({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "projects" });
  const repos: PinnedRepo[] = getFeaturedRepos(await getGitHubRepos()).map(
    (repo) => ({
      description: repo.description,
      fullName: repo.full_name,
      language: repo.language,
      name: repo.name,
      stars: repo.stargazers_count,
      url: repo.html_url,
    })
  );

  return (
    <section aria-labelledby="work" className="section">
      <div className="section-head">
        <h2 id="work">{t("featured")}</h2>
        <LocaleLink className="control" href="/projects">
          {t("viewAll")}
          <ArrowIcon />
        </LocaleLink>
      </div>
      {repos.length === 0 ? (
        <p className="meta">{t("noProjects")}</p>
      ) : (
        <RepoList
          locale={locale}
          repos={repos.map((repo) => ({
            description: repo.description,
            key: repo.fullName,
            language: repo.language,
            name: repo.name,
            stars: repo.stars,
            url: repo.url,
          }))}
        />
      )}
    </section>
  );
}
