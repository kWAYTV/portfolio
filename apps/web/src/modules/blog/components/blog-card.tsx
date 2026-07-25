"use client";

import { analytics } from "@repo/analytics";
import { useTranslations } from "next-intl";
import { LocaleLink } from "@/modules/i18n/routing";

interface BlogCardProps {
  date?: string;
  description?: string;
  locale: string;
  slug?: string;
  title: string;
  url: string;
}

export function BlogCard({
  title,
  description,
  date,
  locale,
  slug,
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

  const slugForTracking = slug ?? url.split("/").filter(Boolean).at(-1) ?? url;

  return (
    <LocaleLink
      className="group row-hairline flex flex-col gap-2 py-4 transition-colors duration-200 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
      href={url}
      onClick={() => analytics.blogPostView(slugForTracking)}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <h2 className="font-display font-medium text-foreground text-sm tracking-tight transition-colors group-hover:text-[var(--color-accent-signal)] sm:text-base">
          {title}
        </h2>
        {description ? (
          <p className="max-w-[58ch] text-muted-foreground text-xs leading-relaxed sm:text-sm">
            {description}
          </p>
        ) : null}
      </div>
      <time className="shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums sm:text-xs">
        {formattedDate}
      </time>
    </LocaleLink>
  );
}
