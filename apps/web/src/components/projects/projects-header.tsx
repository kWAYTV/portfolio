import { getTranslations } from "next-intl/server";

interface ProjectsHeaderProps {
  locale: string;
}

export async function ProjectsHeader({ locale }: ProjectsHeaderProps) {
  const t = await getTranslations({ locale, namespace: "projects" });

  return (
    <header className="space-y-1.5">
      <h1 className="font-medium text-base tracking-tight sm:text-lg">
        {t("title")}
      </h1>
      <p className="text-muted-foreground/60 text-xs sm:text-sm">
        {t("subtitle")}
      </p>
    </header>
  );
}
