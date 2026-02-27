import { getTranslations } from "next-intl/server";

interface HeroBioProps {
  locale: string;
}

export async function HeroBio({ locale }: HeroBioProps) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
      {t("bio")}
    </p>
  );
}
