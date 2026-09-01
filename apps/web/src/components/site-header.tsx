import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleLink } from "@/modules/i18n/routing";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <header>
      <div className="masthead">
        <LocaleLink className="masthead-wordmark" href="/">
          {tCommon("siteName")}
        </LocaleLink>
        <div className="masthead-controls">
          <LocaleSwitch />
          <ThemeToggle />
        </div>
      </div>
      <div className="masthead-row">
        <NavLinks
          items={[
            { href: "/about", label: t("about") },
            { href: "/projects", label: t("projects") },
            { href: "/blog", label: t("blog") },
          ]}
          menuLabel={t("menu")}
        />
        <span className="label">{tCommon("siteDescription")}</span>
      </div>
    </header>
  );
}
