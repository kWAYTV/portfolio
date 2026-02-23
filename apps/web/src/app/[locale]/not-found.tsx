import { Link } from "@i18n/routing";
import { Separator } from "@portfolio/ui";
import { getTranslations } from "next-intl/server";
import { PageContent } from "@/components/shared/page-content";
import { PageWrapper } from "@/components/shared/page-wrapper";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <PageWrapper>
      <PageContent>
        <div className="space-y-1">
          <h1 className="font-medium text-base tracking-tight sm:text-lg">
            {t("title")}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm">
            {t("subtitle")}
          </p>
        </div>
        <Separator />
        <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
          {t("description")}
        </p>
        <div className="flex items-center gap-3 text-muted-foreground text-xs sm:gap-4 sm:text-sm">
          <Link className="transition-colors hover:text-foreground" href="/">
            {t("home")}
          </Link>
        </div>
      </PageContent>
    </PageWrapper>
  );
}
