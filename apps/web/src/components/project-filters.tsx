"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { SearchIcon } from "@/components/icons";
import { Segment } from "@/components/segment";
import { LocaleLink } from "@/modules/i18n/routing";
import {
  type ProjectSort,
  parseProjectSort,
} from "@/modules/projects/lib/query";

const SORTS: ProjectSort[] = ["updated", "stars", "created", "name"];

export function ProjectFilters() {
  const t = useTranslations("projects");
  const params = useSearchParams();
  const q = params.get("q") ?? "";
  const sort = parseProjectSort(params.get("sort") ?? undefined);

  return (
    <div className="filters">
      <search>
        <form className="search">
          <SearchIcon />
          <input
            aria-label={t("search")}
            defaultValue={q}
            key={q}
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
      <Segment label="Sort">
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
      </Segment>
    </div>
  );
}
