import { getTranslations } from "next-intl/server";

export async function HeroBio() {
  const t = await getTranslations("hero");

  return (
    <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
      {t("bio")}
    </p>
  );
}
