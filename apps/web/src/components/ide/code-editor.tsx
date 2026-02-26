"use client";

import { javascript } from "@codemirror/lang-javascript";
import { markdown } from "@codemirror/lang-markdown";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    fontSize: "13px",
    height: "100%",
  },
  "&.cm-focused": {
    outline: "none",
  },
  ".cm-scroller": {
    fontFamily: "var(--font-mono), ui-monospace, monospace",
    lineHeight: "22px",
    padding: "16px 0",
  },
  ".cm-gutters": {
    backgroundColor: "var(--background)",
    color: "var(--muted-foreground)",
    border: "none",
    borderRight: "1px solid var(--border)",
    paddingLeft: "8px",
    opacity: "0.4",
  },
  ".cm-gutter": {
    minWidth: "3em",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "transparent",
  },
  ".cm-activeLine": {
    backgroundColor: "transparent",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--foreground)",
    borderLeftWidth: "1.5px",
  },
  ".cm-selectionBackground": {
    backgroundColor: "var(--accent) !important",
  },
  "&.cm-focused .cm-selectionBackground": {
    backgroundColor: "var(--accent) !important",
  },
  ".cm-content": {
    caretColor: "var(--foreground)",
    padding: "0 16px",
  },
  ".cm-line": {
    padding: "0",
  },
});

const highlight = HighlightStyle.define([
  { tag: tags.keyword, color: "var(--syntax-keyword)" },
  { tag: tags.controlKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.moduleKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.operatorKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.definitionKeyword, color: "var(--syntax-keyword)" },
  { tag: tags.string, color: "var(--syntax-string)" },
  { tag: tags.special(tags.string), color: "var(--syntax-string)" },
  { tag: tags.comment, color: "var(--syntax-comment)" },
  { tag: tags.lineComment, color: "var(--syntax-comment)" },
  { tag: tags.blockComment, color: "var(--syntax-comment)" },
  { tag: tags.number, color: "var(--syntax-number)" },
  { tag: tags.integer, color: "var(--syntax-number)" },
  { tag: tags.float, color: "var(--syntax-number)" },
  { tag: tags.bool, color: "var(--syntax-number)" },
  { tag: tags.typeName, color: "var(--syntax-type)" },
  { tag: tags.className, color: "var(--syntax-type)" },
  { tag: tags.definition(tags.typeName), color: "var(--syntax-type)" },
  {
    tag: tags.function(tags.variableName),
    color: "var(--syntax-function)",
  },
  {
    tag: tags.definition(tags.function(tags.variableName)),
    color: "var(--syntax-function)",
  },
  { tag: tags.tagName, color: "var(--syntax-tag)" },
  { tag: tags.angleBracket, color: "var(--syntax-tag)" },
  { tag: tags.attributeName, color: "var(--syntax-attribute)" },
  { tag: tags.propertyName, color: "var(--syntax-attribute)" },
  {
    tag: tags.definition(tags.propertyName),
    color: "var(--syntax-attribute)",
  },
  { tag: tags.punctuation, color: "var(--syntax-punctuation)" },
  { tag: tags.operator, color: "var(--syntax-punctuation)" },
  { tag: tags.variableName, color: "var(--foreground)" },
  { tag: tags.heading, color: "var(--syntax-keyword)", fontWeight: "bold" },
  { tag: tags.emphasis, fontStyle: "italic" },
  { tag: tags.strong, fontWeight: "bold" },
  { tag: tags.link, color: "var(--syntax-function)" },
  { tag: tags.url, color: "var(--syntax-string)" },
]);

const langExtensions: Record<string, () => ReturnType<typeof javascript>> = {
  tsx: () => javascript({ jsx: true, typescript: true }),
  typescript: () => javascript({ typescript: true }),
  markdown: () => markdown(),
  mdx: () => markdown(),
};

interface CodeEditorProps {
  code: string;
  lang: string;
}

export function CodeEditor({ code, lang }: CodeEditorProps) {
  const extensions = useMemo(() => {
    const langExt = langExtensions[lang];
    return [
      editorTheme,
      syntaxHighlighting(highlight),
      EditorState.readOnly.of(true),
      EditorView.editable.of(true),
      ...(langExt ? [langExt()] : []),
    ];
  }, [lang]);

  return (
    <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
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
