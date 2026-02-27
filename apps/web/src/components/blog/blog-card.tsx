"use client";

import { useTranslations } from "next-intl";
import { LocaleLink } from "@/modules/i18n/routing";

interface BlogCardProps {
  date?: string;
  description?: string;
  locale: string;
  title: string;
  url: string;
}

export function BlogCard({
  title,
  description,
  date,
  locale,
  url,
}: BlogCardProps) {
  const t = useTranslations("blog");
  const formattedDate = date
    ? new Date(date).toLocaleDateString(locale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : t("soon");

  return (
    <LocaleLink
      className="group -mx-2 flex flex-col gap-2 rounded-md px-2 py-3 transition-colors duration-200 hover:bg-muted/30 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
      href={url}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <h2 className="font-medium text-foreground/80 text-xs leading-relaxed transition-colors duration-200 group-hover:text-foreground sm:text-sm">
          {title}
        </h2>
        {description && (
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed sm:text-xs">
            {description}
          </p>
        )}
      </div>
      <time className="shrink-0 whitespace-nowrap text-[10px] text-muted-foreground/60 tabular-nums transition-colors duration-200 group-hover:text-muted-foreground/80 sm:text-xs">
        {formattedDate}
      </time>
    </LocaleLink>
  );
}
