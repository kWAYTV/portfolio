/** biome-ignore-all lint/security/noDangerouslySetInnerHtml: shiki output is server-generated from static code strings */
import { codeToHtml } from "shiki";

interface CodeViewProps {
  code: string;
  lang: string;
}

export async function CodeView({ code, lang }: CodeViewProps) {
  const html = await codeToHtml(code.trim(), {
    lang,
    themes: {
      light: "github-light",
      dark: "github-dark-dimmed",
    },
  });

  return (
    <div
      className="code-view w-full overflow-x-auto px-2 py-6 font-mono text-[13px] leading-[20px]"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
