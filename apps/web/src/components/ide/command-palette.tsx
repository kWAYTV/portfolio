"use client";

import { config, type Locale, localeToFlagEmoji } from "@repo/i18n/config";
import {
  BookOpen,
  ExternalLink,
  FileText,
  FolderGit2,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";
import { navItems } from "@/components/ide/config";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { REPO_URL } from "@/consts/ide-constants";
import { useThemeTransition } from "@/hooks/use-theme-transition";
import { updateLocale } from "@/modules/i18n/lib/update-locale";
import { useLocaleRouter } from "@/modules/i18n/routing";
import { useIdeStore } from "@/stores/ide-store";

const locales = Object.keys(config.locales) as Locale[];

const navIcons: Record<string, typeof Home> = {
  home: Home,
  about: FileText,
  projects: FolderGit2,
  blog: BookOpen,
};

export function CommandPalette() {
  const t = useTranslations("ide");
  const tNav = useTranslations("nav");
  const tLocale = useTranslations("localeSwitcher");
  const open = useIdeStore((s) => s.commandPaletteOpen);
  const setOpen = useIdeStore((s) => s.setCommandPaletteOpen);
  const router = useLocaleRouter();
  const locale = useLocale() as Locale;
  const { resolvedTheme } = useTheme();
  const setThemeWithTransition = useThemeTransition(280);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setOpen]);

  const closeAndNavigate = useCallback(
    (href: string) => {
      setOpen(false);
      router.push(href);
    },
    [router, setOpen]
  );

  const handleThemeToggle = useCallback(async () => {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    await setThemeWithTransition(next);
  }, [resolvedTheme, setThemeWithTransition]);

  const handleSetLocale = useCallback((loc: Locale) => {
    updateLocale(loc);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <CommandDialog
      className="top-1/2 left-1/2 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 gap-0 p-0"
      description={t("commandPlaceholder")}
      onOpenChange={setOpen}
      open={open}
      title={t("commandPalette")}
    >
      <div className="flex min-h-0 flex-col">
        <Command className="min-h-0 shrink border-0">
          <CommandInput placeholder={t("commandPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("noResults")}</CommandEmpty>
            <CommandGroup heading={t("navigation")}>
              {navItems.map((item) => {
                const Icon = navIcons[item.label] ?? Home;
                return (
                  <CommandItem
                    key={item.href}
                    onSelect={() => closeAndNavigate(item.href)}
                    value={`${tNav(item.label)} ${item.href}`}
                  >
                    <Icon className="size-4 shrink-0" />
                    {tNav(item.label)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={t("appearance")}>
              <CommandItem
                onSelect={handleThemeToggle}
                value="toggle dark light"
              >
                {isDark ? (
                  <Sun className="size-4 shrink-0" />
                ) : (
                  <Moon className="size-4 shrink-0" />
                )}
                {isDark ? t("lightTheme") : t("darkTheme")}
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading={tLocale("selectLanguage")}>
              {locales.map((loc) => (
                <CommandItem
                  key={loc}
                  onSelect={() => handleSetLocale(loc)}
                  value={`${config.locales[loc].label} ${loc}`}
                >
                  <span>{localeToFlagEmoji(loc)}</span>
                  {config.locales[loc].label}
                  {locale === loc && (
                    <CommandShortcut>
                      <span className="text-primary">✓</span>
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  window.open(REPO_URL, "_blank", "noopener,noreferrer");
                }}
                value="github repo view"
              >
                <ExternalLink className="size-4 shrink-0" />
                {t("viewOnGitHub")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="shrink-0 border-border border-t px-2 py-1.5 text-[10px] text-muted-foreground">
          <div className="flex items-center justify-end gap-1.5">
            <KbdGroup className="gap-0.5">
              <Kbd>Esc</Kbd>
            </KbdGroup>
            <span>{t("close")}</span>
          </div>
        </div>
      </div>
    </CommandDialog>
  );
}
