"use client";

/**
 * IdeLayoutStructure: Pushes dynamic boundary (pathname) down via Suspense.
 * Page content (children) is in the static tree; IDE chrome streams in.
 * Per Vercel best practices: async-suspense-boundaries, push dynamic as far down as possible.
 */
import { cn, TooltipProvider } from "@portfolio/ui";
import dynamic from "next/dynamic";
import { parseAsBoolean, useQueryState } from "nuqs";
import { Suspense, useMemo, useRef } from "react";
import { IdeChrome } from "@/components/ide/layout/ide-chrome";
import { IdeChromeContent } from "@/components/ide/layout/ide-chrome-content";
import { IdeLayout } from "@/components/ide/layout/ide-layout";
import { IdeLayoutEmbed } from "@/components/ide/layout/ide-layout-embed";
import { IdeLayoutSkeleton } from "@/components/ide/layout/ide-layout-skeleton";
import { ViewModeProvider } from "@/components/ide/shared/view-mode";
import { TerminalPanel } from "@/components/ide/terminal/terminal-panel";
import { useIdeKeyboardShortcuts } from "@/hooks/use-ide-keyboard-shortcuts";
import { useEditorGroupsStore } from "@/stores/editor-groups-store";
import { useIdeLayoutStore } from "@/stores/ide-layout-store";

const CommandPalette = dynamic(
  () =>
    import("@/components/ide/command/command-palette").then((m) => ({
      default: m.CommandPalette,
    })),
  { ssr: false }
);

interface IdeLayoutStructureProps {
  children: React.ReactNode;
}

export function IdeLayoutStructure({ children }: IdeLayoutStructureProps) {
  const layout = useIdeLayoutStore();
  const [embed] = useQueryState("embed", parseAsBoolean.withDefault(false));
  const contentRef = useRef<HTMLDivElement>(null);

  const hasSplit = useEditorGroupsStore((s) => s.editorGroups.length > 1);

  const viewModeValue = useMemo(
    () => ({ viewMode: layout.viewMode, setViewMode: layout.setViewMode }),
    [layout.viewMode, layout.setViewMode]
  );

  useIdeKeyboardShortcuts({
    contentRef,
    onToggleSidebar: layout.toggleSidebar,
    onToggleTerminal: layout.toggleTerminal,
  });

  if (embed) {
    return <IdeLayoutEmbed>{children}</IdeLayoutEmbed>;
  }

  if (hasSplit) {
    return <IdeLayout>{children}</IdeLayout>;
  }

  return (
    <ViewModeProvider value={viewModeValue}>
      <TooltipProvider delayDuration={300}>
        <CommandPalette
          onOpenChange={layout.setCommandOpen}
          onToggleSidebar={layout.toggleSidebar}
          onToggleTerminal={layout.toggleTerminal}
          open={layout.commandOpen}
          sidebarOpen={layout.sidebarOpen}
          terminalOpen={layout.terminalOpen}
        />
        <div
          className="grid h-dvh overflow-hidden bg-background"
          style={{
            gridTemplateAreas:
              "'title title' 'activity sidebar content' 'mobile mobile mobile' 'status status'",
            gridTemplateColumns: layout.sidebarOpen
              ? "48px 224px 1fr"
              : "48px 0 1fr",
            gridTemplateRows: "auto 1fr auto auto",
          }}
        >
          {/* Static: page content - no pathname */}
          <div
            className="flex min-h-0 min-w-0 flex-col overflow-hidden"
            style={{ gridArea: "content" }}
          >
            <Suspense fallback={<div className="h-9 shrink-0 border-b" />}>
              <IdeChromeContent />
            </Suspense>
            <main
              className={cn(
                "min-h-0 w-full min-w-0 flex-1 overflow-y-auto",
                layout.viewMode === "preview" && "min-h-full"
              )}
              data-ide-main
              data-preview
            >
              {children}
            </main>
            <TerminalPanel
              isOpen={layout.terminalOpen}
              onClose={() => layout.setTerminalOpen(false)}
            />
          </div>
          {/* Dynamic: IDE chrome (pathname-dependent) */}
          <Suspense
            fallback={<IdeLayoutSkeleton>{children}</IdeLayoutSkeleton>}
          >
            <IdeChrome />
          </Suspense>
        </div>
      </TooltipProvider>
    </ViewModeProvider>
  );
}
