"use client";

import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { memo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
        <Search className="absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="h-9 w-full rounded-[var(--radius-control)] border-border bg-background pl-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-[var(--color-accent-signal)]"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onSearchChange(e.target.value)
          }
          placeholder={t("searchPlaceholder")}
          type="search"
          value={search}
        />
      </div>
      <Select onValueChange={(v) => onSortChange(v as SortOption)} value={sort}>
        <SelectTrigger className="h-9 w-full rounded-[var(--radius-control)] border-border bg-background text-sm transition-colors sm:w-36">
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
