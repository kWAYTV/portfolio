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
  PanelBottomClose,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
} from "lucide-react";
import { useCallback, useEffect } from "react";

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
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
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
              <span className="capitalize">{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="View">
          <CommandItem
            onSelect={() => runCommand(onToggleSidebar)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
            <span>{sidebarOpen ? "Hide" : "Show"} sidebar</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(onToggleTerminal)}
          >
            <PanelBottomClose className="size-4" />
            <span>{terminalOpen ? "Hide" : "Show"} terminal</span>
            <CommandShortcut>⌘J</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(openPreview)}>
            <Play className="size-4" />
            <span>Open preview in new window</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
