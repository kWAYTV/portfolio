import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";

export const sortOptions = ["stars", "updated", "name", "created"] as const;
export type SortOption = (typeof sortOptions)[number];

export const projectsSearchParams = {
  page: parseAsInteger.withDefault(1),
  q: parseAsString.withDefault(""),
  sort: parseAsStringLiteral(sortOptions).withDefault("stars"),
};

export const projectsParamsCache =
  createSearchParamsCache(projectsSearchParams);
