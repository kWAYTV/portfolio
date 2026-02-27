"use client";

import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";
import { editorTheme } from "@/components/ide/editor/extensions/editor-theme";
import { syntaxHighlight } from "@/components/ide/editor/extensions/syntax-highlight";
import { langExtensions } from "@/components/ide/editor/extensions/supported-languages";

interface CodeEditorProps {
  code: string;
  lang: string;
}

export function CodeEditor({ code, lang }: CodeEditorProps) {
  const extensions = useMemo(() => {
    const langExt = langExtensions[lang];
    return [
      editorTheme,
      syntaxHighlight,
      EditorState.readOnly.of(true),
      EditorView.editable.of(true),
      ...(langExt ? [langExt()] : []),
    ];
  }, [lang]);

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-auto">
      <CodeMirror
        basicSetup={{
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          bracketMatching: true,
          closeBrackets: false,
          autocompletion: false,
          rectangularSelection: false,
          crosshairCursor: false,
          searchKeymap: false,
        }}
        extensions={extensions}
        height="100%"
        theme="none"
        value={code.trim()}
      />
    </div>
  );
}
