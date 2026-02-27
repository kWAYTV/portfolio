import { getTranslations } from "next-intl/server";

interface AboutBioProps {
  locale: string;
}

export async function AboutBio({ locale }: AboutBioProps) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <p className="text-muted-foreground/80 text-xs leading-relaxed sm:text-sm">
      {t("bio")}
    </p>
  );
}
