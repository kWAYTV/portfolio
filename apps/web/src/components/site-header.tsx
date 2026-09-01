import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleLink } from "@/modules/i18n/routing";

const NAV = [
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/blog", key: "blog" },
] as const;

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <header className="site-header">
      <LocaleLink className="site-wordmark" href="/">
        {tCommon("siteName")}
      </LocaleLink>
      <nav aria-label={t("menu")} className="site-nav">
        {NAV.map((item) => (
          <LocaleLink href={item.href} key={item.href}>
            {t(item.key)}
          </LocaleLink>
        ))}
      </nav>
      <div className="site-controls">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}
