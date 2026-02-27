import { getTranslations } from "next-intl/server";

interface HeroHeaderProps {
  locale: string;
}

export async function HeroHeader({ locale }: HeroHeaderProps) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <header className="space-y-1.5">
      <h1 className="font-medium text-base tracking-tight sm:text-lg">
        Martin Vila
      </h1>
      <p className="text-muted-foreground/80 text-xs sm:text-sm">
        {t("tagline")}
      </p>
    </header>
  );
}
