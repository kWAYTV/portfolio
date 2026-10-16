"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

const themeScript = `(function(){try{var root=document.documentElement;var theme=localStorage.getItem("theme")||"system";if(theme==="system"){theme=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}root.classList.remove("light","dark");root.classList.add(theme);if(theme==="light"||theme==="dark")root.style.colorScheme=theme}catch(e){}})();`;

export function ThemeScript() {
  const inserted = useRef({ done: false });

  useServerInsertedHTML(() => {
    // biome-ignore lint/suspicious/noUnnecessaryConditions: flips after the first insert
    if (inserted.current.done) {
      return null;
    }
    inserted.current.done = true;
    return (
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: constant theme bootstrap, no user input
        dangerouslySetInnerHTML={{ __html: themeScript }}
        id="theme-script"
      />
    );
  });

  return null;
}
