"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";
import { themeBootScript } from "@/modules/theming/theme-boot";

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
        dangerouslySetInnerHTML={{ __html: themeBootScript }}
        id="theme-script"
      />
    );
  });

  return null;
}
