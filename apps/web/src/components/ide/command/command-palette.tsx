"use client";

import { useRouter } from "@i18n/routing";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@portfolio/ui";
import {
  FileCode2,
  FileText,
  Home,
  Palette,
  PanelBottomClose,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";

import {
  THEME_PRESETS,
  type ThemePreset,
  useThemePreset,
} from "@/components/theming/theme-preset-context";
import { navItems } from "@/consts/nav-items";

interface CommandPaletteProps {
  onOpenChange: (open: boolean) => void;
  onToggleSidebar: () => void;
  onToggleTerminal: () => void;
  open: boolean;
  sidebarOpen: boolean;
  terminalOpen: boolean;
}

export function CommandPalette({
  open,
  onOpenChange,
  onToggleSidebar,
  onToggleTerminal,
  sidebarOpen,
  terminalOpen,
}: CommandPaletteProps) {
  const router = useRouter();
  const { setPreset } = useThemePreset();
  const t = useTranslations("ide");
  const tNav = useTranslations("nav");

  const runCommand = useCallback(
    (fn: () => void) => {
      fn();
      onOpenChange(false);
    },
    [onOpenChange]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const openPreview = useCallback(() => {
    const w = window.open(
      typeof window !== "undefined" ? window.location.href : "/",
      "_blank",
      "noopener,noreferrer,width=1200,height=800"
    );
    w?.focus();
  }, []);

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandInput placeholder={t("commandPlaceholder")} />
      <CommandList>
        <CommandEmpty>{t("noResults")}</CommandEmpty>
        <CommandGroup heading={t("navigation")}>
          {navItems.map((item) => (
            <CommandItem
              key={item.href}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              {item.href === "/" ? (
                <Home className="size-4" />
              ) : item.fileType === "mdx" ? (
                <FileCode2 className="size-4" />
              ) : (
                <FileText className="size-4" />
              )}
              <span className="capitalize">{tNav(item.label)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t("view")}>
          <CommandItem onSelect={() => runCommand(onToggleSidebar)}>
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
            <span>{sidebarOpen ? t("hideSidebar") : t("showSidebar")}</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(onToggleTerminal)}>
            <PanelBottomClose className="size-4" />
            <span>{terminalOpen ? t("hideTerminal") : t("showTerminal")}</span>
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(openPreview)}>
            <Play className="size-4" />
            <span>{t("openPreviewWindow")}</span>
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading={t("themePreset")}>
          {THEME_PRESETS.map((p) => (
            <CommandItem
              key={p}
              onSelect={() => runCommand(() => setPreset(p as ThemePreset))}
            >
              <Palette className="size-4" />
              <span>{t(`themePreset_${p}`)}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
