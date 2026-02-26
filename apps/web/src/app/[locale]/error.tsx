"use client";

import { Link } from "@i18n/routing";
import { Button, Separator } from "@portfolio/ui";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { PageContent } from "@/components/shared/page-content";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({
  error: err,
  reset,
}: ErrorBoundaryProps) {
  const t = useTranslations("error");

  useEffect(() => {
    console.error(err);
  }, [err]);

  return (
    <PageContent>
      <div className="space-y-1">
        <h1 className="font-medium text-base tracking-tight sm:text-lg">
          {t("title")}
        </h1>
        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          {t("description")}
        </p>
      </div>
      <Separator />
      <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-4 sm:text-sm">
        <Button onClick={reset} size="sm" variant="outline">
          {t("retry")}
        </Button>
        <Link
          className="text-muted-foreground transition-colors hover:text-foreground"
          href="/"
        >
          {t("home")}
        </Link>
      </div>
    </PageContent>
  );
}
