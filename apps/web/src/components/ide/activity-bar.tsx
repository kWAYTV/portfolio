"use client";

import { Link } from "@i18n/routing";
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@portfolio/ui";
import {
  BookOpen,
  Code2,
  FolderGit2,
  PanelLeft,
  Settings,
  User,
} from "lucide-react";
import { navItems } from "@/consts/nav-items";

const navIcons: Record<string, typeof Code2> = {
  home: Code2,
  about: User,
  projects: FolderGit2,
  blog: BookOpen,
};

interface ActivityBarProps {
  onToggleSidebar: () => void;
  pathname: string;
  sidebarOpen: boolean;
}

export function ActivityBar({
  pathname,
  sidebarOpen,
  onToggleSidebar,
}: ActivityBarProps) {
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <div className="flex w-12 shrink-0 flex-col items-center border-r border-[var(--ide-border)] bg-[var(--ide-activity-bar)] py-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "flex size-10 items-center justify-center text-[var(--ide-activity-bar-fg)] transition-colors hover:text-[var(--ide-activity-bar-active-fg)]",
              sidebarOpen && "text-[var(--ide-activity-bar-active-fg)]"
            )}
            onClick={onToggleSidebar}
            type="button"
          >
            <PanelLeft className="size-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">Explorer</TooltipContent>
      </Tooltip>

      <div className="my-1 h-px w-6 bg-[var(--ide-activity-bar-fg)]/20" />

      {navItems.map((item) => {
        const Icon = navIcons[item.label];
        const active = isActive(item.href);
        return (
          <Tooltip key={item.href}>
            <TooltipTrigger asChild>
              <Link
                className={cn(
                  "relative flex size-10 items-center justify-center text-[var(--ide-activity-bar-fg)] transition-colors hover:text-[var(--ide-activity-bar-active-fg)]",
                  active && "text-[var(--ide-activity-bar-active-fg)]"
                )}
                href={item.href}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-r-full bg-[var(--ide-activity-bar-badge)]" />
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

      <div className="mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex size-10 items-center justify-center text-[var(--ide-activity-bar-fg)] transition-colors hover:text-[var(--ide-activity-bar-active-fg)]"
              type="button"
            >
              <Settings className="size-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
