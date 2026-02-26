import { CodeEditor } from "./code-editor";

interface CodeViewProps {
  code: string;
  lang: string;
}

export function CodeView({ code, lang }: CodeViewProps) {
  return <CodeEditor code={code} lang={lang} />;
}
