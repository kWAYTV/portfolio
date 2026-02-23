import { defaultLocale, locales } from "@portfolio/i18n/config";
import { defineI18n } from "fumadocs-core/i18n";

export const fumadocsI18n = defineI18n({
  defaultLanguage: defaultLocale,
  languages: [...locales],
  fallbackLanguage: defaultLocale,
  parser: "dir",
});
