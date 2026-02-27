"use client";

import { Code2 } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export function EditorTabsEmpty() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="h-[35px] shrink-0 border-border border-b bg-muted/80 shadow-(--shadow-elevation-sm)" />
      <Empty className="border-0 p-0">
        <EmptyHeader>
          <EmptyMedia variant="default">
            <Code2 className="size-12 text-muted-foreground/50" />
          </EmptyMedia>
          <EmptyTitle>No open editors</EmptyTitle>
          <EmptyDescription>Open a file from the sidebar</EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
