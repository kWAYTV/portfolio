"use client";

import { Search } from "lucide-react";
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

const sortLabels: Record<SortOption, string> = {
  stars: "Stars",
  updated: "Updated",
  created: "Created",
  name: "Name",
};

type ProjectFiltersProps = {
  search: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
};

export function ProjectFilters({
  search,
  sort,
  onSearchChange,
  onSortChange,
}: ProjectFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="-translate-y-1/2 absolute top-1/2 left-2.5 size-3 text-muted-foreground/60" />
        <Input
          className="h-8 border-transparent bg-muted/25 pl-8 text-xs transition-colors duration-200 placeholder:text-muted-foreground/50 focus:border-border focus:bg-transparent sm:text-sm"
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search..."
          type="search"
          value={search}
        />
      </div>
      <Select onValueChange={(v) => onSortChange(v as SortOption)} value={sort}>
        <SelectTrigger
          className="h-8 w-20 border-transparent bg-muted/25 text-xs transition-colors duration-200 hover:bg-muted/40 sm:w-28 sm:text-sm"
          size="sm"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option} value={option}>
              {sortLabels[option]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
