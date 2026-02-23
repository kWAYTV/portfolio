import { routing } from "@i18n/routing";
import createMiddleware from "next-intl/middleware";

export const proxy = createMiddleware(routing);

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|rss|.*\\..*).*)"],
};
