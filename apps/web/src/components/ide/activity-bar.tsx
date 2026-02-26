"use client";

import { Link } from "@i18n/routing";
import {
  cn,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
  Moon,
  PanelLeft,
  Settings,
  Sun,
  Terminal,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

import { navItems } from "@/consts/nav-items";

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
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations("ide");
  const isDark = resolvedTheme === "dark";
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
              onCheckedChange={() => setTheme("light")}
            >
              <Sun className="size-3.5" />
              {t("lightTheme")}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={isDark}
              onCheckedChange={() => setTheme("dark")}
            >
              <Moon className="size-3.5" />
              {t("darkTheme")}
            </DropdownMenuCheckboxItem>
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
