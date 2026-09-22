import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { Pagination } from "@/components/pagination";
import { ProjectFilters } from "@/components/project-filters";
import { RepoList } from "@/components/repo-list";
import { Bone, RowsSkeleton } from "@/components/skeleton";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getGitHubRepos } from "@/modules/projects/lib/github";
import {
  PROJECTS_PER_PAGE,
  parseProjectSort,
  queryProjects,
} from "@/modules/projects/lib/query";

type SearchParams = Promise<{ page?: string; q?: string; sort?: string }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return {
    description: t("subtitle"),
    openGraph: {
      images: [{ url: getPageImageUrl([locale, "projects"]) }],
    },
    title: `${t("title")} · Martin Vila`,
  };
}

export default async function ProjectsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: SearchParams;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <article className="document">
      <header className="page-head">
        <h1 className="page-title" data-testid="projects-shell">
          {t("title")}
        </h1>
        <p className="lede">{t("subtitle")}</p>
      </header>
      <section className="section">
        <Suspense fallback={<FiltersSkeleton />}>
          <ProjectFilters />
        </Suspense>
        <Suspense fallback={<CatalogueSkeleton label={t("loading")} />}>
          <ProjectCatalogue locale={locale} searchParams={searchParams} />
        </Suspense>
      </section>
    </article>
  );
}

function FiltersSkeleton() {
  return (
    <div aria-busy="true" className="filters">
      <Bone className="bone-search" />
      <Bone className="bone-meta" />
    </div>
  );
}

function CatalogueSkeleton({ label }: { label: string }) {
  return (
    <div aria-busy="true">
      <p className="meta">{label}</p>
      <RowsSkeleton count={PROJECTS_PER_PAGE} />
    </div>
  );
}

async function ProjectCatalogue({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: SearchParams;
}) {
  const query = await searchParams;
  const q = query.q ?? "";
  const sort = parseProjectSort(query.sort);
  const page = Number.parseInt(query.page ?? "1", 10) || 1;
  const t = await getTranslations({ locale, namespace: "projects" });
  const result = queryProjects(await getGitHubRepos(), { page, q, sort });
  const filterQuery = new URLSearchParams();
  if (q) {
    filterQuery.set("q", q);
  }
  if (sort !== "updated") {
    filterQuery.set("sort", sort);
  }

  return (
    <div data-testid="projects-catalogue">
      <p className="meta">
        {t("projectCount", { count: result.totalCount })}
        {q ? ` ${t("matching", { query: q })}` : ""}
      </p>
      {result.repos.length === 0 ? (
        <p className="meta">{t("noProjects")}</p>
      ) : (
        <RepoList
          locale={locale}
          repos={result.repos.map((repo) => ({
            description: repo.description,
            key: String(repo.id),
            language: repo.language,
            name: repo.name,
            stars: repo.stargazers_count,
            url: repo.html_url,
          }))}
        />
      )}
      <Pagination
        basePath="/projects"
        currentPage={result.page}
        query={filterQuery.toString()}
        totalPages={result.totalPages}
      />
    </div>
  );
}
