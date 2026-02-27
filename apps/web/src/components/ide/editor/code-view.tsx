"use client";

import dynamic from "next/dynamic";

const CodeEditorDynamic = dynamic(
  () =>
    import("@/components/ide/editor/code-editor").then((m) => ({
      default: m.CodeEditor,
    })),
  {
    loading: () => (
      <div className="h-full min-h-[200px] animate-pulse rounded bg-muted/30" />
    ),
    ssr: false,
  }
);

interface CodeViewProps {
  code: string;
  lang: string;
}

export function CodeView({ code, lang }: CodeViewProps) {
  return <CodeEditorDynamic code={code} lang={lang} />;
}
