import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid h-full items-center justify-center gap-6">
        <section className="rounded-lg border p-4 text-center">
          <h2 className="mb-2 font-medium">{t("welcome")}</h2>
          <p>{t("siteDescription")}</p>
        </section>
      </div>
    </div>
  );
}
