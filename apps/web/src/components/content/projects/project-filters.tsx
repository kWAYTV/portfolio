"use client";

import {
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@portfolio/ui";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";

export const sortOptions = ["stars", "updated", "name", "created"] as const;
export type SortOption = (typeof sortOptions)[number];

interface ProjectFiltersProps {
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  search: string;
  sort: SortOption;
}

export const ProjectFilters = memo(function ProjectFilters({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: ProjectFiltersProps) {
  const t = useTranslations("projects");
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-muted-foreground/60" />
        <Input
          className="h-8 w-full border-transparent bg-muted/25 pl-8 text-xs transition-colors duration-200 placeholder:text-muted-foreground/50 focus:border-border focus:bg-transparent sm:text-sm"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder={t("searchPlaceholder")}
          type="search"
          value={search}
        />
      </div>
      <Select
        onValueChange={(v: string) => onSortChange(v as SortOption)}
        value={sort}
      >
        <SelectTrigger
          className="h-8 w-full border-transparent bg-muted/25 text-xs transition-colors duration-200 hover:bg-muted/40 sm:w-32 sm:text-sm"
          size="sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {t(`sort.${option}`)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});
