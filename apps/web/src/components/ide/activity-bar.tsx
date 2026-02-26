"use client";

import { Link } from "@i18n/routing";
import { cn, Tooltip, TooltipContent, TooltipTrigger } from "@portfolio/ui";
import {
  BookOpen,
  Code2,
  FolderGit2,
  PanelLeft,
  Settings,
  Terminal,
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
  onToggleTerminal: () => void;
  pathname: string;
  sidebarOpen: boolean;
  terminalOpen: boolean;
}

export function ActivityBar({
  pathname,
  sidebarOpen,
  terminalOpen,
  onToggleSidebar,
  onToggleTerminal,
}: ActivityBarProps) {
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
        <TooltipContent side="right">Explorer</TooltipContent>
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
          <TooltipContent side="right">Terminal</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex size-10 cursor-pointer items-center justify-center text-sidebar-foreground/60 transition-colors hover:text-sidebar-primary"
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
