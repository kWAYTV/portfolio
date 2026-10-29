import { getMessagesForLocale } from "@repo/i18n";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/modules/i18n/routing";
import { fontVariables } from "@/modules/theming/fonts";
import { themeBootScript } from "@/modules/theming/theme-boot";
import "../index.css";

export const instant = false;

async function getNotFoundLocale() {
  const requested = (await headers()).get("x-next-intl-locale");
  return hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;
}

function localePath(locale: string, href: "/" | "/privacy") {
  if (locale === routing.defaultLocale) {
    return href;
  }
  return href === "/" ? `/${locale}` : `/${locale}${href}`;
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getNotFoundLocale();
  const messages = await getMessagesForLocale(locale);
  return {
    description: messages.notFound.description,
    title: `${messages.notFound.title} · ${messages.common.siteName}`,
  };
}

/**
 * `[locale]/layout.tsx` is the root layout, so URLs that match no page never
 * enter it. `next/root-params` is unavailable here; the middleware locale
 * header selects the copy.
 */
export default async function GlobalNotFound() {
  const locale = await getNotFoundLocale();
  const messages = await getMessagesForLocale(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={fontVariables}>
        <script
          // biome-ignore lint/security/noDangerouslySetInnerHtml: constant theme bootstrap, no user input
          dangerouslySetInnerHTML={{ __html: themeBootScript }}
        />
        <div className="paper-grain" />
        <div className="site-shell">
          <header className="masthead">
            <a className="wordmark" href={localePath(locale, "/")}>
              {messages.common.siteName}
            </a>
          </header>
          <main className="site-main">
            <article className="document">
              <header className="page-head">
                <h1 className="page-title">{messages.notFound.title}</h1>
                <p className="lede">{messages.notFound.description}</p>
              </header>
              <p>
                <a className="control" href={localePath(locale, "/")}>
                  {messages.notFound.home}
                </a>
              </p>
            </article>
          </main>
          <footer className="colophon">
            <a className="control" href={localePath(locale, "/privacy")}>
              {messages.footer.privacy}
            </a>
          </footer>
        </div>
      </body>
    </html>
  );
}
