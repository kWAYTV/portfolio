import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { SearchIcon } from "@/components/icons";
import { Pagination } from "@/components/pagination";
import { RepoList } from "@/components/repo-list";
import { Bone, RowsSkeleton } from "@/components/skeleton";
import { LocaleLink } from "@/modules/i18n/routing";
import { getPageImageUrl } from "@/modules/og/lib/og";
import { getGitHubRepos } from "@/modules/projects/lib/github";
import {
  PROJECTS_PER_PAGE,
  type ProjectSort,
  parseProjectSort,
  queryProjects,
} from "@/modules/projects/lib/query";

const SORTS: ProjectSort[] = ["updated", "stars", "created", "name"];

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
        <h1 className="page-title">{t("title")}</h1>
        <p className="lede">{t("subtitle")}</p>
      </header>
      <Suspense fallback={<CatalogueSkeleton label={t("loading")} />}>
        <ProjectCatalogue locale={locale} searchParams={searchParams} />
      </Suspense>
    </article>
  );
}

function CatalogueSkeleton({ label }: { label: string }) {
  return (
    <section aria-busy="true" className="section">
      <div className="filters">
        <Bone className="bone-search" />
        <Bone className="bone-meta" />
      </div>
      <p className="meta">{label}</p>
      <RowsSkeleton count={PROJECTS_PER_PAGE} />
    </section>
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
    <section className="section">
      <div className="filters">
        <search>
          <form className="search">
            <SearchIcon />
            <input
              aria-label={t("search")}
              defaultValue={q}
              name="q"
              placeholder={t("searchPlaceholder")}
              type="search"
            />
            {sort === "updated" ? null : (
              <input name="sort" type="hidden" value={sort} />
            )}
            <button className="control" type="submit">
              {t("search")}
            </button>
          </form>
        </search>
        <nav aria-label="Sort" className="segment">
          {SORTS.map((value) => {
            const sortParams = new URLSearchParams();
            if (q) {
              sortParams.set("q", q);
            }
            if (value !== "updated") {
              sortParams.set("sort", value);
            }
            const href =
              sortParams.size > 0 ? `/projects?${sortParams}` : "/projects";
            return (
              <LocaleLink
                aria-current={value === sort ? "page" : undefined}
                className="control"
                href={href}
                key={value}
              >
                {t(`sort.${value}`)}
              </LocaleLink>
            );
          })}
        </nav>
      </div>
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
    </section>
  );
}
