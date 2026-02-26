import { Link } from "@i18n/routing";
import { Button, Separator } from "@portfolio/ui";
import { getTranslations } from "next-intl/server";
import { PageContent } from "@/components/shared/page-content";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <PageContent>
      <div className="space-y-1">
        <h1 className="font-medium text-base tracking-tight sm:text-lg">
          {t("title")}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {t("subtitle")}
        </p>
      </div>
      <Separator className="bg-border/50" />
      <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
        {t("description")}
      </p>
      <div className="flex flex-wrap items-center gap-3 pt-1 text-xs sm:gap-4 sm:text-sm">
        <Button asChild size="sm">
          <Link href="/">{t("home")}</Link>
        </Button>
      </div>
    </PageContent>
  );
}
