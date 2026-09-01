import { getTranslations } from "next-intl/server";
import { LocaleLink } from "@/modules/i18n/routing";

export async function Pagination({
  basePath = "/blog",
  currentPage,
  namespace = "blog",
  query,
  totalPages,
}: {
  basePath?: string;
  currentPage: number;
  namespace?: "blog" | "projects";
  query?: string;
  totalPages: number;
}) {
  const t = await getTranslations(namespace);

  if (totalPages <= 1) {
    return null;
  }

  const prevHref =
    currentPage > 1 ? pageHref(basePath, currentPage - 1, query) : null;
  const nextHref =
    currentPage < totalPages
      ? pageHref(basePath, currentPage + 1, query)
      : null;

  return (
    <nav aria-label="Pagination" className="pager">
      {prevHref ? (
        <LocaleLink href={prevHref}>{t("prev")}</LocaleLink>
      ) : (
        <span aria-disabled="true">{t("prev")}</span>
      )}
      <span className="tabular-nums">
        {currentPage} / {totalPages}
      </span>
      {nextHref ? (
        <LocaleLink href={nextHref}>{t("next")}</LocaleLink>
      ) : (
        <span aria-disabled="true">{t("next")}</span>
      )}
    </nav>
  );
}

function pageHref(basePath: string, page: number, query?: string): string {
  if (query !== undefined) {
    const params = new URLSearchParams(query);
    if (page > 1) {
      params.set("page", String(page));
    } else {
      params.delete("page");
    }
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return page === 1 ? basePath : `${basePath}/page/${page}`;
}
