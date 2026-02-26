"use client";

import { updateLocale } from "@i18n/lib/update-locale";
import { getPathname, Link, routing, usePathname } from "@i18n/routing";
import type { Locale } from "@portfolio/i18n";
import {
  localeNames,
  localeToFlagEmoji,
} from "@portfolio/i18n/config";
import {
  cn,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import {
  BookOpen,
  Code2,
  FolderGit2,
  GitBranch,
  Languages,
  Moon,
  PanelLeft,
  Settings,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import { useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import { navItems } from "@/consts/nav-items";
import { useThemeTransition } from "@/components/theming/use-theme-transition";

const PORTFOLIO_REPO_URL = "https://github.com/kWAYTV/portfolio";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

interface ActivityBarProps {
  onOpenCommand: () => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  pathname: string;
  sidebarOpen: boolean;
  terminalOpen: boolean;
}

export function ActivityBar({
  pathname,
  sidebarOpen,
  terminalOpen,
  onOpenCommand,
  onToggleSidebar,
  onToggleTerminal,
}: ActivityBarProps) {
  const { resolvedTheme } = useTheme();
  const setThemeWithTransition = useThemeTransition();
  const settingsTriggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("ide");
  const locale = useLocale() as Locale;
  const pathnameI18n = usePathname();
  const [localePending, setLocalePending] = useState(false);
  const isDark = resolvedTheme === "dark";

  const handleLocaleChange = async (newLocale: string) => {
    const loc = newLocale as Locale;
    if (loc === locale || localePending) return;
    setLocalePending(true);
    try {
      await updateLocale(loc);
      const targetPath = getPathname({ href: pathnameI18n, locale: loc });
      window.location.assign(targetPath);
    } catch {
      setLocalePending(false);
    }
  };

  const handleThemeChange = (theme: "light" | "dark") => {
    const rect = settingsTriggerRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : undefined;
    void setThemeWithTransition(theme, origin);
  };
  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-full w-12 shrink-0 select-none flex-col items-center border-border border-r bg-sidebar py-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
              sidebarOpen && "text-sidebar-primary"
            )}
            onClick={onToggleSidebar}
            type="button"
          >
            <PanelLeft className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">{t("explorer")}</TooltipContent>
      </Tooltip>

      {navItems.map((item) => {
        const Icon = navIcons[item.label];
        const active = isActive(item.href);
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                className={cn(
                  "relative flex size-10 items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
                  active && "text-sidebar-primary"
                )}
                href={item.href}
              >
                {active && (
                  <span className="absolute top-1/2 left-0 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-sidebar-primary" />
                )}
                <Icon className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent className="capitalize" side="right">
              {item.label}
            </TooltipContent>
          </Tooltip>
        );
      })}

      <div className="mt-auto flex flex-col gap-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
              href={PORTFOLIO_REPO_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              <GitBranch className="size-5" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="right">{t("openRepo")}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary",
                terminalOpen && "text-sidebar-primary"
              )}
              onClick={onToggleTerminal}
              type="button"
            >
              <Terminal className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{t("terminal")}</TooltipContent>
        </Tooltip>
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <button
                  ref={settingsTriggerRef}
                  className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
                  type="button"
                >
                  <Settings className="size-5" />
                </button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="right">{t("settings")}</TooltipContent>
          </Tooltip>
          <DropdownMenuContent
            align="start"
            side="right"
            className="ide-dropdown w-44 rounded-sm border border-border bg-popover p-0.5 shadow-lg"
          >
            <DropdownMenuCheckboxItem
              checked={!isDark}
              onCheckedChange={() => handleThemeChange("light")}
            >
              <Sun className="size-3.5" />
              {t("lightTheme")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isDark}
              onCheckedChange={() => handleThemeChange("dark")}
            >
              <Moon className="size-3.5" />
              {t("darkTheme")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger
                className="pl-8"
                disabled={localePending}
              >
                <Languages className="size-3.5" />
                {t("language")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent
                className="ide-dropdown min-w-[8rem] rounded-sm border border-border bg-popover p-0.5 shadow-lg"
                sideOffset={4}
              >
                <DropdownMenuRadioGroup
                  onValueChange={handleLocaleChange}
                  value={locale}
                >
                  {routing.locales.map((loc) => (
                    <DropdownMenuRadioItem
                      className="cursor-pointer"
                      key={loc}
                      value={loc}
                    >
                      <span aria-hidden className="mr-2">
                        {localeToFlagEmoji(loc as Locale)}
                      </span>
                      {localeNames[loc as Locale]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator className="my-0.5" />
            <DropdownMenuItem onClick={onOpenCommand}>
              <span>{t("commandPalette")}</span>
              <DropdownMenuShortcut>{t("commandPaletteShortcut")}</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
