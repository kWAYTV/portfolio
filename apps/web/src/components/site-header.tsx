import { getTranslations } from "next-intl/server";
import { LocaleSwitch } from "@/components/locale-switch";
import { NavLinks } from "@/components/nav-links";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleLink } from "@/modules/i18n/routing";

export async function SiteHeader() {
  const t = await getTranslations("nav");
  const tCommon = await getTranslations("common");

  return (
    <header className="masthead">
      <LocaleLink className="wordmark" href="/">
        {tCommon("siteName")}
      </LocaleLink>
      <NavLinks
        items={[
          { href: "/about", label: t("about") },
          { href: "/projects", label: t("projects") },
        ]}
        menuLabel={t("menu")}
      />
      <div className="masthead-controls">
        <LocaleSwitch />
        <ThemeToggle />
      </div>
    </header>
  );
}
