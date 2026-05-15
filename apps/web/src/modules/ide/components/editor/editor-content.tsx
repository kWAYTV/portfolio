"use client";

import { useViewMode } from "@/modules/ide/components/shared/view-mode";

interface EditorContentProps {
  preview: React.ReactNode;
  source: React.ReactNode;
}

export function EditorContent({ preview, source }: EditorContentProps) {
  const { viewMode } = useViewMode();
  return <>{viewMode === "code" ? source : preview}</>;
}
